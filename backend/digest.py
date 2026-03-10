"""
Daily score digest email sender — uses Resend API (free tier: 100 emails/day).

Setup required:
  1. Create a free account at https://resend.com
  2. Verify your sending domain in the Resend dashboard
  3. Update _FROM below with your verified domain
  4. Add RESEND_API_KEY to your .env and GitHub Actions secrets
"""

import os
import sys
import urllib.parse
from datetime import datetime, timezone
from typing import Optional

import requests

# ─── Sender address ──────────────────────────────────────────────────────────
# Before you have a verified domain: use Resend's shared test address below.
# Emails will work but may land in spam for some providers.
#
# Once you verify your domain in Resend dashboard → Domains:
#   Change to: "Funding Score <digest@yourdomain.com>"
_FROM = "US Funding Climate <digest@usfundingclimate.com>"
# ─────────────────────────────────────────────────────────────────────────────

_RESEND_URL = "https://api.resend.com/emails"

_SCORE_COLORS = {
    "Optimal":  "#16a34a",
    "Moderate": "#d97706",
    "Risky":    "#ea580c",
    "Critical": "#dc2626",
}


def _build_html(
    score: int,
    label: str,
    reasoning: list[str],
    post_title: str,
    post_url: str,
    cpi_yoy: Optional[float],
    nfib_optimism: Optional[float],
    site_url: str,
    unsubscribe_url: str,
) -> str:
    color = _SCORE_COLORS.get(label, "#475569")
    date_str = datetime.now(timezone.utc).strftime("%B %d, %Y")

    bullets_html = "".join(
        f'<div style="background:#f8fafc;border-left:3px solid #3b82f6;padding:10px 14px;'
        f'margin:6px 0;border-radius:0 8px 8px 0;font-size:13px;color:#334155;line-height:1.5">'
        f"{b}</div>"
        for b in reasoning
    )

    cpi_html = (
        f'<tr><td style="padding:0 32px 6px;font-size:13px;color:#64748b">'
        f'Inflation (CPI YoY): <strong style="color:#0f172a">{cpi_yoy:.1f}%</strong>'
        f'<span style="color:#94a3b8"> &nbsp;·&nbsp; Fed target: 2.0%</span></td></tr>'
    ) if cpi_yoy is not None else ""

    nfib_html = (
        f'<tr><td style="padding:0 32px 12px;font-size:13px;color:#64748b">'
        f'NFIB Small Business Optimism: <strong style="color:#0f172a">{nfib_optimism:.1f}</strong>'
        f'<span style="color:#94a3b8"> &nbsp;·&nbsp; neutral: 98</span></td></tr>'
    ) if nfib_optimism is not None else ""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>US Business Funding Climate Score — {date_str}</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;
             background:#f1f5f9;margin:0;padding:20px">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:16px;overflow:hidden;
                    box-shadow:0 1px 3px rgba(0,0,0,.1);max-width:580px">

        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:18px 32px">
            <p style="margin:0;color:#94a3b8;font-size:11px;font-weight:700;
                      letter-spacing:2px;text-transform:uppercase">
              US Business Funding Climate Score &nbsp;·&nbsp; {date_str}
            </p>
          </td>
        </tr>

        <!-- Score -->
        <tr>
          <td style="padding:32px;text-align:center;border-bottom:1px solid #f1f5f9">
            <div style="font-size:80px;font-weight:900;line-height:1;color:{color}">{score}</div>
            <div style="font-size:20px;font-weight:700;color:{color};margin-top:4px">{label}</div>
            <p style="color:#94a3b8;font-size:13px;margin:8px 0 0">
              out of 100 &nbsp;·&nbsp; daily composite of 6 FRED indicators
            </p>
          </td>
        </tr>

        <!-- Key drivers -->
        <tr>
          <td style="padding:24px 32px 8px">
            <p style="margin:0 0 10px;font-size:11px;color:#94a3b8;font-weight:700;
                      letter-spacing:1px;text-transform:uppercase">Key Drivers</p>
            {bullets_html}
          </td>
        </tr>

        <!-- Context indicators -->
        <table width="100%" cellpadding="0" cellspacing="0">
          {cpi_html}
          {nfib_html}
        </table>

        <!-- Today's post -->
        <tr>
          <td style="background:#f8fafc;padding:20px 32px;
                     border-top:1px solid #f1f5f9;border-bottom:1px solid #f1f5f9">
            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;font-weight:700;
                      letter-spacing:1px;text-transform:uppercase">Today's Analysis</p>
            <a href="{post_url}"
               style="font-size:15px;font-weight:600;color:#1e40af;text-decoration:none">
              {post_title}
            </a>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:24px 32px;text-align:center">
            <a href="{site_url}"
               style="background:#1e40af;color:#fff;padding:11px 28px;border-radius:8px;
                      text-decoration:none;font-size:13px;font-weight:600;
                      display:inline-block">
              View Full Dashboard →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px 24px;text-align:center;border-top:1px solid #f1f5f9">
            <p style="margin:0;font-size:11px;color:#94a3b8">
              You subscribed at
              <a href="{site_url}" style="color:#94a3b8">{site_url}</a>
              &nbsp;·&nbsp;
              <a href="{unsubscribe_url}" style="color:#94a3b8">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""


def send_daily_digest(
    *,
    score: int,
    label: str,
    reasoning: list[str],
    post_title: str,
    post_url: str,
    cpi_yoy: Optional[float],
    nfib_optimism: Optional[float],
    site_url: str,
    subscribers: list[dict],
) -> None:
    """
    Send the daily score + analysis digest to all confirmed subscribers.

    subscribers: list of dicts with keys: email, unsubscribe_token
    Non-fatal — logs errors but never raises.
    """
    api_key = os.environ.get("RESEND_API_KEY", "")
    if not api_key:
        print("[digest] RESEND_API_KEY not set — skipping email digest.", file=sys.stderr)
        return

    if not subscribers:
        print("[digest] No subscribers — skipping email digest.")
        return

    # Resend free tier: 100 emails/day, 3,000/month
    batch = subscribers[:100]
    date_str = datetime.now(timezone.utc).strftime("%b %d")
    subject = f"Funding Climate: {score}/100 ({label}) — {date_str}"

    sent = 0
    failed = 0

    for sub in batch:
        email = sub["email"]
        token = sub.get("unsubscribe_token", "")
        unsub_url = f"{site_url}/api/unsubscribe?token={urllib.parse.quote(token)}"

        html = _build_html(
            score, label, reasoning,
            post_title, post_url,
            cpi_yoy, nfib_optimism,
            site_url, unsub_url,
        )

        try:
            resp = requests.post(
                _RESEND_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": _FROM,
                    "to": email,
                    "reply_to": "info@usfundingclimate.com",
                    "subject": subject,
                    "html": html,
                    "headers": {
                        # RFC 8058 one-click unsubscribe — improves deliverability
                        "List-Unsubscribe": f"<{unsub_url}>",
                        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                    },
                },
                timeout=15,
            )
            resp.raise_for_status()
            sent += 1
        except Exception as exc:
            failed += 1
            print(f"[digest] Failed for {email}: {exc}", file=sys.stderr)

    print(f"[digest] Sent {sent}/{len(batch)} — {failed} failed.")
