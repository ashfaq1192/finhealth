import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "US Business Funding Climate Score — Daily Small Business Lending Index";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(140deg, #0f172a 0%, #0c2340 50%, #0f172a 100%)",
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.06) 0%, transparent 50%)",
          }}
        />

        {/* LIVE badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "100px",
            padding: "7px 20px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
            }}
          />
          <span
            style={{
              color: "#86efac",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}
          >
            Updated Daily · 9 AM EST
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            color: "#f8fafc",
            fontSize: "72px",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.05,
            marginBottom: "22px",
            letterSpacing: "-2px",
          }}
        >
          US Business Funding
          <br />
          <span style={{ color: "#60a5fa" }}>Climate Score</span>
        </div>

        {/* Value proposition */}
        <div
          style={{
            color: "#94a3b8",
            fontSize: "24px",
            textAlign: "center",
            fontWeight: 400,
            lineHeight: 1.5,
            marginBottom: "44px",
            maxWidth: "820px",
          }}
        >
          A free daily 0–100 score measuring whether US conditions
          <br />
          favor small business loans right now
        </div>

        {/* Indicator pills */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "0px",
            maxWidth: "1000px",
          }}
        >
          {[
            { label: "Prime Rate", color: "#fca5a5" },
            { label: "Yield Curve", color: "#c4b5fd" },
            { label: "C&I Lending Standards", color: "#fdba74" },
            { label: "Jobless Claims", color: "#fcd34d" },
            { label: "NFIB Optimism", color: "#6ee7b7" },
            { label: "New Business Apps", color: "#86efac" },
          ].map(({ label, color }) => (
            <div
              key={label}
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "9px 16px",
                color,
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom: domain left, FRED right */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            left: "80px",
            color: "#334155",
            fontSize: "17px",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          usfundingclimate.com
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            right: "80px",
            color: "#334155",
            fontSize: "14px",
          }}
        >
          Powered by Federal Reserve Economic Data (FRED)
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
