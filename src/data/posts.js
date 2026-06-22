// Full blog posts. Same block format as guides, rendered by <Article/>.
// Inline markup supported in text: **bold** and `code`.

export const POSTS = [
  {
    slug: "where-to-report-cybercrime",
    title: "Been Hacked or Scammed? Here's Exactly Where to Report Cybercrime",
    description:
      "Official advisories and where to report cybercrime: CISA alerts, the MS-ISAC for state & local government, and the FBI's IC3 for filing complaints \u2014 what each is, when to use it, and how to file a report that actually goes somewhere.",
    date: "2026-06-22",
    readMins: 7,
    tags: ["reporting", "government"],
    body: [
      { type: "p", text: "When something goes wrong online \u2014 a drained account, a ransomware note, a wire that went to a stranger \u2014 most people freeze and tell no one. That is exactly what the criminals count on. Reporting fast does two things: it gives investigators the data they need to connect cases, and in fraud cases it can be the difference between freezing your money and losing it. Here is who to contact, and what each one actually does." },
      { type: "callout", tone: "info", text: "This guide focuses on U.S. reporting channels. If you are outside the U.S., the same steps apply \u2014 report to your national cybercrime unit or CERT and your local police instead (for example, Action Fraud in the UK or the ACSC in Australia)." },

      { type: "h2", text: "The three you'll actually use" },
      { type: "p", text: "Three names cover almost everything. The **FBI's IC3** is where individuals and businesses file complaints about online crime. **CISA** publishes advisories and takes reports of attacks on systems and infrastructure. The **MS-ISAC** is the support line for U.S. state, local, tribal and territorial (SLTT) government bodies. Pick by who you are and what was hit." },

      { type: "h2", text: "FBI IC3 \u2014 file a complaint" },
      { type: "p", text: "The Internet Crime Complaint Center (ic3.gov) is the FBI's front door for internet crime. If you lost money or data to an online scam or intrusion, this is the primary place to file. Your complaint is routed to the right field office and pooled with others \u2014 many takedowns start as a stack of IC3 reports that share one small detail." },
      { type: "ul", items: [
        "Business email compromise (BEC) and fraudulent wire transfers",
        "Ransomware and extortion demands",
        "Investment, crypto and romance scams",
        "Phishing that led to account takeover or identity theft",
        "Tech-support and government-impersonation fraud",
      ]},
      { type: "callout", tone: "good", text: "If money was just wired, file with IC3 immediately. The IC3 Recovery Asset Team can ask banks to freeze fraudulent transfers \u2014 but it works best when reported within about 72 hours, before the funds are moved on. Speed matters more than a perfect write-up." },

      { type: "h2", text: "CISA \u2014 advisories and incident reporting" },
      { type: "p", text: "The Cybersecurity and Infrastructure Security Agency (cisa.gov) is the U.S. government's defensive hub. For most people CISA is where you read **advisories** \u2014 plain warnings about actively exploited vulnerabilities and live threats. If you run systems and you've had an intrusion, or you spot something affecting critical services, CISA also takes incident reports at cisa.gov/report and shares the intelligence with defenders nationwide." },

      { type: "h2", text: "MS-ISAC \u2014 for state, local, tribal & territorial government" },
      { type: "p", text: "If you work for a U.S. city, county, school district, utility or other SLTT government body, the Multi-State Information Sharing and Analysis Center (run by the Center for Internet Security) is built for you. It operates a 24/7 security operations center, shares threat intelligence, and helps members respond to incidents. Many public-sector teams call the MS-ISAC SOC first, then file with IC3." },

      { type: "h2", text: "Don't forget the FTC (U.S. consumers)" },
      { type: "p", text: "For everyday fraud and scams, the Federal Trade Commission's ReportFraud.ftc.gov captures consumer complaints that feed enforcement. If your identity was stolen, IdentityTheft.gov is the standout resource \u2014 it builds you a personalized recovery plan and the official affidavits you'll need to dispute fraudulent accounts." },

      { type: "h2", text: "Before you file: gather this" },
      { type: "steps", items: [
        { title: "Save the evidence", text: "Screenshot emails, texts, transaction pages and error messages. Keep original emails \u2014 their headers carry the trail. Don't delete anything." },
        { title: "Map the money", text: "Note every amount, date, account number, wallet address and reference. For wires, get the exact send time \u2014 the recovery window is counted in hours." },
        { title: "Write a short timeline", text: "A few plain sentences: what happened, when you noticed, and what you did. Investigators act on a clear timeline far faster than a panicked paragraph." },
        { title: "Lock things down", text: "Change passwords from a clean device, turn on two-factor authentication, and call your bank or card issuer. Reporting and securing happen in parallel, not one after the other." },
      ]},

      { type: "h2", text: "Where to report \u2014 the links" },
      { type: "links", items: [
        { label: "FBI IC3 \u2014 file a complaint", url: "https://www.ic3.gov/", note: "Primary: online crime, fraud, ransomware, account takeover" },
        { label: "Report to CISA", url: "https://www.cisa.gov/report", note: "Attacks on systems & infrastructure; incident reporting" },
        { label: "CISA advisories", url: "https://www.cisa.gov/news-events/cybersecurity-advisories", note: "Live warnings on exploited vulnerabilities" },
        { label: "MS-ISAC", url: "https://www.cisecurity.org/ms-isac", note: "For U.S. state, local, tribal & territorial government" },
        { label: "FTC \u2014 ReportFraud", url: "https://reportfraud.ftc.gov/", note: "Consumer scams & fraud" },
        { label: "IdentityTheft.gov", url: "https://www.identitytheft.gov/", note: "Identity-theft recovery plan & affidavits" },
      ]},
      { type: "callout", tone: "warn", text: "If you're in immediate danger, or money is actively leaving your accounts right now, call your bank and local police first \u2014 then file online. Reports document the crime; they are not an emergency response." },

      { type: "p", text: "Want to watch what's being exploited before it reaches you? Our **Intel Radar** pulls the live CISA Known Exploited Vulnerabilities feed and links straight to these reporting channels, so the advisory and the place to report sit side by side." },
    ],
  },
  {
    slug: "fingerprinting-bigger-than-cookies",
    title: "Your Browser Fingerprint Is a Bigger Deal Than Cookies",
    description:
      "You can delete cookies and go incognito and still be followed across the web. The reason is fingerprinting — and almost nobody is told about it.",
    date: "2026-06-10",
    readMins: 6,
    tags: ["fingerprinting", "tracking"],
    body: [
      { type: "p", text: "Everyone knows about cookies. You clear them, you use incognito, you click 'reject all' on the banner, and you feel a little safer. The uncomfortable truth is that none of that stops the most durable form of tracking on the web: **browser fingerprinting**." },

      { type: "h2", text: "What a fingerprint actually is" },
      { type: "p", text: "When a page loads, it can quietly ask your browser dozens of harmless-looking questions. What fonts do you have? What graphics card renders your screen? What's your timezone, your screen size, your language, your exact browser build? Each answer is common on its own. Combined, they form a pattern unique enough to pick you out of millions — with no cookie required and no way for you to clear it." },
      { type: "callout", tone: "info", text: "The EFF's research found that the average browser is unique enough to be identified on its own. The signals are dull individually; together they're a name tag." },

      { type: "h2", text: "Why incognito doesn't save you" },
      { type: "p", text: "Private browsing forgets your history and cookies when you close the window. It does nothing about your fingerprint — your fonts, GPU, and screen are exactly the same in incognito as out of it. To a fingerprinting script, your 'private' window is the same device as always." },

      { type: "h2", text: "So what actually works?" },
      { type: "p", text: "You fight fingerprinting one of two ways: become **identical** to everyone else, or become **different on every visit**." },
      { type: "ul", items: [
        "**Identical:** Tor Browser and Mullvad Browser deliberately make every user look the same, so your fingerprint stops being yours.",
        "**Randomized:** Brave changes key signals per site, so the pattern never lines up across the web.",
      ]},

      { type: "h2", text: "See it for yourself" },
      { type: "p", text: "Abstract warnings don't land until you watch it happen. Run our **Fingerprint** tool and you'll see the exact signals being collected and roughly how rare your combination is. Then try it in Brave or Tor and watch the number change. That's the whole argument in one click." },

      { type: "p", text: "Cookies were the tracking story of the 2010s. Fingerprinting is the quieter, stickier story of right now — and the first step is simply knowing it exists." },
    ],
  },

  {
    slug: "data-brokers-selling-you",
    title: "Data Brokers Are Selling You. Here's How to Fight Back.",
    description:
      "There's a multibillion-dollar industry built on packaging up your name, address, habits, and relatives — and selling the file to anyone who pays. You can claw a lot of it back.",
    date: "2026-06-04",
    readMins: 7,
    tags: ["data brokers", "footprint"],
    body: [
      { type: "p", text: "You never signed up for it, but there are companies whose entire business is **you** — your address history, phone numbers, relatives, estimated income, shopping habits, and more, bundled into a profile and sold to marketers, employers, landlords, and anyone else willing to pay." },

      { type: "h2", text: "Where they get it" },
      { type: "p", text: "From everywhere. Public records (voter rolls, property deeds, court filings), loyalty cards, app permissions, warranty cards, social media, and other companies' breaches all feed the machine. Individually each scrap is trivial; aggregated, it's a dossier." },

      { type: "h2", text: "Why it matters" },
      { type: "ul", items: [
        "**Scammers** use broker data to make phishing and fraud calls convincing.",
        "**Stalkers and abusers** use people-search sites to find addresses.",
        "**Profiling** quietly shapes the prices, ads, and offers you see.",
      ]},

      { type: "h2", text: "How to fight back" },
      { type: "steps", items: [
        { title: "Opt out of the big people-search sites", text: "Spokeo, Whitepages, BeenVerified, Intelius, Radaris and MyLife all have removal pages. Our OSINT Self-Check links straight to them. It's tedious, but it works." },
        { title: "Lock down the inputs", text: "Deny apps your contacts and location, skip warranty cards, and use a separate email and a Google Voice number for signups so your real details don't spread further." },
        { title: "Consider a removal service", text: "If your time is worth more than the fee, services like DeleteMe or EasyOptOuts automate the opt-outs and re-check periodically." },
      ]},

      { type: "callout", tone: "warn", text: "Brokers often re-list you months later from fresh public records. Removal isn't one-and-done — plan to repeat it once or twice a year, or let a service handle the recurring part." },

      { type: "h2", text: "The realistic goal" },
      { type: "p", text: "You probably can't vanish completely — too many sources, too little regulation. But you can remove yourself from the easy, public, one-click lookups that do the most damage. That alone puts you ahead of almost everyone and makes you a far harder target." },
    ],
  },

  {
    slug: "vpns-wont-make-you-anonymous",
    title: "VPNs Won't Make You Anonymous (And That's OK)",
    description:
      "VPN ads promise invisibility. The reality is narrower — and understanding exactly what a VPN does is the difference between real protection and false confidence.",
    date: "2026-05-28",
    readMins: 6,
    tags: ["vpn", "myths"],
    body: [
      { type: "p", text: "If you believe the ads, a VPN is a magic invisibility cloak. It isn't. A VPN is a genuinely useful tool with a specific job — and the people who get burned are the ones who think it does more than it does." },

      { type: "h2", text: "What a VPN actually does" },
      { type: "p", text: "It encrypts the traffic between your device and the VPN server, then sends it on from that server's IP. So two things change: your **internet provider** can no longer see which sites you visit, and the sites you visit see the **VPN's IP** instead of yours." },

      { type: "h2", text: "What it does NOT do" },
      { type: "ul", items: [
        "It doesn't stop **fingerprinting** — sites still recognize your browser.",
        "It doesn't hide you from sites you **log into** — you just told them who you are.",
        "It doesn't make you anonymous to the **VPN provider** — you've moved your trust from your ISP to them.",
        "It doesn't block trackers, ads, or malware on its own.",
      ]},

      { type: "callout", tone: "info", text: "A VPN moves your trust; it doesn't remove it. The question isn't 'am I hidden?' — it's 'do I trust this provider more than my ISP?'" },

      { type: "h2", text: "When a VPN genuinely helps" },
      { type: "ul", items: [
        "On **public Wi-Fi**, to stop the network snooping on you.",
        "To keep your **ISP** from logging and selling your browsing.",
        "To hide your **IP and rough location** from the sites you visit.",
        "To reach content restricted to another region.",
      ]},

      { type: "h2", text: "Choosing one" },
      { type: "p", text: "Look for an independently audited **no-logs** policy, a base in a sensible jurisdiction, and a business model that isn't 'sell your data' — which rules out most 'free' VPNs. Pay for it; if it's free, you're usually the product. Our VPN comparison breaks down the honest trade-offs, including which providers don't even run affiliate programs." },

      { type: "p", text: "Used for the right job, a VPN is worth it. Just don't let the marketing convince you it's the only thing you need — real privacy is layers, and this is one of them." },
    ],
  },

  {
    slug: "claw-back-your-anonymity",
    title: "The Quiet Death of Online Anonymity — and How to Claw It Back",
    description:
      "Being anonymous online used to be the default. Now it takes deliberate effort. Here's how the ground shifted, and a realistic plan to take some of it back.",
    date: "2026-05-20",
    readMins: 7,
    tags: ["privacy", "strategy"],
    body: [
      { type: "p", text: "The early internet was anonymous by accident. You were a handle and an IP, and that was mostly it. Today, being unidentified online is something you have to actively engineer — and most people never realize the default flipped." },

      { type: "h2", text: "How we got here" },
      { type: "p", text: "Three things happened at once: tracking got cheaper, real-name accounts became the norm, and our whole lives moved onto a handful of platforms whose business model is knowing us. None of it required a conspiracy — just incentives all pointing the same way." },

      { type: "h2", text: "Why 'I have nothing to hide' misses the point" },
      { type: "p", text: "Privacy isn't about hiding wrongdoing. It's about control — over who knows what, in what context, for what purpose. You close the bathroom door not because something criminal is happening but because some things are simply yours. A profile assembled without your knowledge takes that choice away." },
      { type: "callout", tone: "info", text: "The goal isn't to disappear. It's to decide, deliberately, what you share — instead of leaking it by default." },

      { type: "h2", text: "A realistic plan" },
      { type: "p", text: "You don't have to go off-grid. Stack a few layers and you reclaim most of the ground without making your life miserable:" },
      { type: "steps", items: [
        { title: "See the problem", text: "Run the tracking and fingerprint tools so you know what's actually leaking. You can't fix what you can't see." },
        { title: "Harden the daily driver", text: "A private browser, a content blocker, blocked third-party cookies. This alone stops most everyday tracking." },
        { title: "Fix the foundations", text: "A password manager, unique passwords, and 2FA on everything that matters." },
        { title: "Shrink your footprint", text: "Opt out of data brokers, lock down phone permissions, and use private alternatives for search and messaging." },
      ]},

      { type: "h2", text: "Start small, but start" },
      { type: "p", text: "Nobody does all of this in a day, and you don't need to. Pick one layer this week. Anonymity online may not be the default anymore — but with a bit of effort, a real measure of it is still yours to take back. That's what the rebellion is: ordinary people deciding to opt out of being the product." },
    ],
  },

  {
    slug: "learn-ethical-hacking",
    title: "How to Actually Learn Ethical Hacking (Beginner to Pro)",
    description:
      "Want to learn to hack — the legal, useful way? Here's a real roadmap: the free platforms, the hands-on labs, the certs, and the one rule you can't break.",
    date: "2026-06-14",
    readMins: 8,
    tags: ["hacking", "learning", "career"],
    body: [
      { type: "p", text: "Ethical hacking — also called penetration testing — is finding security weaknesses **so they can be fixed**, with permission, before the bad guys find them. It's a real, well-paid career, and the wild part is you can learn most of it for free, hands-on, in your browser. Here's how to actually do it." },

      { type: "callout", tone: "warn", text: "The one rule: **only ever test systems you own or have explicit written permission to test.** Poking at someone else's site or network without authorization is a crime in most countries — full stop. The platforms below exist precisely so you have legal targets to practice on. Stay on them." },

      { type: "h2", text: "Start free, right in your browser" },
      { type: "p", text: "These give you guided, legal, beginner-friendly practice with zero setup:" },
      { type: "links", items: [
        { label: "TryHackMe", url: "https://tryhackme.com/", note: "Gamified, guided paths from absolute beginner up. The best place to start." },
        { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", note: "Free, world-class web-hacking labs from the makers of Burp Suite." },
        { label: "OverTheWire (Bandit)", url: "https://overthewire.org/wargames/bandit/", note: "Learn Linux and the command line through a hacking wargame." },
        { label: "picoCTF", url: "https://picoctf.org/", note: "Beginner capture-the-flag challenges built for students." },
      ]},

      { type: "h2", text: "Go hands-on" },
      { type: "p", text: "Once you've got the basics, these put you in front of realistic vulnerable machines:" },
      { type: "links", items: [
        { label: "Hack The Box", url: "https://www.hackthebox.com/", note: "Hack realistic vulnerable boxes; a rite of passage for pentesters." },
        { label: "HTB Academy", url: "https://academy.hackthebox.com/", note: "Structured courses that pair with the HTB labs." },
      ]},

      { type: "h2", text: "Build the fundamentals" },
      { type: "p", text: "Tools come and go; fundamentals are forever. Invest in:" },
      { type: "ul", items: [
        "**Networking** — how TCP/IP, DNS, and HTTP actually work. You can't attack what you don't understand.",
        "**Linux** — the command line is home base for security work. OverTheWire's Bandit teaches it painlessly.",
        "**A scripting language** — Python is the standard for writing quick tools and automating tasks.",
        "**How the web works** — requests, cookies, sessions, and APIs underpin most modern attacks.",
      ]},

      { type: "h2", text: "Certifications and the career path" },
      { type: "p", text: "Certs aren't strictly required, but they open doors and structure your learning. A common ladder: **CompTIA Security+** (foundations) → **eJPT** or **PNPT** (practical entry-level pentesting) → **OSCP** (the respected, hands-on benchmark). Along the way, **bug bounties** let you legally test real companies and get paid for it — the natural bridge from labs to the real world." },

      { type: "h2", text: "Build your own lab" },
      { type: "p", text: "The safest practice ground is one you own. Spin up **Kali Linux** in a virtual machine and attack deliberately vulnerable targets like **DVWA**, **Metasploitable**, or boxes from **VulnHub** — all on your own computer, isolated from the internet. You get unlimited practice and never touch a system you don't own." },

      { type: "callout", tone: "info", text: "The skills to defend and to attack are the same skills. What separates a security professional from a criminal is consent and intent. Keep both clean and this field will pay you well for the rest of your career." },
    ],
  },

  {
    slug: "bug-bounties-legal-hacking",
    title: "Bug Bounties: How to Hack Real Companies, Legally",
    description:
      "Bug bounty programs invite you to break into real systems and pay you for the vulnerabilities you find. Here's how the legal path to hacking actually works.",
    date: "2026-06-12",
    readMins: 5,
    tags: ["hacking", "bug bounty", "legal"],
    body: [
      { type: "p", text: "Here's something that surprises people: major companies will **pay you to hack them**. Bug bounty programs give security researchers legal permission to find and report vulnerabilities — in exchange for cash and recognition. It's the cleanest way to use offensive skills on real targets without breaking the law." },

      { type: "h2", text: "How it works" },
      { type: "p", text: "A company publishes a program with a **scope** (what you're allowed to test) and **rules of engagement**. You find a vulnerability inside that scope, write it up clearly, and submit it privately. If it's valid, you get a reward — anywhere from a thank-you to five figures for a serious bug. Start through a platform that handles the legal framework for you:" },
      { type: "links", items: [
        { label: "HackerOne", url: "https://www.hackerone.com/", note: "The largest bug bounty platform; thousands of programs." },
        { label: "Bugcrowd", url: "https://www.bugcrowd.com/", note: "Another major marketplace for vulnerability disclosure." },
        { label: "Intigriti", url: "https://www.intigriti.com/", note: "Europe-focused platform with a strong researcher community." },
      ]},

      { type: "h2", text: "Read the scope. Every single time." },
      { type: "p", text: "The scope is the line between legal research and a crime. If a domain or technique is **in scope**, you're authorized to test it. If it's **out of scope**, you are not — and testing it anyway can land you in serious legal trouble, bounty or not. When in doubt, ask the program first." },

      { type: "callout", tone: "warn", text: "Responsible disclosure means: report the bug privately, don't access or exfiltrate more data than needed to prove it, and give the company time to fix it before you talk about it publicly. Breaking that trust gets you banned — or prosecuted." },

      { type: "p", text: "If you've been grinding CTFs and lab boxes, bug bounties are where it gets real: real systems, real impact, real money — and a clean conscience. It's the destination the whole ethical-hacking path is pointing toward." },
    ],
  },
];

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug);
}
