● Yes, Namecheap is the right choice for a beginner. Here's the complete guide:                                 
                                         
  ---                                                                                                           
  Why Namecheap over others:                                                                                    
  - Cheapest .com renewal (~$10-11/year vs GoDaddy's $20+)                                                      
  - No dark patterns or upsell traps during checkout                                                            
  - Free WhoisGuard (hides your personal info from public WHOIS — GoDaddy charges for this)
  - Clean, simple dashboard

  ---
  Step by step:

  1. Go to namecheap.com
  2. Search your domain name in the search bar
  3. If available → Add to cart
  4. At checkout — uncheck everything extra:
    - Uncheck PremiumDNS (you don't need it — Cloudflare DNS is free and better)
    - Uncheck hosting offers
    - WhoisGuard — keep this ON (it's free)
  5. Pay (~$10-11 for first year)

  ---
  After buying — connect to Cloudflare Pages:

  1. Go to your Cloudflare Pages project → Custom Domains → Add domain
  2. Cloudflare will give you two nameserver addresses (like ada.ns.cloudflare.com)
  3. Go to Namecheap → Dashboard → your domain → Nameservers → switch to Custom DNS → paste Cloudflare's
  nameservers
  4. Wait 10-30 minutes → domain is live

  That's it. Cloudflare handles SSL certificate automatically — no setup needed.

  ---
  One tip: Buy only 1 year for now. If the site gains traction, Google gives a slight trust boost to domains
  registered for multiple years — but only renew when you know the site is worth keeping.
