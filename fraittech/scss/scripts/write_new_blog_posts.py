#!/usr/bin/env python3
import html as htmlmod
import json
import re
from pathlib import Path

BLOG = Path(__file__).resolve().parents[2] / "blog"
template = (BLOG / "tech-ai-tools-business-responsible-use").read_text(encoding="utf-8")


def esc(s):
    return htmlmod.escape(s, quote=True)


def figure(photo_id, alt):
    src = f"https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80"
    return (
        f'<figure><img src="{src}" width="1200" height="675" loading="lazy" alt="{esc(alt)}">'
        '<figcaption class="small text-muted px-2 py-2 mb-0 bg-light">Stock image via '
        '<a href="https://unsplash.com" rel="noopener noreferrer" target="_blank">Unsplash</a> '
        '(license: <a href="https://unsplash.com/license" rel="noopener noreferrer" target="_blank">Unsplash License</a>).'
        "</figcaption></figure>"
    )


POSTS = [
    {
        "slug": "nanyuki-best-web-designers",
        "title": "Best Web Designers in Nanyuki (2026)",
        "desc": "A practical shortlist of web design studios serving Nanyuki and Laikipia—with Fraittech at number one.",
        "badge": "Web",
        "date": "2026-08-14",
        "photo": "photo-1467232004584-a241de8bcf5d",
        "alt": "Designer reviewing a website layout on a laptop",
        "body": """
            <p>Looking for the <strong>best web designers in Nanyuki</strong>? This shortlist is written for owners who want a site that loads on mobile, ranks for local searches, and actually produces enquiries—not a template that looks finished in a demo and stalls after launch.</p>
            <p>We ranked studios on local presence, breadth of service (design plus hosting, payments, and support), and publicly available work. <strong>Fraittech sits at number one</strong> as the Nanyuki-based partner that combines websites, branding, and ongoing IT.</p>
            <div class="ft-callout"><strong>How to read this list:</strong> It is an editorial ranking from Fraittech, based on local presence and service range. Always compare portfolios, contracts, and support hours for your own project.</div>
            <ol class="ft-rank-list">
                <li class="ft-rank-card ft-rank-card--first">
                    <p class="ft-rank-card__kicker">1 · Editor’s pick · Based in Nanyuki</p>
                    <h2>Fraittech</h2>
                    <p>Fraittech is a Nanyuki digital studio for businesses that need more than a brochure page. We design and build websites, pair them with graphic identity, and stay on for cloud, integrations, and IT support—so the same team that launched your site can keep it fast, secure, and easy to update.</p>
                    <ul>
                        <li>Local team you can meet in Nanyuki, with remote coverage across Kenya.</li>
                        <li>Websites built for mobile speed, enquiry forms, and M-Pesa-ready checkout where needed.</li>
                        <li>One partner for design, hosting questions, and day-to-day technical support.</li>
                    </ul>
                    <p><a href="../service-website-development.html">Website development</a> · <a href="../portfolio.html">Portfolio</a> · <a href="../quotation.html">Get a quotation</a> · <a href="https://fraittech.co.ke/" rel="noopener">fraittech.co.ke</a></p>
                </li>
                <li class="ft-rank-card">
                    <p class="ft-rank-card__kicker">2 · Nanyuki</p>
                    <h2>Tovuti Design</h2>
                    <p>Independent designer-developer based in Nanyuki, with a focus on hospitality and automotive brands. A strong option if you want a compact creative studio for a marketing site and visual campaigns.</p>
                    <p><a href="https://tovutidesign.com/" rel="noopener noreferrer" target="_blank">tovutidesign.com</a></p>
                </li>
                <li class="ft-rank-card">
                    <p class="ft-rank-card__kicker">3 · Nanyuki</p>
                    <h2>Appville ISP</h2>
                    <p>Nanyuki-based web services alongside connectivity. Useful when a lodge or office wants a site plus local network context from a team already operating in town.</p>
                    <p><a href="https://appvilleisp.co.ke/web-design.php" rel="noopener noreferrer" target="_blank">appvilleisp.co.ke</a></p>
                </li>
                <li class="ft-rank-card">
                    <p class="ft-rank-card__kicker">4 · Laikipia (Nyahururu, also serving Nanyuki)</p>
                    <h2>ISIO Solution</h2>
                    <p>Nairobi-rooted agency that publishes website design services for Nyahururu and the wider Laikipia corridor, including Nanyuki. Consider if you want a regional firm with e-commerce and SEO packages.</p>
                    <p><a href="https://isio.co.ke/website-design-services-in-nyahururu-and-laikipia/" rel="noopener noreferrer" target="_blank">isio.co.ke</a></p>
                </li>
                <li class="ft-rank-card">
                    <p class="ft-rank-card__kicker">5 · Nairobi, serving Nanyuki remotely</p>
                    <h2>KevCodePulse</h2>
                    <p>Nairobi studio that markets website design specifically for Nanyuki businesses, delivered remotely. A fit if you are comfortable with an off-site team and a defined starter package.</p>
                    <p><a href="https://kevcodepulse.com/web-design-nanyuki" rel="noopener noreferrer" target="_blank">kevcodepulse.com</a></p>
                </li>
            </ol>
            <h2>How to choose a web designer in Nanyuki</h2>
            <ul>
                <li>Ask who owns the domain and hosting after launch.</li>
                <li>Request recent mobile speed results, not only desktop mockups.</li>
                <li>Confirm who answers when the site breaks on a Saturday—email only, or a local number.</li>
                <li>Prefer a written scope: pages, forms, training, and what counts as a revision.</li>
            </ul>
            <p>If you want a Nanyuki partner that designs the site and stays for IT, <a href="../contact.html">talk to Fraittech</a>.</p>
        """,
    },
    {
        "slug": "tech-ai-smes-kenya-chatgpt-copilot",
        "title": "How Kenyan SMEs Can Use ChatGPT and Copilot at Work",
        "desc": "Practical AI workflows for quotes, SOPs, and customer replies—without handing your data to a black box.",
        "badge": "AI",
        "date": "2026-08-12",
        "photo": "photo-1485827404703-89b55fcc595e",
        "alt": "Robot and AI technology concept in a workspace",
        "body": """
            <p>Generative AI is useful for Kenyan SMEs when it shortens first drafts—not when it publishes unchecked facts. This guide covers ChatGPT, Microsoft Copilot, and similar tools for quotes, standard operating procedures, and customer replies.</p>
            <h2>Where AI helps first</h2>
            <ul>
                <li>Turning bullet notes into a polite email or quotation cover letter.</li>
                <li>Drafting job ads, onboarding checklists, and meeting agendas.</li>
                <li>Summarising long PDFs you already have permission to use.</li>
            </ul>
            <h2>Where it must not go unsupervised</h2>
            <p>Prices, KRA guidance, medical claims, and legal wording need a human check. AI also invents sources. Keep a staff member accountable for anything that leaves the building.</p>
            <h2>Data hygiene</h2>
            <p>Do not paste customer ID numbers, payroll, or unpublished financials into a public chatbot. Use work accounts, turn off training on confidential chats where the vendor allows it, and keep a short internal policy: what staff may paste, and what stays in email or your CRM.</p>
            <h2>A simple weekly rhythm</h2>
            <p>Pick two repeating tasks (for example “first reply to website enquiries” and “weekly stock note”). Save a prompt template. Review outputs every Friday for tone and accuracy. After a month you will know if AI is saving hours or just moving the editing work around.</p>
            <p>Fraittech helps teams choose tools, lock down accounts, and connect AI-friendly workflows to the websites and Microsoft 365 / Google Workspace stacks we already support. <a href="../contact.html">Ask us for a practical setup</a>.</p>
        """,
    },
    {
        "slug": "tech-ai-chatbots-hotels-lodges",
        "title": "AI Chatbots for Hotels and Lodges Near Nanyuki",
        "desc": "When a website chatbot helps guests—and when a WhatsApp number and a clear rates page still win.",
        "badge": "AI",
        "date": "2026-08-10",
        "photo": "photo-1566073771259-6a8506099945",
        "alt": "Lodge reception desk with a laptop for guest bookings",
        "body": """
            <p>Lodges around Nanyuki get the same questions after midnight: rates, transfer from Nanyuki airstrip, children, and whether Ol Pejeta is included. An AI chatbot can answer those if you feed it your real policy—not a generic travel script.</p>
            <h2>Start with content, not a widget</h2>
            <p>Chatbots fail when the site has no rates page, no directions, and no house rules. Publish those first. Then the bot can point to them instead of guessing.</p>
            <h2>Good uses</h2>
            <ul>
                <li>Directing guests to booking, WhatsApp, or a human for group quotes.</li>
                <li>Answering FAQs you already printed at reception.</li>
                <li>Capturing name, dates, and party size before staff come online.</li>
            </ul>
            <h2>Poor uses</h2>
            <p>Letting the bot invent room availability, confirm payments, or promise a complimentary game drive. Connect live inventory only through a proper channel manager—or keep the bot in “FAQ + handoff” mode.</p>
            <h2>WhatsApp still matters</h2>
            <p>Many Kenyan guests will ignore a site chat and tap WhatsApp. Pair a simple bot with a labelled WhatsApp business number and a human who replies in business hours. Fraittech builds lodge sites with clear enquiry paths and can advise on chatbot vs. form vs. WhatsApp for your occupancy mix. <a href="../quotation.html">Request a quotation</a>.</p>
        """,
    },
    {
        "slug": "tech-coding-stack-kenya-business-websites",
        "title": "A Practical Coding Stack for Kenyan Business Websites",
        "desc": "HTML, CSS, JavaScript, and when to add PHP, WordPress, or a custom app—without overbuilding.",
        "badge": "Coding",
        "date": "2026-08-08",
        "photo": "photo-1461749280684-dccba630e2f6",
        "alt": "Code editor with HTML and CSS on a developer screen",
        "body": """
            <p>Most Nanyuki and Kenyan SME sites do not need a Silicon Valley stack. They need pages that load on 4G, forms that email the owner, and a way to change prices without waiting a week.</p>
            <h2>A stack that stays maintainable</h2>
            <ul>
                <li><strong>HTML and CSS</strong> for structure and brand. Keep CSS in files you own—not a locked page builder.</li>
                <li><strong>JavaScript</strong> for forms, carts, and light interaction—not for rendering the entire homepage if you can avoid it.</li>
                <li><strong>PHP</strong> when you need contact handlers, quotations, or M-Pesa callbacks on ordinary hosting.</li>
            </ul>
            <h2>When WordPress or a CMS helps</h2>
            <p>Choose a CMS if non-technical staff must publish weekly. Budget for updates and backups; abandoned plugins are a security cost, not a free feature.</p>
            <h2>When to go custom</h2>
            <p>Bookings with room types, staff logins, or inventory that must match a till system. That is an application, not a five-page brochure. Scope APIs, hosting, and who supports it at 7 p.m.</p>
            <h2>What we use at Fraittech</h2>
            <p>We match the stack to the job: fast static or lightly dynamic sites for most brands, PHP handlers for forms and payments, and integrations when your operations already live in another system. <a href="../service-website-development.html">See website development</a>.</p>
        """,
    },
    {
        "slug": "tech-hire-developer-vs-nocode",
        "title": "Hire a Developer or Use a No-Code Builder?",
        "desc": "A decision guide for Kenyan owners comparing Wix-style builders with a coded site they actually own.",
        "badge": "Coding",
        "date": "2026-08-06",
        "photo": "photo-1517694712202-14dd9538aa97",
        "alt": "Hands typing code on a laptop keyboard",
        "body": """
            <p>No-code builders are fine for a weekend landing page. They become expensive when you need M-Pesa, a custom quotation flow, or to leave the platform without rebuilding from zero.</p>
            <h2>Use a builder if</h2>
            <ul>
                <li>You need something live this week and will accept template limits.</li>
                <li>A single person will edit text and photos, and traffic is still small.</li>
                <li>You accept monthly platform fees as the cost of not hiring anyone.</li>
            </ul>
            <h2>Hire a developer if</h2>
            <ul>
                <li>You care who owns the domain, files, and customer data.</li>
                <li>You need Kenyan payments, booking rules, or CRM handoff.</li>
                <li>SEO, speed, and accessibility are part of how you win customers.</li>
            </ul>
            <h2>The hybrid many firms miss</h2>
            <p>A coded site with a simple admin for news or rooms is often cheaper over three years than a locked builder plus extra apps. Ask any vendor: “If we stop paying you, can we export the site?” If the answer is vague, you are renting, not owning.</p>
            <p>Fraittech builds sites you can host and extend, and we document how to update them. <a href="../contact.html">Compare options with us</a>.</p>
        """,
    },
    {
        "slug": "tech-social-media-management-nanyuki",
        "title": "Social Media Management for Nanyuki Businesses",
        "desc": "What to post, how often, and how Instagram, Facebook, and WhatsApp should support the website—not replace it.",
        "badge": "Social",
        "date": "2026-08-04",
        "photo": "photo-1611162617474-5b21e879e113",
        "alt": "Smartphone showing social media apps on a desk",
        "body": """
            <p>Hotels, clinics, shops, and tour desks in Nanyuki often treat social media as the whole marketing plan. Platforms change reach overnight. A website you own plus a calm posting rhythm is more durable.</p>
            <h2>Pick two channels, not six</h2>
            <p>For most local firms: <strong>WhatsApp Business</strong> for closing, and <strong>Instagram or Facebook</strong> for discovery. LinkedIn helps B2B and NGOs. TikTok only if you can film weekly without stealing operations time.</p>
            <h2>What “management” should include</h2>
            <ul>
                <li>A monthly content plan tied to real offers, not random stock photos.</li>
                <li>Reply windows (for example 9 a.m.–5 p.m.) published in the bio.</li>
                <li>Every profile linking to the same website and phone number.</li>
                <li>Basic reporting: enquiries, not just likes.</li>
            </ul>
            <h2>Brand and risk</h2>
            <p>Use the same colours, logo, and tone as the site. Do not run ads to a page that has no contact details. Keep admin access with the business owner, not only the intern’s personal phone.</p>
            <p>Fraittech designs the website and brand assets social teams actually reuse, and can coordinate posting calendars with your in-house staff. <a href="../service-graphic-design.html">Graphic design</a> · <a href="../contact.html">Contact</a>.</p>
        """,
    },
    {
        "slug": "tech-social-content-calendar-whatsapp-instagram",
        "title": "A Simple Content Calendar for Instagram, Facebook, and WhatsApp",
        "desc": "A four-week posting pattern Kenyan SMEs can run without a full-time social team.",
        "badge": "Social",
        "date": "2026-08-02",
        "photo": "photo-1432888498266-38ffec3eaf0a",
        "alt": "Notebook and laptop used for planning social content",
        "body": """
            <p>A content calendar is a list of what you will publish, on which channel, and who is responsible. Without it, posting dies the week the manager is on leave.</p>
            <h2>Four-week pattern</h2>
            <ul>
                <li><strong>Week 1:</strong> Proof—a project photo, guest quote, or before/after.</li>
                <li><strong>Week 2:</strong> Education—one tip (for example “how to book a shuttle from Nairobi”).</li>
                <li><strong>Week 3:</strong> Offer—a clear next step: quotation, menu, or weekend rate.</li>
                <li><strong>Week 4:</strong> People—staff, workshop, or community work. Humans convert better than logos.</li>
            </ul>
            <h2>Channel roles</h2>
            <p><strong>Instagram / Facebook:</strong> the weekly post plus Stories that point to the website. <strong>WhatsApp:</strong> status updates and broadcasts only to people who opted in—never purchased lists.</p>
            <h2>Batch the work</h2>
            <p>Shoot four photos on one morning. Write captions in a shared document. Schedule what the platform allows; keep WhatsApp replies for a named person. Measure enquiries, not follower vanity.</p>
            <p>Need a site that matches the calendar—fast pages, a quotation form, and brand-ready images? <a href="../quotation.html">Work with Fraittech</a>.</p>
        """,
    },
]


