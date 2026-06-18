# Deploying Cyber Rebels (GitHub → Netlify → Cloudflare domain)

## 0. Before you push — API keys
Your API keys live in `.env`, which is already in `.gitignore`, so git will NOT upload it.
- DO keep `.env` locally (you need it for `netlify dev`).
- DO NOT commit it. NEVER paste keys into the code.
- You will re-enter the keys in the Netlify dashboard (step 3). That's how production gets them.

## 1. Put the project on GitHub (from VS Code)
1. Open the project folder in VS Code (File → Open Folder → the `cyberebels` folder).
2. Open the Source Control panel (the branch icon on the left, or Ctrl+Shift+G).
3. Click "Initialize Repository", then "Publish to GitHub" (sign in to GitHub if asked).
   - Choose "Publish to private repository" (recommended).
4. VS Code commits and pushes everything except what's in `.gitignore` (so no `node_modules`, no `.env`).
   - Verify on github.com that there is NO `.env` file in the repo. If you see one, stop and remove it.

## 2. Connect Netlify to the repo
1. Go to app.netlify.com → Add new site → Import an existing project → GitHub → pick the repo.
2. Build settings (netlify.toml already sets these, just confirm):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. Click Deploy. First deploy gives you a URL like `your-site.netlify.app`.

## 3. Add your API keys in Netlify
Site configuration → Environment variables → Add a variable (one per key):
- `VIRUSTOTAL_API_KEY` = your VirusTotal key
- `ABUSEIPDB_API_KEY` = your AbuseIPDB key
- `SITE_ORIGIN` = your final URL (set after the domain works, e.g. `https://cyberebels.com`)
Then Deploys → Trigger deploy → Clear cache and deploy site.
(No Shodan key needed — Shodan InternetDB is keyless.)

## 4. Point your Cloudflare domain at Netlify
1. In Netlify: Domain management → Add a domain → `cyberebels.com`. Netlify shows you target records.
2. In Cloudflare → DNS, add:
   - `CNAME` `www` → `your-site.netlify.app`
   - apex `cyberebels.com` → `your-site.netlify.app` (Cloudflare flattens CNAME at the apex), or the `A` record Netlify shows.
   - Set both to **DNS only (grey cloud)** at first.
3. Wait for Netlify to show the domain as verified and to issue HTTPS (Let's Encrypt). This can take a few minutes.
4. (Optional) Re-enable Cloudflare proxy (orange cloud). If you do, set Cloudflare → SSL/TLS → **Full (strict)**. Anything else can cause a redirect loop.
5. In Netlify, set the primary domain and enable "Force HTTPS".

## 5. Troubleshooting
- `'vite' is not recognized` locally → run `npm install` in the project first.
- Functions return 500 / "No analysis data" → confirm env vars are set in Netlify and you redeployed. Check Logs → Functions.
- VirusTotal URL says "queued" → a brand-new URL takes ~30–60s to analyze; re-run the scan.
- Cloudflare "ERR_TOO_MANY_REDIRECTS" → SSL/TLS mode must be **Full (strict)**, not Flexible.
- HTTPS cert won't issue → set the Cloudflare records to DNS-only (grey cloud) until Netlify issues the cert, then re-proxy.
- A feed shows "needs key" → that API key isn't set in Netlify env vars.
- Rate-limit messages → expected protection; results are cached and capped per day.
