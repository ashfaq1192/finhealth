 Good. Now the step-by-step guide for GitHub Secrets and SITE_URL:

  ---                                                                                                                            
  Action #3 — Adding GitHub Secrets
                                                                                                                                 
  GitHub Secrets are how the GitHub Actions pipeline gets environment variables. Without them, crew.py can't call Resend or know
  your site URL.

  Steps:

  1. Open your repo on GitHub
  2. Click Settings (top tab, not profile settings)
  3. Left sidebar → Secrets and variables → Actions
  4. Click New repository secret for each:

  ┌────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
  │  Secret name   │                                        Value                                        │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ RESEND_API_KEY │ your new key from Resend (after rotating the old one)                               │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ SITE_URL       │ leave blank for now — add this when you have your domain, e.g. https://yoursite.com │
  └────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

  For SITE_URL right now: you can set it to a placeholder like https://yourdomain.com — it only affects the links inside the
  digest email, which you're not sending to real subscribers yet anyway.

  ---
  Action #4 — The _FROM change

  Already done above — it now uses onboarding@resend.dev. When you get your domain:

  1. In Resend dashboard → Domains → Add Domain — follow their DNS verification steps (takes ~5 minutes)
  2. Then open backend/digest.py, find _FROM, and change it to "Funding Score <digest@yourdomain.com>"
  3. Commit and push — done

  ---
  What works right now vs. after domain

  ┌────────────────────────────┬────────────────────────────────────┬───────────────────────────┐
  │          Feature           │       Works now (no domain)        │    Works after domain     │
  ├────────────────────────────┼────────────────────────────────────┼───────────────────────────┤
  │ Email capture form on site │ ✅ Stores to Supabase              │ ✅ Same                   │
  ├────────────────────────────┼────────────────────────────────────┼───────────────────────────┤
  │ Daily digest sending       │ ✅ Sends via onboarding@resend.dev │ ✅ Sends from your domain │
  ├────────────────────────────┼────────────────────────────────────┼───────────────────────────┤
  │ Inbox placement            │ ⚠️  May go to spam                  │ ✅ Proper deliverability  │
  ├────────────────────────────┼────────────────────────────────────┼───────────────────────────┤
  │ Unsubscribe links          │ ✅ Work                            │ ✅ Work                   │
  └────────────────────────────┴────────────────────────────────────┴───────────────────────────┘

  Bottom line: Don't wait for the domain. Get your RESEND_API_KEY secret into GitHub, push your code, and the pipeline will start
   sending the moment real subscribers sign up. The domain upgrade is a one-liner later.

  ---
  Checklist for you right now:
  - Rotate the exposed Resend API key
  - Add RESEND_API_KEY (new key) to GitHub Secrets
  - Add SITE_URL to GitHub Secrets (placeholder value is fine for now)
  - Deploy the code (push to trigger Cloudflare Pages build)