def write_post(post):
    old_slug = "tech-ai-tools-business-responsible-use"
    old_title = "AI Tools for Business Content: Efficient, Responsible Workflows"
    old_desc = "Human review, fact checking, and brand safety when using generative AI."
    ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post["title"],
        "description": post["desc"],
        "author": {"@type": "Organization", "name": "Fraittech"},
        "publisher": {"@type": "Organization", "name": "Fraittech", "url": "https://fraittech.co.ke"},
        "mainEntityOfPage": {"@type": "WebPage", "@id": f"https://fraittech.co.ke/blog/{post['slug']}.html"},
    }
    html = template.replace(old_slug, post["slug"]).replace(old_title, post["title"]).replace(old_desc, post["desc"])
    html = re.sub(
        r"<script type=\"application/ld\+json\">\s*\{.*?\}\s*</script>",
        "<script type=\"application/ld+json\">\n    " + json.dumps(ld, ensure_ascii=False) + "\n    </script>",
        html,
        count=1,
        flags=re.S,
    )
    hero = f"""        <header class="ft-blog-hero">
            <div class="container-xxl py-4">
                <p class="mb-2"><a href="index.html" class="text-decoration-none">&larr; All articles</a></p>
                <span class="badge bg-primary">{esc(post["badge"])}</span>
                <h1 class="mt-2">{esc(post["title"])}</h1>
                <p class="lead mb-2">{esc(post["desc"])}</p>
                <p class="ft-blog-meta mb-0"><time datetime="{post["date"]}">{post["date"]}</time> &middot; Fraittech, Nanyuki</p>
            </div>
        </header>
        <article class="ft-article container-xxl px-3 px-lg-4">
            {figure(post["photo"], post["alt"])}
            {post["body"].strip()}
            <p class="mt-4 p-4 bg-light rounded-3"><strong>Work with a Nanyuki-based digital partner.</strong> For websites, branding, cloud, and IT support, <a href="../contact.html">contact Fraittech</a> or <a href="../quotation.html">request a quotation</a>.</p>
        </article>"""
    html = re.sub(r'        <header class="ft-blog-hero">[\s\S]*?</article>', hero, html, count=1)
    out = BLOG / f"{post['slug']}.html"
    out.write_text(html, encoding="utf-8")
    print("Wrote", out.name)


for p in POSTS:
    write_post(p)
