# K9 Expeditions — Astro + Tailwind + Vercel

Replicated from Squarespace. Same content, branding, and pages — now on a modern stack.

**Live preview:** https://k9-expeditions.vercel.app
**GitHub:** https://github.com/Aneshv1/k9-expeditions

---

## Remaining Setup Steps

### 1. Resend — Verify Domain DNS
- In Resend, `k9expeditions.com` has been added
- Click **Auto configure** (or Manual setup) to add SPF, DKIM, DMARC records via Cloudflare
- Wait for Resend to show domain as **Verified**

### 2. Resend — Add API Key to Vercel
- In Resend dashboard: **API Keys** > use existing key or create new one
- One key works for all verified domains on the account
- Add it to Vercel:
  ```bash
  echo "re_YOUR_KEY_HERE" | vercel env add RESEND_API_KEY production
  ```

### 3. Move DNS from Squarespace to Cloudflare
1. **Cloudflare:** Add a site > `k9expeditions.com` > Free plan > get nameservers
2. **Squarespace:** Settings > Domains > k9expeditions.com > replace nameservers with Cloudflare's
3. Wait for Cloudflare to show domain as **Active** (5–30 min)

### 4. Point DNS to Vercel (in Cloudflare)
Once Cloudflare is active, update DNS records:
- `A` record: `k9expeditions.com` → `76.76.21.21` (proxy OFF / gray cloud)
- `CNAME` record: `www` → `cname.vercel-dns.com` (proxy OFF / gray cloud)
- Delete any old Squarespace A/CNAME records that conflict

### 5. Add Domain in Vercel
```bash
vercel domains add k9expeditions.com
vercel domains add www.k9expeditions.com
```
Vercel will auto-issue SSL once DNS propagates.

### 6. Cancel Squarespace
Once `k9expeditions.com` loads from Vercel, cancel the Squarespace subscription.

---

## Env Vars (Vercel)

| Variable | Status | Value |
|----------|--------|-------|
| `SUPABASE_URL` | Set | Same as k9-academy-landing |
| `SUPABASE_SERVICE_ROLE_KEY` | Set | Same as k9-academy-landing |
| `NOTIFY_TO` | Set | `info@k9expeditions.com,contact@k9academy.ca` |
| `RESEND_API_KEY` | **TODO** | Add after domain verification |
| `NOTIFY_FROM` | Optional | Defaults to `K9 Expeditions Leads <leads@k9expeditions.com>` |

## Stack

- **Framework:** Astro 5.7
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (auto-deploy from GitHub on push to main)
- **Database:** Supabase (shared leads table with K9 Academy)
- **Email:** Resend (sends to both info@k9expeditions.com and contact@k9academy.ca)
- **DNS:** Cloudflare (pending migration from Squarespace)

## Local Dev

```bash
npm install
npm run dev
```

## Pages

- `/` — Homepage (hero, services, testimonials, about, CTA)
- `/about` — What makes K9X different, meet the trainer
- `/training` — Training & behaviour modification programs
- `/boarding` — In-home boarding
- `/rates` — All pricing
- `/testimonials` — 13 client testimonials with dog photos
- `/free-evaluation` — Full intake form
- `/contact` — Quick contact form
- `/k9s-in-action` — Instagram gallery link
- `/privacy-policy` — Privacy policy
