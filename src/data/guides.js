// Real, practical guides. Body is a list of typed blocks rendered by <Article/>.
// Inline markup supported in text: **bold** and `code`.

export const GUIDES = [
  {
    slug: "domain-intel-explained",
    title: "Reading Domain Intel: Age, Registrar & DNS",
    description: "What a domain's registration age, registrar, nameservers and DNS records tell you — and the combinations that scream malicious.",
    difficulty: "Beginner",
    minutes: 7,
    tags: ["domains", "phishing", "dns", "whois"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Before you trust a domain, look at its paperwork. The **Domain Intel** tool pulls registration data (via RDAP, the modern WHOIS) and live DNS records, then scores them. Here is how to read it." },
      { type: "h2", text: "Domain age — the single biggest tell" },
      { type: "p", text: "Most phishing and scam domains are days or weeks old. Legitimate businesses usually own their domains for years. A registration date of **last week** on a site asking for your password is a giant red flag." },
      { type: "callout", tone: "warn", text: "Under 90 days old + asking for credentials or payment = treat as hostile until proven otherwise." },
      { type: "h2", text: "Registrar & status" },
      { type: "p", text: "The **registrar** is who the domain was bought through. Not damning on its own, but bulk-registered scam domains cluster at a few cheap registrars. A registry **status** like `clientHold`, `pendingDelete` or `inactive` means the domain is suspended or dying — normal sites don't show those." },
      { type: "h2", text: "DNS records — is it a real operation?" },
      { type: "ul", items: [
        "**A / AAAA** — the IP(s) it resolves to. No A record means it isn't actually serving a site.",
        "**MX** — mail servers. A real company that emails you almost always has MX records; a throwaway phishing domain often doesn't.",
        "**NS** — nameservers. Generic free DNS on a 'bank' domain is suspicious.",
        "**TXT** — includes the **SPF** record (`v=spf1 ...`). Legit senders publish SPF; its absence on an emailing domain is a warning.",
      ]},
      { type: "h2", text: "Putting it together (the score)" },
      { type: "p", text: "No single field decides it — the score weighs them together. An old domain with MX, SPF and clean status scores high (likely legitimate). A two-week-old domain with no mail records and a generic registrar scores low. Always combine this with the VirusTotal verdict and the IP's reputation in the console." },
      { type: "callout", tone: "info", text: "Age and DNS can be faked-good too: a patient attacker buys aged domains. Treat the score as one strong signal, not a verdict." },
    ],
  },
  {
    slug: "url-redirects-explained",
    title: "Where Does That Link Really Go?",
    description: "Short links and tracking URLs hide their destination. Here's how redirect chains work and which ones should make you nervous.",
    difficulty: "Beginner",
    minutes: 5,
    tags: ["phishing", "urls", "links"],
    updated: "June 2026",
    body: [
      { type: "p", text: "A link's visible text and its real destination are two different things. The **URL Redirect Analyzer** follows a link through every hop so you can see where it actually lands — before your browser goes there." },
      { type: "h2", text: "Why links redirect" },
      { type: "p", text: "Plenty of redirects are normal: URL shorteners (bit.ly), email click-trackers, marketing analytics, and sites forcing HTTP → HTTPS. A redirect by itself isn't bad." },
      { type: "h2", text: "What makes a chain suspicious" },
      { type: "ul", items: [
        "**Lots of hops** bouncing across unrelated domains — a common cloaking trick to dodge scanners.",
        "**Final domain doesn't match the brand** the link claimed to be (a 'PayPal' link ending on `paypal-secure-login.xyz`).",
        "**A shortener hiding a freshly-registered domain** — run the final domain through Domain Intel.",
        "**Mismatched protocols or odd ports**, or a chain that ends on a raw IP address.",
      ]},
      { type: "callout", tone: "warn", text: "If the final destination isn't the official domain you expected, don't enter anything. Type the real address yourself instead of following the link." },
      { type: "p", text: "When you find the final domain, pivot: check it in **Domain Intel** for age, and run it through the **Investigate Console** for reputation." },
    ],
  },
  {
    slug: "ssl-certificates-explained",
    title: "What an SSL Certificate Tells You (and What It Doesn't)",
    description: "The padlock means encryption, not honesty. Here's how to read a TLS certificate's issuer, validity and hostnames — and what it can't prove.",
    difficulty: "Beginner",
    minutes: 6,
    tags: ["tls", "ssl", "https", "phishing"],
    updated: "June 2026",
    body: [
      { type: "p", text: "The **SSL Inspector** pulls a site's live TLS certificate. A certificate proves traffic is encrypted and that the site controls that domain — it does **not** prove the people behind it are trustworthy." },
      { type: "h2", text: "What the fields mean" },
      { type: "ul", items: [
        "**Subject** — the domain the cert is for. It should match the site you're on.",
        "**Issuer** — the Certificate Authority that signed it (Let's Encrypt, DigiCert, Google Trust, etc.).",
        "**Valid from / to** — the lifetime. **Days left** under zero means it's expired; browsers will warn.",
        "**SAN** — every hostname the cert covers. A cert covering dozens of unrelated domains can indicate shared or bulk infrastructure.",
      ]},
      { type: "h2", text: "Red flags" },
      { type: "ul", items: [
        "**Expired** or **not yet valid** — neglected or sketchy.",
        "**Subject doesn't match** the domain you're visiting — possible interception or a copied site.",
        "**Self-signed** (issuer = subject) on a public site — no third party vouches for it.",
      ]},
      { type: "callout", tone: "warn", text: "The padlock is not a trust badge. Phishing sites get free certs in minutes — almost all of them have valid HTTPS now. Encryption ≠ legitimacy." },
      { type: "callout", tone: "info", text: "Use the cert as one input: a valid cert on a brand-new domain (check Domain Intel) that's flagged by VirusTotal is still dangerous." },
    ],
  },
  {
    slug: "reading-email-headers",
    title: "Reading Email Headers: SPF, DKIM & DMARC",
    description: "What the authentication results buried in an email header actually mean \u2014 and how to tell a real message from a spoofed one at a glance.",
    difficulty: "Beginner",
    minutes: 7,
    tags: ["email", "phishing", "spf", "dkim", "dmarc"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Every email carries a hidden flight log in its headers. Three checks in there \u2014 SPF, DKIM and DMARC \u2014 tell you whether the message really came from who it claims. Paste a header into the **Email Header Analyzer** and here is how to read what comes back." },
      { type: "h2", text: "SPF \u2014 was this server allowed to send?" },
      { type: "p", text: "SPF checks whether the server that sent the mail is on the list the domain owner published. Think of it as a guest list for sending servers." },
      { type: "callout", tone: "good", text: "Looks right: `spf=pass` \u2014 the sending server is authorized by the domain in the From address." },
      { type: "callout", tone: "warn", text: "Looks wrong: `spf=fail` or `softfail` \u2014 the server is not on the list. Combined with a brand-name sender, that is a classic spoof." },
      { type: "h2", text: "DKIM \u2014 was the message tampered with?" },
      { type: "p", text: "DKIM adds a cryptographic signature. If the body or key headers were altered after signing, the signature breaks." },
      { type: "callout", tone: "good", text: "Looks right: `dkim=pass header.d=sender.com` \u2014 signed by the real domain and unaltered in transit." },
      { type: "callout", tone: "warn", text: "Looks wrong: `dkim=fail`, or `dkim=pass` but `header.d=` is a random domain that is not the sender \u2014 a common trick." },
      { type: "h2", text: "DMARC \u2014 does it all line up?" },
      { type: "p", text: "DMARC ties SPF and DKIM to the visible From address and tells receivers what to do on failure. It is the strongest single signal." },
      { type: "callout", tone: "good", text: "Looks right: `dmarc=pass` \u2014 the authenticated domain matches the From you see. Strong confidence it is genuine." },
      { type: "callout", tone: "warn", text: "Looks wrong: `dmarc=fail` \u2014 the message failed the domain owner own policy. Treat it as hostile." },
      { type: "h2", text: "A 10-second gut-check" },
      { type: "ul", items: [
        "All three say **pass** and the From domain matches \u2014 almost certainly legit.",
        "Any one says **fail** on a message that claims to be from a bank, employer or big brand \u2014 assume spoofed.",
        "The **From** domain and the **Return-Path** domain do not match \u2014 a strong forgery tell.",
        "The **originating IP** is in a country or hosting network that makes no sense for the sender \u2014 investigate it in the console.",
      ]},
      { type: "callout", tone: "info", text: "Authentication passing only proves the message really came from that domain \u2014 not that the domain is trustworthy. A scammer with their own domain can pass all three. Always weigh it with the content and the originating IP." },
    ],
  },
  {
    slug: "access-tor-safely",
    title: "How to Access Tor Safely",
    description:
      "Tor can make you genuinely hard to trace — but only if you use it right. Here's how to get on the network without undoing your own anonymity.",
    difficulty: "Beginner",
    minutes: 8,
    tags: ["tor", "anonymity", "browsing"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Tor routes your traffic through three volunteer-run relays, each peeling off one layer of encryption, so no single hop knows both who you are and where you're going. Used correctly it's the strongest anonymity a normal person can get. Used carelessly, you can hand your identity right back. This guide keeps you on the safe side." },

      { type: "h2", text: "1. Download only from the real source" },
      { type: "p", text: "Get Tor Browser **only** from `torproject.org`. Fake Tor builds bundled with malware are common on third-party download sites and app stores. Type the address yourself; don't trust a search ad." },
      { type: "callout", tone: "warn", text: "If torproject.org is blocked where you are, use their email responder — send a message to gettor@torproject.org and it replies with a verified download link via a mirror." },

      { type: "h2", text: "2. Verify the download (optional but smart)" },
      { type: "p", text: "The Tor Project signs every release. On their download page they explain how to verify the signature, which proves the file wasn't tampered with in transit. If you're relying on Tor for real protection, take the extra two minutes to do this." },

      { type: "h2", text: "3. Set your security level" },
      { type: "p", text: "Click the shield icon and choose your level. **Safer** disables risky JavaScript on non-HTTPS sites; **Safest** disables JavaScript everywhere. Higher levels break more sites but shrink your attack surface. For sensitive work, Safest is the right default." },

      { type: "h2", text: "4. Use it the way it's meant to be used" },
      { type: "steps", items: [
        { title: "Don't log in to your real accounts", text: "Signing into Gmail or Facebook over Tor links your anonymous session straight back to you. Keep anonymous browsing and personal accounts completely separate." },
        { title: "Don't resize or maximize the window", text: "Tor Browser ships at a fixed size on purpose — window dimensions are a fingerprinting signal. Leave it alone." },
        { title: "Don't install add-ons", text: "Every extension makes you more unique and can leak data. Tor Browser is pre-tuned; adding to it weakens it." },
        { title: "Don't open downloaded files while online", text: "Documents and PDFs can fetch resources outside Tor and reveal your real IP. Open them offline." },
        { title: "Don't torrent over Tor", text: "Torrent clients leak your real IP regardless of Tor, and it hammers the volunteer network. Just don't." },
      ]},

      { type: "h2", text: "5. If Tor itself is blocked: use a bridge" },
      { type: "p", text: "Some networks and countries block known Tor relays. Bridges are unlisted entry points that get you onto the network anyway. In Tor Browser's settings, choose **Use a bridge**, and pick a built-in option like `obfs4` or `snowflake`, which disguise your traffic so it doesn't look like Tor." },

      { type: "h2", text: "Want maximum protection?" },
      { type: "p", text: "For high-stakes situations, consider **Tails** — a privacy operating system you boot from a USB stick that routes everything through Tor and forgets everything when you shut down. It leaves no trace on the computer you used." },

      { type: "callout", tone: "info", text: "Tor hides where your traffic comes from. It does not magically make a site trustworthy, and exit nodes can see unencrypted traffic — so still stick to HTTPS and don't enter secrets on sketchy sites." },
    ],
  },

  {
    slug: "strong-passwords",
    title: "Build a Password You Can't Crack",
    description:
      "Most password advice is wrong. Length beats symbols, reuse is the real killer, and a manager does the hard part for you. Here's the system that actually works.",
    difficulty: "Beginner",
    minutes: 7,
    tags: ["passwords", "accounts", "2fa"],
    updated: "June 2026",
    body: [
      { type: "p", text: "The single biggest reason people get hacked isn't a weak password — it's the **same** password used in many places. One breach, and attackers try those credentials everywhere (it's called credential stuffing). Fix that and you've already beaten most attacks." },

      { type: "h2", text: "Length beats complexity" },
      { type: "p", text: "`P@ssw0rd!` looks strong and is terrible. A long passphrase like `correct-battery-staple-anchor` is far harder to crack and easier to remember. Each extra word multiplies the guessing effort. Aim for four or more random words, or 16+ characters." },
      { type: "callout", tone: "good", text: "A truly random four-word passphrase has more real-world strength than a short password full of symbols — and you can actually remember it." },

      { type: "h2", text: "Use a password manager (this is the real fix)" },
      { type: "p", text: "You can't memorize a unique strong password for 100 accounts — so don't try. A password manager generates and stores them, and fills them in for you. You remember exactly one strong master passphrase." },
      { type: "ul", items: [
        "**Bitwarden** — free, open source, works everywhere. The easiest place to start.",
        "**1Password** — polished, great for families; paid.",
        "**KeePassXC** — fully offline, you control the file. Best if you don't want anything in the cloud.",
      ]},

      { type: "h2", text: "Turn on two-factor authentication" },
      { type: "p", text: "Even a perfect password can leak. 2FA adds a second step so a stolen password alone isn't enough. Not all 2FA is equal:" },
      { type: "steps", items: [
        { title: "Best: passkeys or a hardware key", text: "Passkeys (built into phones and browsers) and hardware keys like YubiKey resist phishing entirely — there's no code to trick out of you." },
        { title: "Good: an authenticator app", text: "Apps like Aegis, Ente Auth, or 2FAS generate rotating codes offline. Solid and free." },
        { title: "Last resort: SMS codes", text: "Better than nothing, but vulnerable to SIM-swap attacks. Use it only where nothing else is offered." },
      ]},

      { type: "h2", text: "Check if you're already exposed" },
      { type: "p", text: "Run your passwords and email through a breach check. Our **OSINT Self-Check** does the password test privately (it never sends your actual password). Anything found in a breach should be changed immediately — everywhere you used it." },

      { type: "callout", tone: "warn", text: "Never reuse your email password anywhere. Your email is the master key — whoever controls it can reset every other account you own." },
    ],
  },

  {
    slug: "harden-your-browser",
    title: "Harden Your Browser Against Tracking",
    description:
      "Your browser leaks more than your IP. A few deliberate choices stop most trackers and shrink the fingerprint that follows you around the web.",
    difficulty: "Intermediate",
    minutes: 9,
    tags: ["browser", "fingerprinting", "trackers"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Trackers don't need to hack you. They watch you across sites using cookies, scripts, and a device **fingerprint** assembled from your browser's quirks. Here's how to turn most of that off." },

      { type: "h2", text: "Start with a browser that fights back" },
      { type: "ul", items: [
        "**Brave** — blocks trackers and ads by default and randomizes your fingerprint per site. Easiest big upgrade.",
        "**Firefox** with the **arkenfox** user.js — the power-user choice; highly configurable and very private once tuned.",
        "**Mullvad Browser** — built with the Tor Project to make everyone look identical. Pair with a VPN.",
      ]},

      { type: "h2", text: "Lock down the settings" },
      { type: "steps", items: [
        { title: "Block third-party cookies", text: "This kills the classic cross-site tracking cookie. In most browsers it's a one-click toggle under privacy settings." },
        { title: "Turn on HTTPS-only mode", text: "Forces encrypted connections so networks can't read or tamper with your traffic." },
        { title: "Disable link/URL tracking where offered", text: "Brave and Firefox can strip the `?utm=` style tracking parameters that follow you between sites." },
        { title: "Set a private search engine", text: "Switch your default to DuckDuckGo, Brave Search, or Startpage so your queries aren't logged to a profile." },
      ]},

      { type: "h2", text: "Add one extension — uBlock Origin" },
      { type: "p", text: "uBlock Origin is the gold-standard content blocker: lightweight, open source, and far more effective than most 'privacy' extensions. Resist the urge to stack ten add-ons — each one makes your fingerprint more unique. One good blocker is enough." },

      { type: "h2", text: "Plug the WebRTC leak" },
      { type: "p", text: "WebRTC can reveal your local IP even behind a VPN. Brave and the Mullvad/Tor browsers handle this for you; in Firefox you can set `media.peerconnection.enabled` to false if you don't use video calls in the browser." },

      { type: "h2", text: "Test your work" },
      { type: "p", text: "Run our **Fingerprint** and **Am I Tracked?** tools before and after. You'll see your fingerprint get less unique and your privacy score climb — proof the changes are doing something." },

      { type: "callout", tone: "info", text: "There's a trade-off: the harder you lock down, the more sites break or nag you. Find the level you'll actually keep using — a setup you abandon protects no one." },
    ],
  },

  {
    slug: "lock-down-your-phone",
    title: "Lock Down Your Phone in an Afternoon",
    description:
      "Your phone is the most revealing device you own. These settings cut off the biggest leaks on iOS and Android in under an hour.",
    difficulty: "Beginner",
    minutes: 8,
    tags: ["mobile", "ios", "android"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Your phone knows where you sleep, who you talk to, and what you do all day — and a surprising amount of that quietly leaves the device. You don't need to throw it in a river. An afternoon of settings handles the worst of it." },

      { type: "h2", text: "Kill the advertising ID" },
      { type: "p", text: "Both platforms give apps a unique ad ID to track you across them." },
      { type: "ul", items: [
        "**iPhone:** Settings → Privacy & Security → Tracking → turn off **Allow Apps to Request to Track**.",
        "**Android:** Settings → Privacy → Ads → **Delete advertising ID**.",
      ]},

      { type: "h2", text: "Rein in location" },
      { type: "p", text: "Most apps don't need your location, and almost none need it **always**. Go through your app permissions and set location to **While Using** or **Ask** — and **Never** for anything that has no business knowing where you are. Turn off precise location for apps that only need a rough area." },

      { type: "h2", text: "Audit app permissions" },
      { type: "steps", items: [
        { title: "Review camera and microphone", text: "Revoke these from any app that doesn't obviously need them. Your check-in app does not need your mic." },
        { title: "Check contacts and photos", text: "Apps love to vacuum up your whole contact list. Deny it unless there's a clear reason." },
        { title: "Remove apps you don't use", text: "The fastest privacy win: every app you delete is one that can't track you." },
      ]},

      { type: "h2", text: "Encrypt your messages" },
      { type: "p", text: "Use **Signal** for messaging — it's end-to-end encrypted by default, minimal metadata, and free. For calls and texts that must stay private, it's the standard." },

      { type: "h2", text: "Lock the front door" },
      { type: "ul", items: [
        "Set a **6-digit (or longer) PIN**, not a 4-digit one or a simple swipe pattern.",
        "Turn on **automatic OS updates** — most phone hacks exploit bugs that are already patched.",
        "Enable **Find My / Find My Device** so a lost phone can be located and wiped remotely.",
      ]},

      { type: "callout", tone: "good", text: "Do just the ad-ID and location steps and you've already stopped the majority of everyday tracking. The rest is polish." },
    ],
  },

  {
    slug: "how-people-get-your-ip",
    title: "How People Get Your IP Address (and How to Stop Them)",
    description:
      "Your IP can leak in more ways than you'd think — from a link you click to a game you play. Here's how it happens and how to shut each path down.",
    difficulty: "Beginner",
    minutes: 7,
    tags: ["ip", "tracking", "defense"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Your IP address is like a return address on every packet your device sends. It doesn't reveal your name, but it does expose your rough location and your internet provider — and it's enough to be logged, rate-limited, or harassed. This is a defensive guide: here's how your IP gets exposed, and how to stop it." },

      { type: "h2", text: "The common ways it leaks" },
      { type: "steps", items: [
        { title: "Clicking a link", text: "Any link you open sees your IP — that's just how the web works. So-called grabber or logger links exploit this: a harmless-looking shortened URL silently records your IP when you click. Be wary of unexpected links, especially shortened ones from strangers." },
        { title: "Peer-to-peer and torrents", text: "P2P connects you directly to other peers, so everyone in the swarm can see your IP. This is the single most common way IPs get harvested at scale." },
        { title: "Online games and voice chat", text: "Some games and older voice apps use direct (peer-to-peer) connections, exposing your IP to other players. Booter/stresser services abuse this to knock people offline." },
        { title: "Email", text: "Tracking pixels in an email can log your IP and tell the sender you opened it. Some mail servers also stamp your IP into message headers." },
        { title: "Running your own server or website", text: "If you self-host anything from your home connection, its public IP is your home IP unless you put something in front of it." },
      ]},

      { type: "h2", text: "How to protect yourself" },
      { type: "ul", items: [
        "**Use a VPN** for the big one. It replaces your real IP with the VPN server's, so P2P peers, games, and sites see that instead of you.",
        "**Don't click unknown links**, especially shortened ones from people you don't trust. When unsure, paste the link into our OSINT scanner first.",
        "**Disable WebRTC** in your browser (or use Brave/Tor) — it can leak your real IP even behind a VPN.",
        "**Block remote images** in your email client to defeat tracking-pixel IP logging.",
        "**Put a proxy or CDN in front of anything you self-host** so visitors never hit your home IP directly.",
      ]},

      { type: "callout", tone: "info", text: "Knowing someone's IP isn't a superpower — it can't unlock your accounts. But it can reveal your city and ISP and enable harassment, so it's worth not leaking. A VPN handles 90% of this." },
    ],
  },

  {
    slug: "access-dark-web-safely",
    title: "How to Access the Dark Web Safely",
    description:
      "The dark web has real, legitimate uses — and real risks. If you're going to explore it, do it the safe, legal way. Here's the responsible playbook.",
    difficulty: "Intermediate",
    minutes: 9,
    tags: ["tor", "dark web", "anonymity"],
    updated: "June 2026",
    body: [
      { type: "p", text: "The dark web is the part of the internet you reach through Tor using `.onion` addresses. It's mostly misunderstood: alongside the headlines, it hosts genuinely important things — secure leak-submission sites for journalists (SecureDrop), `.onion` mirrors of the BBC, ProPublica, and DuckDuckGo, and a lifeline for people under censorship. This guide is about exploring it **safely and legally**, not about anything illegal — which we won't help with." },

      { type: "callout", tone: "warn", text: "Reality check: a lot of the dark web is scams and illegal markets. Buying or accessing illegal goods or content is a crime and is not what this guide is for. Curiosity is fine; breaking the law is not." },

      { type: "h2", text: "1. Use the right tool" },
      { type: "p", text: "For most people, **Tor Browser** (from `torproject.org`) is enough — see our guide on accessing Tor safely first. For higher stakes, boot **Tails**, a privacy OS on a USB stick that routes everything through Tor and leaves no trace on the computer." },

      { type: "h2", text: "2. Lock the browser down before you browse" },
      { type: "ul", items: [
        "Set Tor Browser's security level to **Safest** (the shield icon) to disable risky scripts.",
        "Never **maximize** the window and never install add-ons — both make you trackable.",
        "Keep Tor Browser **updated** every time it prompts you.",
      ]},

      { type: "h2", text: "3. The OPSEC rules that keep you safe" },
      { type: "steps", items: [
        { title: "Stay anonymous — really", text: "Never log into personal accounts (email, social) or use your real name over Tor. That instantly de-anonymizes you." },
        { title: "Don't download files", text: "Documents and programs can carry malware or phone home with your real IP. If you must, open them offline on a disposable system." },
        { title: "Verify .onion addresses", text: "Onion addresses are long and random, and phishing clones are everywhere. Get links from trusted directories and double-check every character." },
        { title: "Assume scams by default", text: "If something asks for crypto up front or sounds too good to be true, it's a scam. Don't engage." },
        { title: "Use a VPN-to-Tor only if you understand it", text: "A VPN before Tor hides Tor use from your ISP, but it's optional and adds trust in the VPN. Tor alone is fine for most." },
      ]},

      { type: "h2", text: "Good, legal places to start" },
      { type: "p", text: "Try the `.onion` versions of sites you already trust — DuckDuckGo, the BBC, ProPublica — and SecureDrop instances if you're a source for a newsroom. They show what the dark web is genuinely useful for, with none of the risk." },

      { type: "callout", tone: "info", text: "Tor hides where you're connecting from; it doesn't make sketchy sites safe or legal. Browse like a tourist, not a customer." },
    ],
  },

  {
    slug: "spot-phishing",
    title: "Spot a Phishing Attack Before You Click",
    description:
      "Phishing is still the number-one way people get hacked. Train your eye for the handful of tells and you'll dodge nearly all of it.",
    difficulty: "Beginner",
    minutes: 6,
    tags: ["phishing", "email", "scams"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Phishing tricks you into handing over a password or clicking a malicious link by pretending to be someone you trust — your bank, your boss, a delivery company. The messages keep getting slicker, but they almost always share a few tells." },

      { type: "h2", text: "The red flags" },
      { type: "ul", items: [
        "**Urgency or fear** — Your account will be closed! Act now! Pressure is the oldest trick to stop you thinking.",
        "**A sender that's almost right** — `support@paypa1.com` or a display name that doesn't match the actual address.",
        "**Links that don't match** — hover (or long-press) a link and check where it really goes before tapping.",
        "**Unexpected attachments** — especially `.zip`, `.html`, or anything asking you to enable macros.",
        "**Requests for credentials or codes** — real companies never ask for your password or 2FA code.",
      ]},

      { type: "h2", text: "What to do instead" },
      { type: "steps", items: [
        { title: "Don't click — go direct", text: "If your bank emails you, open a new tab and type the address yourself (or use your saved bookmark). Never use the link in the message." },
        { title: "Verify out of band", text: "If your boss texts an odd request, call them. A 10-second check beats a wire transfer to a scammer." },
        { title: "Check suspicious links safely", text: "Paste the URL into our OSINT scanner to see if 90+ engines flag it — without visiting it." },
        { title: "Report it", text: "Use your mail client's report-phishing button, then delete." },
      ]},

      { type: "callout", tone: "good", text: "Your backstop: turn on 2FA everywhere, and prefer passkeys or a hardware key. Even if a phish steals your password, phishing-resistant 2FA stops the login cold." },
    ],
  },

  {
    slug: "threat-modeling",
    title: "Threat Modeling: Decide What You're Actually Protecting",
    description:
      "You can't defend against everything, and trying will burn you out. Threat modeling tells you where to spend your effort — in four questions.",
    difficulty: "Beginner",
    minutes: 6,
    tags: ["strategy", "basics"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Privacy advice is endless, and doing all of it is exhausting and pointless. The pros don't — they **threat model**: they figure out what actually matters for their situation and ignore the rest. You can do the same in four questions." },

      { type: "h2", text: "The four questions" },
      { type: "steps", items: [
        { title: "What do you want to protect?", text: "Your accounts? Your location? Your identity from a specific person? Be concrete. These are your assets." },
        { title: "Who do you want to protect it from?", text: "Advertisers, scammers, an abusive ex, your employer, a government? Each adversary has different capabilities." },
        { title: "How likely is it you'll need to?", text: "Be honest about your real risk. A targeted attacker is a very different problem from generic ad tracking." },
        { title: "How bad are the consequences if you fail?", text: "Annoying spam is one thing; physical danger is another. Match your effort to the stakes." },
      ]},

      { type: "h2", text: "Right-size your effort" },
      { type: "p", text: "Worried about **ad tracking**? A private browser and a content blocker are plenty. Escaping an **abusive person**? That calls for serious compartmentalization, new accounts, and possibly professional help. A **journalist protecting a source** needs Tails and Tor. Same internet, completely different playbooks." },

      { type: "callout", tone: "info", text: "Re-run this whenever your life changes — a breakup, a new job, going public about something. Your threat model isn't fixed; it follows your circumstances." },
    ],
  },

  {
    slug: "harden-home-network",
    title: "Lock Down Your Home Wi-Fi and Router",
    description:
      "Your router is the front door to every device you own — and most people never change a thing on it. Ten minutes here protects your whole house.",
    difficulty: "Intermediate",
    minutes: 7,
    tags: ["network", "router", "wifi"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Every device in your home talks to the internet through one box: your router. If it's running factory defaults, it's the weakest link in your setup. Here's how to harden it." },

      { type: "h2", text: "The essentials" },
      { type: "steps", items: [
        { title: "Change the admin password", text: "Log into your router (often `192.168.1.1`) and change the default admin login immediately. Default credentials are public knowledge." },
        { title: "Use WPA3 or WPA2 with a strong passphrase", text: "Pick WPA3 if offered, WPA2 otherwise. Never use WEP or an open network. Set a long Wi-Fi passphrase." },
        { title: "Update the firmware", text: "Check for a firmware update and enable auto-updates if available. Router bugs are a favorite target." },
        { title: "Turn off WPS and UPnP if you don't need them", text: "WPS has known weaknesses; UPnP can let apps poke holes in your firewall. Disable unless something genuinely requires them." },
        { title: "Disable remote administration", text: "Unless you specifically need to manage the router from outside your home, turn this off so it isn't exposed to the internet." },
      ]},

      { type: "h2", text: "Going further" },
      { type: "ul", items: [
        "**Put IoT gadgets on a guest network** — smart bulbs and cameras are often insecure; isolate them from your laptops and phones.",
        "**Change your DNS** to a privacy-respecting resolver (Quad9 or Cloudflare's 1.1.1.1) so your ISP isn't logging every domain you visit.",
        "**Rename your network** to something that doesn't identify you or your router model.",
      ]},

      { type: "callout", tone: "good", text: "Do the admin password and firmware update even if you do nothing else — those two close the doors attackers actually walk through." },
    ],
  },

  {
    slug: "protect-from-doxxing",
    title: "Protect Yourself From Doxxing",
    description:
      "Doxxing is when someone digs up and publishes your private info to intimidate you. You can make yourself a much harder target before it ever happens.",
    difficulty: "Intermediate",
    minutes: 8,
    tags: ["doxxing", "footprint", "safety"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Doxxing means collecting your personal details — home address, phone, workplace, family — from scattered public sources and publishing them to harass or threaten you. The defense is to shrink and disconnect that trail before anyone goes looking." },

      { type: "h2", text: "Audit what's already out there" },
      { type: "p", text: "Start by doxxing yourself. Use our OSINT footprint tool to run your usernames through search, and look yourself up the way an attacker would. You can't fix what you can't see." },

      { type: "h2", text: "Cut the supply lines" },
      { type: "steps", items: [
        { title: "Remove yourself from data brokers", text: "People-search sites are where most doxxers get your address. Opt out of the big ones (our OSINT page links them) and consider a removal service." },
        { title: "Lock down social media", text: "Make accounts private, strip your location and workplace from bios, and remove old posts that reveal where you live or spend time." },
        { title: "Separate your identities", text: "Don't reuse the same username everywhere — it lets someone connect your gaming handle to your LinkedIn. Use distinct handles for distinct contexts." },
        { title: "Watch your metadata", text: "Photos can carry GPS coordinates in their EXIF data. Strip it before posting, and don't share pictures that show your street, plates, or mail." },
        { title: "Use aliases for signups", text: "A separate email and a Google Voice number for accounts keeps your real details from spreading." },
      ]},

      { type: "h2", text: "If it happens" },
      { type: "p", text: "Document everything with screenshots, report the content to the platform, and contact the sites hosting your info to demand removal. If there are threats, involve law enforcement — doxxing combined with threats is often a crime. Lean on friends; you don't have to handle it alone." },

      { type: "callout", tone: "info", text: "You can't erase yourself from the internet entirely, but doxxers go for easy targets. Every link you break makes you more trouble than you're worth to them." },
    ],
  },

  {
    slug: "compartmentalize-your-life",
    title: "Compartmentalize Your Digital Life (Advanced)",
    description:
      "The expert move in privacy isn't one magic tool — it's separation. Keep your identities in sealed boxes so a leak in one never sinks the rest.",
    difficulty: "Expert",
    minutes: 9,
    tags: ["advanced", "opsec", "identity"],
    updated: "June 2026",
    body: [
      { type: "p", text: "Most people run their entire life through one email, one phone number, and one browser logged into everything. That means a single breach exposes all of it. Compartmentalization is how professionals limit the blast radius: separate identities that don't touch." },

      { type: "h2", text: "Separate your identities" },
      { type: "ul", items: [
        "**Email aliases** — give every service its own address with a relay (Apple Hide My Email, Firefox Relay, SimpleLogin, addy.io). Spam to one alias can be cut off without touching the rest, and a breach can't link your accounts by email.",
        "**Phone numbers** — use a Google Voice or second number for signups so your real number isn't a universal identifier (and isn't exposed to SIM-swap risk).",
        "**Usernames** — different handles for different worlds (work, gaming, dating) so nobody can correlate them.",
      ]},

      { type: "h2", text: "Separate your browsing" },
      { type: "steps", items: [
        { title: "Use browser profiles or containers", text: "Firefox Multi-Account Containers (or separate browser profiles) keep your logged-in sessions and cookies from bleeding into each other. Bank in one, social in another." },
        { title: "Go further with virtual machines", text: "Run risky or sensitive activity in a disposable VM so nothing touches your main system." },
        { title: "Consider Qubes OS", text: "For the highest tier, Qubes isolates everything into separate virtual machines by purpose — the gold standard for compartmentalization." },
      ]},

      { type: "h2", text: "Separate your money" },
      { type: "p", text: "Use **virtual card numbers** (Privacy.com, or your bank's equivalent) so each merchant gets a unique, cancellable card. A leak from one store can't drain your account or follow you to the next." },

      { type: "callout", tone: "warn", text: "Compartmentalization works only if you never cross the streams. Log into a personal account from your anonymous box once, and you've linked them forever. Discipline is the whole game." },
    ],
  },

  {
    slug: "verify-downloads",
    title: "Verify Downloads with Checksums and Signatures",
    description:
      "A download can be swapped for a malicious copy in transit or on a mirror. Checksums and signatures prove you got the real thing — here's how to check.",
    difficulty: "Expert",
    minutes: 7,
    tags: ["integrity", "downloads", "advanced"],
    updated: "June 2026",
    body: [
      { type: "p", text: "When you download sensitive software — Tor, Tails, a crypto wallet, an OS image — you're trusting that the file wasn't tampered with. Projects publish a way to verify that: checksums prove the file is intact, and signatures prove it came from the real developer." },

      { type: "h2", text: "Checksums: did the file arrive intact?" },
      { type: "p", text: "A checksum (usually SHA-256) is a fingerprint of the file. The project lists the expected hash; you compute the hash of your download and compare. If they match, the file is byte-for-byte correct." },
      { type: "ul", items: [
        "**Linux/macOS:** run `sha256sum file` (Linux) or `shasum -a 256 file` (macOS).",
        "**Windows:** run `Get-FileHash file -Algorithm SHA256` in PowerShell.",
        "Compare the output to the published hash — every character must match.",
      ]},
      { type: "callout", tone: "warn", text: "A checksum alone isn't enough if an attacker controls the download page — they could swap both the file and the listed hash. That's what signatures solve." },

      { type: "h2", text: "Signatures: did it really come from the developer?" },
      { type: "p", text: "A cryptographic signature (usually GPG) is made with the developer's private key and verified with their public key. Because only the real developer holds the private key, a valid signature proves authenticity — not just integrity." },
      { type: "steps", items: [
        { title: "Get the developer's public key", text: "Import it from the project's site or a keyserver. Ideally verify the key fingerprint through a second source." },
        { title: "Download the signature file", text: "It usually sits next to the download with a `.asc` or `.sig` extension." },
        { title: "Verify", text: "Run `gpg --verify file.asc file`. A Good signature from the expected key means you're clear." },
      ]},

      { type: "p", text: "This is exactly the step the Tor Project recommends for Tor Browser and Tails. It takes a couple of minutes and it's the difference between running the real thing and running someone's backdoor." },
    ],
  },
];

export function getGuide(slug) {
  return GUIDES.find((g) => g.slug === slug);
}
