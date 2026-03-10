You're in the waiting phase — nothing to do but wait. Cloudflare is checking if Namecheap has propagated the nameservers.
   Usually 10–30 minutes.

  While you wait, do these two things:

  ---
  1. Add GitHub Actions secrets

  Go to github.com/ashfaq1192/finhealth → Settings → Secrets and variables → Actions → New repository secret

  Add these 6 one by one:

  ┌────────────────┬─────────────────────────────────────────┐
  │     Secret     │                  Value                  │
  ├────────────────┼─────────────────────────────────────────┤
  │ FRED_API_KEY   │ your FRED key                           │
  ├────────────────┼─────────────────────────────────────────┤
  │ GROQ_API_KEY   │ your Groq key                           │
  ├────────────────┼─────────────────────────────────────────┤
  │ SUPABASE_URL   │ https://qjdxobbewzbmzuoxpgj.supabase.co │
  ├────────────────┼─────────────────────────────────────────┤
  │ SUPABASE_KEY   │ your Supabase service role key          │
  ├────────────────┼─────────────────────────────────────────┤
  │ RESEND_API_KEY │ your Resend key                         │
  ├────────────────┼─────────────────────────────────────────┤
  │ SITE_URL       │ https://usfundingclimate.com            │
  └────────────────┴─────────────────────────────────────────┘

  ---
  2. Run Supabase migration

  Supabase dashboard → SQL Editor → run:
  ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT NULL;

  ---
  When Cloudflare emails you "your domain is active", come back and tell me — we'll then add the custom domain to your
  Pages project and you'll be fully live on usfundingclimate.com.
Domain is active on Cloudflare. Now add it to your Pages project:

  Cloudflare Pages → your finhealth project → Custom domains → Set up a custom domain

  Type usfundingclimate.com → Continue → Cloudflare will auto-configure it since the domain is already on Cloudflare.

  Also add www.usfundingclimate.com as a second custom domain so both work.

  Tell me what you see.
