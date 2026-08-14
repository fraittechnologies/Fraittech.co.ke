import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG = path.join(ROOT, "blog");

const FOOTER = `
                <!-- Footer Start -->
                <footer class="ft-footer text-light mt-5 wow fadeIn" data-wow-delay="0.1s">
                    <div class="ft-footer-bg" aria-hidden="true"></div>
                    <div class="container position-relative py-5 px-3 px-lg-4">
                        <div class="row g-4 g-xl-5 align-items-start">
                            <div class="col-md-6 col-lg-4">
                                <a href="{p}index.html" class="ft-footer-brand d-inline-flex align-items-center gap-3 text-decoration-none mb-3">
                                    <img src="{p}img/Latest logo.webp" alt="Fraittech" class="ft-footer-logo" width="128" height="128">
                                </a>
                                <p class="ft-footer-lead mb-4">Innovative, reliable technology for businesses that want to grow online and run smoothly every day.</p>
                                <div class="ft-footer-social d-flex flex-wrap gap-2">
                                    <a class="ft-footer-social-btn" href="" aria-label="X"><i class="fab fa-x-twitter"></i></a>
                                    <a class="ft-footer-social-btn" href="" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                                    <a class="ft-footer-social-btn" href="https://www.instagram.com/fraittech/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                                    <a class="ft-footer-social-btn" href="" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                            <div class="col-6 col-md-3 col-lg-2">
                                <h3 class="ft-footer-heading">Quick links</h3>
                                <ul class="ft-footer-list list-unstyled mb-0">
                                    <li><a href="{p}about.html">About</a></li>
                                    <li><a href="{p}service.html">Services</a></li>
                                    <li><a href="{p}portfolio.html">Portfolio</a></li>
                                    <li><a href="{p}blog/index.html">Blog</a></li>
                                    <li><a href="{p}contact.html">Contact</a></li>
                                    <li><a href="{p}quotation.html">Get a quote</a></li>
                                    <li><a href="{p}privacy-policy.html">Privacy policy</a></li>
                                </ul>
                            </div>
                            <div class="col-6 col-md-3 col-lg-3">
                                <h3 class="ft-footer-heading">Services</h3>
                                <ul class="ft-footer-list list-unstyled mb-0">
                                    <li><a href="{p}service-website-development.html">Website development</a></li>
                                    <li><a href="{p}service-graphic-design.html">Graphic design</a></li>
                                    <li><a href="{p}service-it-consulting.html">IT consulting</a></li>
                                    <li><a href="{p}service-it-support.html">IT support</a></li>
                                    <li><a href="{p}service-cloud-services.html">Cloud services</a></li>
                                    <li><a href="{p}service-system-integration.html">System integration</a></li>
                                </ul>
                            </div>
                            <div class="col-md-6 col-lg-3">
                                <h3 class="ft-footer-heading">Contact</h3>
                                <ul class="ft-footer-contact list-unstyled mb-0">
                                    <li><i class="fa fa-map-marker-alt" aria-hidden="true"></i><span>Nanyuki, Kenya</span></li>
                                    <li><i class="fa fa-phone-alt" aria-hidden="true"></i><a href="tel:+254742451220">+254 742 451 220</a></li>
                                    <li><i class="fa fa-envelope" aria-hidden="true"></i><a href="mailto:info@fraittech.co.ke">info@fraittech.co.ke</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="ft-footer-bottom">
                        <div class="container px-3 px-lg-4">
                            <div class="ft-footer-bottom-inner d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 py-4">
                                <p class="ft-footer-copy mb-0 text-center text-md-start">
                                    &copy; <span id="currentYear"></span> <a href="{p}index.html">Fraittech.co.ke</a>. All rights reserved.
                                </p>
                                <nav class="ft-footer-nav d-flex flex-wrap justify-content-center justify-content-md-end gap-1 gap-md-2" aria-label="Footer">
                                    <a href="{p}index.html">Home</a>
                                    <span class="ft-footer-nav-sep" aria-hidden="true">·</span>
                                    <a href="{p}faqs.html">FAQs</a>
                                    <span class="ft-footer-nav-sep" aria-hidden="true">·</span>
                                    <a href="{p}help.html">Help</a>
                                    <span class="ft-footer-nav-sep" aria-hidden="true">·</span>
                                    <a href="{p}privacy-policy.html">Privacy</a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </footer>
                <!-- Footer End -->
`;

/** Shared copy for Nanyuki / Laikipia posts — landmarks for local SEO */
const LANDMARK_SNIPPET = `<h2>Famous places travellers pair with Nanyuki</h2>
        <p>Most itineraries combine Nanyuki town with <strong>Mount Kenya National Park</strong>, <strong>Ol Pejeta Conservancy</strong> (including Sweetwaters and rhino conservation), the <strong>equator marker</strong> in Nanyuki, <strong>Ngare Ndare Forest</strong>, scenic flights or transfers via <strong>Nanyuki airstrip</strong>, heritage stays such as <strong>Fairmont Mount Kenya Safari Club</strong>, and day drives toward <strong>Timau</strong> or the <strong>Lolldaiga Hills</strong>. If you run a lodge, clinic, or tour desk, weaving these names into clear, accurate pages helps visitors (and search engines) understand how you fit the wider Laikipia map.</p>`;

function escAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escTitle(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function unsplashFigure(photoId, alt, width = 1200) {
  const src = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
  return `<figure><img src="${src}" width="1200" height="675" loading="lazy" alt="${escAttr(
    alt
  )}"><figcaption class="small text-muted px-2 py-2 mb-0 bg-light">Photo via <a href="https://unsplash.com" rel="noopener noreferrer" target="_blank">Unsplash</a> (<a href="https://unsplash.com/license" rel="noopener noreferrer" target="_blank">license</a>).</figcaption></figure>`;
}

function blogNavMain(p, blogActiveClass) {
  const ba = blogActiveClass || "";
  return `
                <a href="${p}index.html" class="nav-item nav-link">Home</a>
                <a href="${p}about.html" class="nav-item nav-link">About</a>
                <div class="nav-item dropdown mega-dropdown">
                    <a href="${p}service.html" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Services
                    </a>
                    <div class="dropdown-menu mega-menu">
                        <div class="mega-menu-intro">
                            <span class="mega-menu-eyebrow">Our expertise</span>
                            <p class="mega-menu-headline mb-0">Explore services tailored to your goals&mdash;web, creative, cloud, and ongoing support.</p>
                        </div>
                        <div class="container-fluid mega-menu-inner">
                            <div class="row g-3 g-lg-4 mega-menu-grid">
                                <div class="col-lg-4 col-md-6">
                                    <a href="${p}service-website-development.html" class="mega-item">
                                        <div class="mega-icon"><i class="fa fa-laptop-code"></i></div>
                                        <div class="mega-text">
                                            <h6>Website Development</h6>
                                            <p>Stunning, responsive websites for business growth</p>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <a href="${p}service-graphic-design.html" class="mega-item">
                                        <div class="mega-icon"><i class="fa fa-palette"></i></div>
                                        <div class="mega-text">
                                            <h6>Graphic Design</h6>
                                            <p>Creative designs that captivate your audience</p>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <a href="${p}service-it-consulting.html" class="mega-item">
                                        <div class="mega-icon"><i class="fa fa-user-tie"></i></div>
                                        <div class="mega-text">
                                            <h6>IT Consulting</h6>
                                            <p>Expert guidance on technology strategy</p>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <a href="${p}service-it-support.html" class="mega-item">
                                        <div class="mega-icon"><i class="fa fa-headset"></i></div>
                                        <div class="mega-text">
                                            <h6>IT Support</h6>
                                            <p>Reliable technical support &amp; maintenance</p>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <a href="${p}service-system-integration.html" class="mega-item">
                                        <div class="mega-icon"><i class="fa fa-plug"></i></div>
                                        <div class="mega-text">
                                            <h6>System Integration</h6>
                                            <p>Seamlessly connect your business systems</p>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <a href="${p}service-cloud-services.html" class="mega-item">
                                        <div class="mega-icon"><i class="fa fa-cloud"></i></div>
                                        <div class="mega-text">
                                            <h6>Cloud Services</h6>
                                            <p>Scalable cloud solutions &amp; migration</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="mega-footer">
                                <a href="${p}service.html" class="btn btn-primary rounded-pill">
                                    View All Services <i class="fa fa-arrow-right ms-2"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="${p}portfolio.html" class="nav-item nav-link">Portfolio</a>
                <a href="${p}blog/index.html" class="nav-item nav-link ${ba}">Blog</a>
                <a href="${p}contact.html" class="nav-item nav-link">Contact</a>`;
}

function blogOffcanvasNav(p, blogOffcanvasClass) {
  const bc = blogOffcanvasClass || "";
  return `
                <a href="${p}index.html" class="nav-link py-2 fs-5">Home</a>
                <a href="${p}about.html" class="nav-link py-2 fs-5">About</a>
                <div class="ft-offcanvas-services">
                    <a class="nav-link py-2 d-flex justify-content-between align-items-center collapsed" data-bs-toggle="collapse" href="#ftOffcanvasServices" role="button" aria-expanded="false" aria-controls="ftOffcanvasServices">
                        <span class="fs-5">Services</span>
                        <i class="fas fa-chevron-down small" aria-hidden="true"></i>
                    </a>
                    <div class="collapse" id="ftOffcanvasServices">
                        <div class="d-flex flex-column ps-2 pb-2">
                            <a href="${p}service-website-development.html" class="nav-link py-2">Website Development</a>
                            <a href="${p}service-graphic-design.html" class="nav-link py-2">Graphic Design</a>
                            <a href="${p}service-it-consulting.html" class="nav-link py-2">IT Consulting</a>
                            <a href="${p}service-it-support.html" class="nav-link py-2">IT Support</a>
                            <a href="${p}service-system-integration.html" class="nav-link py-2">System Integration</a>
                            <a href="${p}service-cloud-services.html" class="nav-link py-2">Cloud Services</a>
                            <a href="${p}service.html" class="nav-link py-2 fw-semibold">View all services</a>
                        </div>
                    </div>
                </div>
                <a href="${p}portfolio.html" class="nav-link py-2 fs-5">Portfolio</a>
                <a href="${p}blog/index.html" class="nav-link py-2 fs-5 ${bc}">Blog</a>
                <a href="${p}contact.html" class="nav-link py-2 fs-5">Contact</a>`;
}

function shell(title, desc, canonicalPath, bodyHtml, ogType = "article", blogActiveMain = "") {
  const p = "../";
  const blogNav = blogNavMain(p, blogActiveMain);
  const blogOff = blogOffcanvasNav(p, blogActiveMain ? "fw-semibold" : "");
  const foot = FOOTER.replaceAll("{p}", p);
  const pageUrl = `https://fraittech.co.ke/${canonicalPath}`;
  const ld =
    ogType === "website"
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description: desc,
          url: pageUrl,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: desc,
          author: { "@type": "Organization", name: "Fraittech" },
          publisher: { "@type": "Organization", name: "Fraittech", url: "https://fraittech.co.ke" },
          mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escTitle(title)}</title>
    <meta name="description" content="${escAttr(desc)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${escAttr(pageUrl)}">
    <meta property="og:title" content="${escAttr(title)}">
    <meta property="og:description" content="${escAttr(desc)}">
    <meta property="og:url" content="${escAttr(pageUrl)}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:image" content="https://fraittech.co.ke/img/Latest logo.webp">
    <link href="${p}img/favicon/favicon.ico" rel="icon" type="image/x-icon">
    <link href="${p}img/favicon/favicon.svg" rel="icon" type="image/svg+xml">
    <link href="${p}img/favicon/favicon-96x96.webp" rel="icon" type="image/webp" sizes="96x96">
    <link href="${p}img/favicon/apple-touch-icon.webp" rel="apple-touch-icon">
    <link href="${p}img/favicon/site.webmanifest" rel="manifest">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500&family=Jost:wght@500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="${p}lib/animate/animate.min.css" rel="stylesheet">
    <link href="${p}lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="${p}lib/lightbox/css/lightbox.min.css" rel="stylesheet">
    <link href="${p}css/bootstrap.min.css" rel="stylesheet">
    <link href="${p}css/style.css" rel="stylesheet">
    <link href="${p}css/footer-brand.css" rel="stylesheet">
    <link href="${p}css/blog.css" rel="stylesheet">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <script type="application/ld+json">
    ${JSON.stringify(ld)}
    </script>
</head>
<body class="ft-blog-page">
    <div class="ft-topbar py-2 px-lg-5">
        <div class="container-xxl">
            <div class="row g-4 align-items-center">
                <div class="col-md-8">
                    <div class="ft-topbar-contact d-flex flex-wrap gap-4 small text-white">
                        <div class="d-flex align-items-center">
                            <i class="fa fa-phone text-primary me-2" aria-hidden="true"></i>
                            <a href="tel:+254742451220" class="text-white text-decoration-none">+254 742 451 220</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <i class="fa fa-envelope text-primary me-2" aria-hidden="true"></i>
                            <a href="mailto:info@fraittech.co.ke" class="text-white text-decoration-none">info@fraittech.co.ke</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <i class="fa fa-map-marker-alt text-primary me-2"></i>
                            <span>Nanyuki, Kenya</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <div class="d-flex gap-2 justify-content-md-end ft-topbar-social">
                        <a href="#" class="text-white small" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="text-white small" aria-label="X"><i class="fab fa-x-twitter"></i></a>
                        <a href="#" class="text-white small" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="https://www.instagram.com/fraittech/" target="_blank" rel="noopener noreferrer" class="text-white small" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid bg-white p-0">
        <div id="spinner" class="ft-preloader show" role="progressbar" aria-busy="true" aria-label="Loading page">
            <div class="ft-preloader__noise" aria-hidden="true"></div>
            <div class="ft-preloader__content">
                <div class="ft-preloader__hud">
                    <span class="ft-preloader__corner ft-preloader__corner--tl"></span>
                    <span class="ft-preloader__corner ft-preloader__corner--tr"></span>
                    <span class="ft-preloader__corner ft-preloader__corner--bl"></span>
                    <span class="ft-preloader__corner ft-preloader__corner--br"></span>
                    <div class="ft-preloader__ring" aria-hidden="true">
                        <svg class="ft-preloader__svg" viewBox="0 0 100 100" focusable="false">
                            <circle class="ft-preloader__track" cx="50" cy="50" r="44" fill="none"></circle>
                            <circle class="ft-preloader__arc" cx="50" cy="50" r="44" fill="none"></circle>
                        </svg>
                    </div>
                    <div class="ft-preloader__label">
                        <span class="ft-preloader__brand">Fraittech</span>
                        <span class="ft-preloader__status"><span class="ft-preloader__dots">Initializing</span></span>
                    </div>
                </div>
                <div class="ft-preloader__scan" aria-hidden="true"></div>
            </div>
        </div>
        <div class="container-fluid position-relative p-0">
            <nav class="navbar navbar-expand-lg navbar-light ft-navbar px-4 px-lg-5 py-3 py-lg-0">
                <a href="${p}index.html" class="navbar-brand p-0">
                    <img src="${p}img/Latest logo.webp" alt="Fraittech">
                </a>
                <div class="d-flex align-items-center gap-2 ms-auto d-lg-none ft-navbar-mobile-tools">
                    <a href="${p}cart.html" class="ft-mobile-cart-icon d-inline-flex align-items-center justify-content-center text-decoration-none position-relative" title="Shopping cart" aria-label="Shopping cart">
                        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                        <span class="ft-mobile-cart-icon__badge badge rounded-pill bg-primary" data-cart-count hidden aria-label="Items in cart">0</span>
                    </a>
                    <button class="navbar-toggler ft-nav-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#ftNavOffcanvas" aria-controls="ftNavOffcanvas" aria-expanded="false" aria-label="Open menu">
                        <span class="ft-nav-toggler-bars" aria-hidden="true"><span></span><span></span><span></span></span>
                    </button>
                </div>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="navbar-nav mx-auto py-0">${blogNav}</div>
                    <a href="${p}quotation.html" class="btn rounded-pill py-2 px-4 ms-2 d-none d-lg-block">Get a quotation</a>
                    <a href="${p}cart.html" class="btn ft-navbar-cart-btn rounded-pill py-2 px-3 ms-2 d-none d-lg-inline-flex align-items-center gap-2" title="Shopping cart">
                        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                        <span class="badge bg-primary rounded-pill" data-cart-count hidden aria-label="Items in cart">0</span>
                    </a>
                </div>
            </nav>
            <div class="offcanvas offcanvas-start ft-nav-offcanvas" tabindex="-1" id="ftNavOffcanvas" aria-labelledby="ftNavOffcanvasLabel">
                <div class="offcanvas-header border-bottom align-items-center">
                    <a href="${p}index.html" class="offcanvas-title d-flex align-items-center gap-2 mb-0 text-decoration-none" id="ftNavOffcanvasLabel">
                        <img src="${p}img/Latest logo.webp" alt="Fraittech">
                    </a>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body d-flex flex-column">
                    <nav class="nav flex-column gap-1 ft-offcanvas-nav flex-grow-1" aria-label="Mobile">${blogOff}</nav>
                    <a href="${p}quotation.html" class="btn btn-primary rounded-pill w-100 py-3 mt-2 fw-semibold">Get a quotation</a>
                </div>
            </div>
        </div>
        ${bodyHtml}
        ${foot}
    </div>
    <script src="${p}js/cookies.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${p}lib/wow/wow.min.js"></script>
    <script src="${p}lib/easing/easing.min.js"></script>
    <script src="${p}lib/waypoints/waypoints.min.js"></script>
    <script src="${p}lib/counterup/counterup.min.js"></script>
    <script src="${p}lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="${p}lib/isotope/isotope.pkgd.min.js"></script>
    <script src="${p}lib/lightbox/js/lightbox.min.js"></script>
    <script src="${p}js/main.js"></script>
    <script src="${p}js/cart.js"></script>
    <script>if (window.FraittechCart) FraittechCart.updateCartBadges();</script>
    <script src="${p}js/blog.js" defer></script>
</body>
</html>
`;
}

function articlePage(slug, title, desc, datePublished, category, heroHtml, contentHtml) {
  const canonical = `blog/${slug}.html`;
  const hero = `
        <header class="ft-blog-hero">
            <div class="container-xxl py-4">
                <p class="mb-2"><a href="index.html" class="text-decoration-none">&larr; All articles</a></p>
                <span class="badge bg-primary">${category}</span>
                <h1 class="mt-2">${escTitle(title)}</h1>
                <p class="lead mb-2">${escTitle(desc)}</p>
                <p class="ft-blog-meta mb-0"><time datetime="${datePublished}">${datePublished}</time> &middot; Fraittech, Nanyuki</p>
            </div>
        </header>
        <article class="ft-article container-xxl px-3 px-lg-4">
            ${heroHtml}
            ${contentHtml}
            <p class="mt-4 p-4 bg-light rounded-3"><strong>Work with a Nanyuki-based digital partner.</strong> For websites, branding, cloud, and IT support, <a href="../contact.html">contact Fraittech</a> or <a href="../quotation.html">request a quotation</a>.</p>
        </article>
    `;
  const html = shell(title, desc, canonical, hero, "article", "active");
  fs.writeFileSync(path.join(BLOG, `${slug}.html`), html, "utf8");
}

function indexCard(href, title, excerpt, tag, photoId, alt, category, extraSearch) {
  const img = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;
  const searchRaw = `${title} ${excerpt} ${tag} ${extraSearch || ""}`.toLowerCase();
  const search = escAttr(searchRaw);
  return `<div class="col-md-6 col-lg-4" data-blog-item data-category="${category}" data-search="${search}"><div class="ft-blog-card"><img class="ft-blog-card__img" src="${img}" alt="${escAttr(
    alt
  )}" loading="lazy"><div class="ft-blog-card__body"><span class="ft-blog-card__tag">${tag}</span><h3 class="ft-blog-card__title"><a href="${href}.html">${escTitle(
    title
  )}</a></h3><p class="ft-blog-card__excerpt">${escTitle(excerpt)}</p></div></div></div>`;
}

function main() {
  fs.mkdirSync(BLOG, { recursive: true });

  articlePage(
    "nanyuki-kenya-guide-location-county-travel",
    "Nanyuki, Kenya: Location, County, and How to Get There",
    "Where Nanyuki sits in Laikipia County, how to reach it from Nairobi, Meru, and Isiolo, and what travellers and businesses should know.",
    "2026-04-18",
    "Nanyuki guide",
    unsplashFigure(
      "photo-1516426122078-c23e76319801",
      "Open savannah and safari light—typical of the Laikipia conservancy circuit visitors combine with Nanyuki."
    ),
    `<p>Nanyuki is one of the best-known towns on the leeward side of Mount Kenya. People search for it alongside practical questions: <strong>which county is Nanyuki in</strong>, <strong>how far from Nairobi</strong>, and <strong>distance from Meru or Isiolo</strong>. This guide answers those questions in one place so visitors, new residents, and businesses can plan confidently.</p>
        ${LANDMARK_SNIPPET}
        <h2>Where is Nanyuki located?</h2>
        <p>Nanyuki lies in <strong>Laikipia County</strong>, at the foot of Mount Kenya. It is a gateway for tourism into the mountain and conservancies, and a service hub for agriculture, retail, and defence communities nearby. If you are verifying an <strong>address in Nanyuki</strong>, always cross-check the estate or landmark with the official postal code (commonly <strong>10400</strong> for Nanyuki town area—confirm with Kenya Post for your exact box or street).</p>
        <h2>Distance and driving time from major towns</h2>
        <p>Road distances vary slightly by route and where you measure from, but typical planning figures are:</p>
        <ul>
            <li><strong>Nairobi to Nanyuki</strong>: roughly <strong>190–200 km</strong> by the main highway via Nyeri; often <strong>3 to 4 hours</strong> by car depending on traffic and stops.</li>
            <li><strong>Meru to Nanyuki</strong>: commonly cited around <strong>80–110 km</strong> depending on whether you travel via Timau or other links—check live maps before travel.</li>
            <li><strong>Isiolo to Nanyuki</strong>: a shorter hop north–south on the corridor toward Mount Kenya; many travellers combine Isiolo and Nanyuki when touring the region.</li>
        </ul>
        <p>Searchers also ask <strong>how many hours from Nairobi to Nanyuki</strong>: budget at least three hours in good conditions; add buffer during rain, night driving, or holiday peaks.</p>
        <h2>Flights and shuttles</h2>
        <p>There is recurring interest in <strong>flights to Nanyuki from Nairobi</strong> and <strong>Nairobi to Nanyuki shuttle</strong> services. Scheduled flights and charter options change seasonally—always confirm current operators, baggage rules, and airstrip locations. Shared shuttles can be cost-effective; private hire offers flexibility for groups or tight schedules.</p>
        <h2>Why this matters for local businesses</h2>
        <p>High search volume for “<strong>Nanyuki Kenya</strong>” and “<strong>Nanyuki town</strong>” shows that people discover the region online first. Hotels, clinics, tour operators, and retailers win when their websites answer these logistics questions clearly, load fast on mobile, and show trustworthy contact details—something our team at Fraittech helps Laikipia businesses implement every week.</p>
        <div class="ft-callout"><strong>Note:</strong> Distances and travel times are estimates for planning. Use your navigation app at the time of travel for live routing.</div>`
  );

  articlePage(
    "nanyuki-nairobi-distance-route-shuttles",
    "Nairobi to Nanyuki Distance, Route Tips, and Shuttle Options",
    "Practical guidance on driving distance, road choices, and transport between Kenya’s capital and Nanyuki.",
    "2026-04-18",
    "Travel",
    unsplashFigure(
      "photo-1469854523086-cc02fe5d8800",
      "Open road through mountain scenery—planning the drive from Nairobi toward Laikipia and Nanyuki."
    ),
    `<p>Among the most common queries we see in keyword data are <strong>nairobi to nanyuki distance</strong>, <strong>how far is nanyuki from nairobi</strong>, and <strong>nanyuki distance from nanyuki to nairobi</strong> (people phrase it in many ways). This article standardises the answers.</p>
        ${LANDMARK_SNIPPET}
        <h2>Typical road distance</h2>
        <p>Most routing tools place the drive between <strong>190 km and 205 km</strong> depending on whether you start from central Nairobi or the outskirts, and whether you use the primary highway through Nyeri. The road is mostly paved and busy with tourism and freight—expect enforcement checkpoints and slower traffic through market towns.</p>
        <h2>Driving tips</h2>
        <ul>
            <li>Fill fuel before long climbs; weather near Mount Kenya can change quickly.</li>
            <li>Night driving requires extra caution because of pedestrians, cyclists, and livestock.</li>
            <li>If you are coordinating <strong>meru road</strong> or cross-country itineraries, confirm whether you are routing via Timau or rejoining the main highway.</li>
        </ul>
        <h2>Alternatives to self-drive</h2>
        <p>Shuttle operators and matatu routes fluctuate. Search for “<strong>nairobi to nanyuki shuttle</strong>” plus the month of travel; validate departure points (often specific hotels or terminals). For teams, a chartered minibus can reduce total cost per seat.</p>
        <h2>SEO lesson for transport and hospitality brands</h2>
        <p>Pages that embed structured FAQs (distance, duration, booking links) tend to earn featured snippets. If you run a lodge, clinic, or logistics firm in Nanyuki, pairing accurate travel content with local schema markup helps Google match you to these high-volume searches.</p>`
  );

  articlePage(
    "nanyuki-hotels-accommodation-booking-guide",
    "Hotels and Accommodation in Nanyuki: What Search Data Tells Visitors",
    "A practical overview of where guests look before they book—and how properties can stand out online.",
    "2026-04-18",
    "Hospitality",
    unsplashFigure(
      "photo-1520250497591-112f2f40a3f4",
      "Resort pool and deck—guests comparing hotels in Nanyuki expect strong photography and clear booking paths."
    ),
    `<p>Research consistently shows strong interest in <strong>hotels in nanyuki</strong>, <strong>nanyuki hotels</strong>, and <strong>accommodation in nanyuki</strong>. Travellers compare price, proximity to Mount Kenya, and reviews before they commit.</p>
        ${LANDMARK_SNIPPET}
        <h2>What guests expect on your website</h2>
        <ul>
            <li>Clear room categories, photos, and current contact channels (phone, WhatsApp, email).</li>
            <li>Directions from Nairobi with a downloadable pin and estimated drive time.</li>
            <li>Policies on deposits, cancellations, and peak-season pricing.</li>
        </ul>
        <h2>Connecting hospitality with technology</h2>
        <p>Modern lodges and town hotels benefit from integrated booking helpers, fast mobile pages, and secure payment options—including <strong>digital payments</strong> guests already use elsewhere in Kenya. Fraittech builds lightweight marketing sites and connects them to analytics so owners see which keywords (for example “<strong>hotels in nanyuki kenya</strong>”) actually produce enquiries.</p>
        <h2>Content ideas that rank</h2>
        <p>Beyond room listings, helpful articles on <strong>places to visit in nanyuki</strong>, family itineraries, and conference venues keep users on-site longer and support organic visibility.</p>`
  );

  articlePage(
    "nanyuki-weather-attractions-golf-clubs",
    "Nanyuki Weather, Golf, Clubs, and Top Places to Visit",
    "From fairways to forecasts: what draws visitors to Nanyuki and how to plan around the climate.",
    "2026-04-18",
    "Lifestyle &amp; tourism",
    unsplashFigure(
      "photo-1535131749006-b7f58c99034b",
      "Golf fairway at elevation—Nanyuki’s cool climate supports year-round play near Mount Kenya."
    ),
    `<p>Search trends surface steady interest in <strong>nanyuki weather</strong>, <strong>nanyuki golf club</strong>, <strong>nanyuki country club</strong>, and <strong>places to visit in nanyuki kenya</strong>. Together they paint a picture of a town that mixes outdoor sport, cool-climate leisure, and safari-style excursions.</p>
        ${LANDMARK_SNIPPET}
        <h2>Weather and packing</h2>
        <p>Nanyuki’s elevation means cooler nights year-round. Layered clothing, a windproof jacket, and sun protection are sensible even when midday feels warm. For “<strong>nanyuki weather forecast weather today</strong>” style queries, always check a trusted meteorological source on the morning of your activity—mountain microclimates shift quickly.</p>
        <h2>Golf and member clubs</h2>
        <p>Golf courses and country clubs are part of the town’s identity. Visitors searching <strong>nanyuki clubs in</strong> or <strong>sports club</strong> are often comparing guest policies, green fees, and dining. If you manage a club, publishing transparent visitor rules and photo galleries improves both SEO and guest satisfaction.</p>
        <h2>Itinerary starters</h2>
        <ul>
            <li><strong>Mount Kenya National Park</strong> viewpoints and forest walks (with licensed guides where required).</li>
            <li><strong>Ol Pejeta Conservancy</strong> for Big Five sightings and the Sweetwaters chimpanzee sanctuary.</li>
            <li>The <strong>equator marker</strong> in Nanyuki town for a quick photo stop.</li>
            <li><strong>Ngare Ndare Forest</strong> canopy walks and waterfalls on suitable days.</li>
            <li>Weekend cafés and farm stops between Nanyuki and <strong>Timau</strong>.</li>
        </ul>
        <p>Businesses that sponsor events or offer corporate retreats should highlight AV equipment, backup power, and internet reliability—topics technology partners like us document clearly for event bookers.</p>`
  );

  articlePage(
    "nanyuki-hospitals-healthcare-finding-care",
    "Hospitals and Healthcare in Nanyuki: Finding Public and Private Care",
    "How people search for medical services in Nanyuki and how to verify information responsibly.",
    "2026-04-18",
    "Healthcare",
    unsplashFigure(
      "photo-1519494026892-80bbd2d6fd0d",
      "Modern hospital exterior—patients often search on mobile for facilities near Nanyuki and Laikipia."
    ),
    `<p>Keyword research shows recurring searches for <strong>hospitals in nanyuki</strong>, <strong>hospitals in nanyuki private</strong>, <strong>nanyuki teaching and referral hospital</strong>, <strong>nanyuki cottage hospital</strong>, and <strong>nanyuki hospital contacts</strong>. People need care quickly and often discover options on their phones first.</p>
        ${LANDMARK_SNIPPET}
        <h2>Public and private options</h2>
        <p>Nanyuki hosts a mix of public referral facilities and private clinics. Names and services evolve; always confirm emergency numbers, outpatient hours, and specialist availability directly with the facility. This article does not publish phone numbers because they change—use official hospital websites, signage, or directory services.</p>
        <h2>What healthcare providers should publish online</h2>
        <ul>
            <li>Accurate departments, visiting hours, and escalation paths for emergencies.</li>
            <li>Accessible pages (large text, fast loading) for anxious users on slow networks.</li>
            <li>Privacy-compliant forms instead of asking patients to email sensitive data casually.</li>
        </ul>
        <h2>Technology support</h2>
        <p>Fraittech helps clinics and professional practices with secure hosting, appointment enquiry forms, and IT support so staff spend less time fighting website issues and more time on patient care.</p>
        <div class="ft-callout"><strong>Medical disclaimer:</strong> This content is general information, not medical advice. For emergencies, contact local emergency services or go to the nearest appropriate facility.</div>`
  );

  const techBodies = {
    "tech-cloud-migration-smes-kenya": `<p>Start with email and shared files: moving to Microsoft 365 or Google Workspace gives predictable backups and easier offboarding when staff leave. Next, consider line-of-business apps—avoid big-bang cutovers; pilot one department, measure support tickets, then expand.</p><p>Latency to European cloud regions is usually acceptable for Kenyan SMEs, but test critical apps during peak hours. Document admin accounts, disable legacy protocols, and enable multi-factor authentication before you migrate.</p>`,
    "tech-cybersecurity-hygiene-kenya-business": `<p>Most breaches still start with reused passwords and unpatched software. Enforce a password manager, turn on MFA for email and banking, and patch within days—not months—for internet-facing systems.</p><p>Run a quarterly “restore drill” from backups so you are not learning backup passwords during a ransomware incident. Culture matters: reward staff who report suspicious mail instead of punishing clicks.</p>`,
    "tech-professional-web-design-roi": `<p>Templates can look fine in demos but collapse under real content, slow photography, and integrations you actually need. Custom design aligns typography, spacing, and calls-to-action with your sales funnel.</p><p>Performance and accessibility are ranking factors: a bespoke build can target Core Web Vitals explicitly, whereas bloated themes often fail mobile tests in Kenya’s mixed 3G/4G environment.</p>`,
    "tech-google-workspace-vs-microsoft-365": `<p>If your archive is already in Outlook and Excel power users dominate, Microsoft 365 is often smoother. If you live in Gmail and lightweight docs, Workspace may feel faster to adopt.</p><p>Check data residency expectations, e-discovery needs, and whether you need Active Directory–style device management—Microsoft tends to win there, while Workspace shines in simplicity and contractor collaboration.</p>`,
    "tech-hotel-wifi-guest-networks": `<p>Isolate guests from staff VLANs, rate-limit streaming, and keep a separate SSID for IoT devices like CCTV. Captive portals should collect only what law and your policy require.</p><p>For lodges near Nanyuki, highlight uptime in marketing: publish realistic Mbps expectations and offer a paid “priority” tier for remote workers if backhaul is limited.</p>`,
    "tech-pos-inventory-retail-kenya": `<p>Choose POS that exports clean CSV/PDF for accountants and supports offline sales when power blips. Integrations to e-commerce reduce double entry.</p><p>Train cashiers on void/discount policies to prevent fraud; reconcile daily and lock down admin accounts.</p>`,
    "tech-backup-strategy-321-rule": `<p>Keep <strong>three</strong> copies of important data, on <strong>two</strong> different media, with <strong>one</strong> off-site (often encrypted cloud). Snapshots are not backups if ransomware can encrypt them—use immutable or air-gapped targets where possible.</p><p>Test restores quarterly; log who performed the test and how long a full recovery took.</p>`,
    "tech-remote-work-it-setup": `<p>Standardise on company-owned or enrolled BYOD devices. Use conditional access: healthy devices only, from expected countries, with MFA.</p><p>Document “how we support remote staff” (hours, escalation, approved tools) so IT is not negotiating policy during outages.</p>`,
    "tech-api-integration-explained": `<p>An API is a structured way for one system to request data or actions from another—orders from web to ERP, payments to ledger, SMS alerts from booking engines.</p><p>Scope integrations by fields, frequency, error handling, and who owns API keys. Budget for monitoring: silent failures cost more than upfront logging.</p>`,
    "tech-mobile-first-page-speed": `<p>Google measures real-user performance; heavy hero images and third-party scripts hurt Kenyan mobile users most. Compress images (WebP/AVIF), lazy-load below the fold, and host locally where possible.</p><p>Pair technical speed with clear content—fast pages that do not answer the query still bounce.</p>`,
    "tech-phishing-awareness-staff-training": `<p>Run short quarterly trainings plus occasional simulations. Make reporting one click in email clients; security team should thank reporters, not shame them.</p><p>Verify payment changes by voice for high-value transfers—CEO fraud still works because processes skip this step.</p>`,
    "tech-domain-hosting-kenya-checklist": `<p>Own your domain in an account you control; avoid letting an agency register domains in their name. Turn on auto-renew and registry lock for high-value brands.</p><p>For hosting, evaluate support SLAs, backup inclusion, and whether you need Kenyan data residency or simply low latency to users.</p>`,
    "tech-crm-small-business-starter": `<p>Start with pipeline stages matching how you actually sell (enquiry → quote → deposit → delivery). Avoid custom fields until basics are adopted.</p><p>Integrate WhatsApp handoffs carefully—log consent and store transcripts where your policy allows.</p>`,
    "tech-firewall-network-segmentation-basics": `<p>Firewalls filter traffic between zones; segmentation limits how far an attacker moves after one mistake. Guest Wi-Fi, staff PCs, servers, and cameras should not share a flat network.</p><p>Log denied connections and review monthly; noise is high at first but patterns reveal misconfigurations early.</p>`,
    "tech-mpesa-web-payments-integration": `<p>STK Push improves conversion versus manual paybill typing, but you must handle timeouts, duplicate callbacks, and reconciliation exports. Show clear receipts and support contacts on failure screens.</p><p>Work with licensed aggregators; never store PINs or card data you do not need.</p>`,
    "tech-iot-smart-buildings-intro": `<p>Start with measurable pain: energy meters, water leaks, or room occupancy—not gadgets. Pick vendors who document firmware update paths.</p><p>Isolate IoT on separate VLANs; many devices ship with default passwords and rare patches.</p>`,
    "tech-ai-tools-business-responsible-use": `<p>Use AI for drafts and brainstorming, not final facts without verification—especially prices, regulations, and medical content. Keep humans in the loop for brand voice and compliance.</p><p>Log prompts that touch customer data; some tools are not appropriate for confidential files.</p>`,
    "tech-ssd-vs-hdd-business-pcs": `<p>NVMe SSDs cut boot and antivirus scan times dramatically; support tickets for “slow PC” drop after upgrades. HDDs remain acceptable for cold archival attached to NAS, not primary OS disks.</p><p>Plan imaging and swap procedures so upgrades do not cost a full day of downtime.</p>`,
    "tech-structured-cabling-offices": `<p>Pull spare conduits and label both ends consistently—photos of patch panels save future you. Plan AP locations before ceilings close; concrete and glass wreck Wi-Fi predictions.</p><p>Coordinate with electricians on earthing and surge protection; networking gear hates unstable power.</p>`,
    "tech-it-support-retainer-vs-breakfix": `<p>Break-fix feels cheaper until repeated outages stack up. Retainers fund monitoring, patching cadence, and faster response when revenue depends on uptime.</p><p>Define what “priority” means (response vs resolution) and which systems are in scope so both sides avoid scope arguments mid-incident.</p>`,
  };

  const tech = [
    ["tech-cloud-migration-smes-kenya", "Cloud Migration for Kenyan SMEs: A Practical Starter Guide", "When moving email, files, or line-of-business apps to the cloud makes sense—and how to reduce risk.", "Cloud", "photo-1451187580459-43490279c0fa", "Server room abstract technology blue"],
    ["tech-cybersecurity-hygiene-kenya-business", "Cybersecurity Basics Every Kenya Business Should Implement This Year", "Passwords, updates, backups, and culture: low-cost habits that stop most common attacks.", "Security", "photo-1563986768609-322da13575f3", "Cybersecurity lock digital concept"],
    ["tech-professional-web-design-roi", "Why Professional Web Design Still Outperforms DIY Templates", "Trust, speed, and conversion: what bespoke design buys you in competitive markets.", "Web", "photo-1460925895917-afdab827c52f", "Analytics dashboard on laptop"],
    ["tech-google-workspace-vs-microsoft-365", "Google Workspace vs Microsoft 365 for Kenyan Teams", "How to choose collaboration stacks based on email history, compliance, and budget.", "Productivity", "photo-1522071820081-009f0129c71c", "Team collaboration meeting"],
    ["tech-hotel-wifi-guest-networks", "Reliable Guest Wi-Fi for Hotels and Lodges Near Nanyuki", "Separate VLANs, fair bandwidth, and branded login pages guests actually understand.", "Hospitality IT", "photo-1558618666-fcd25c85cd64", "Wi-Fi router wireless concept"],
    ["tech-pos-inventory-retail-kenya", "POS and Inventory Systems: What Retailers Should Look For", "Integrations, offline mode, and reporting that matches KRA record-keeping expectations.", "Retail tech", "photo-1556742049-0cfed4f6a45d", "Payment terminal retail"],
    ["tech-backup-strategy-321-rule", "Backup Strategy for Business: The 3-2-1 Rule Explained Simply", "Local copies, cloud copies, and tested restores—why one USB stick is not enough.", "Infrastructure", "photo-1629654297293-c0676bfa18fb", "External hard drive backup"],
    ["tech-remote-work-it-setup", "Remote Work IT Setup: Security Without Friction", "VPN alternatives, device policies, and support workflows that scale past ten staff.", "Remote work", "photo-1588196749597-9ff075ee6b5b", "Video conference remote work"],
    ["tech-api-integration-explained", "API Integrations Explained for Non-Technical Managers", "How systems talk to each other, typical costs, and how to scope an integration project.", "Integration", "photo-1558494949-ef010cbdcc31", "Network cables data center"],
    ["tech-mobile-first-page-speed", "Mobile-First Performance: Why Speed Is an SEO and Sales Issue", "Core Web Vitals, image compression, and hosting choices that affect ranking in Kenya.", "Performance", "photo-1512941937669-90a1b58e7e9c", "Smartphone mobile browsing"],
    ["tech-phishing-awareness-staff-training", "Phishing Awareness: Train Staff to Spot the Latest Tricks", "Simulated tests, clear reporting channels, and policy essentials for SMEs.", "Security", "photo-1633265486064-086b219458ec", "Email security concept"],
    ["tech-domain-hosting-kenya-checklist", "Choosing a Domain and Hosting in Kenya: A Short Checklist", "DNS, SSL, renewal traps, and support quality—questions to ask before you pay.", "Web infrastructure", "photo-1597852074816-d933c7d2b988", "Domain DNS concept keyboard"],
    ["tech-crm-small-business-starter", "CRM for Small Business: Start Simple, Scale Later", "Pipeline visibility without enterprise bloat; integration with WhatsApp and email.", "Sales tech", "photo-1552664730-d307ca884978", "Team CRM meeting"],
    ["tech-firewall-network-segmentation-basics", "Firewalls and Network Segmentation in Plain Language", "Why guest Wi-Fi should never touch your finance VLAN.", "Network", "photo-1544197150-b99a580bb7a8", "Network server lights"],
    ["tech-mpesa-web-payments-integration", "M-Pesa and Web Payments: What Developers and Owners Need to Know", "STK Push, reconciliation, and user experience patterns that reduce drop-off.", "Fintech", "photo-1563013544-824ae1b704d3", "Mobile payment phone"],
    ["tech-iot-smart-buildings-intro", "IoT and Smart Buildings: Where to Start Without Overbuilding", "Sensors, dashboards, and realistic ROI for offices and lodges.", "IoT", "photo-1518770660439-4636190af475", "Electronic circuit board IoT"],
    ["tech-ai-tools-business-responsible-use", "AI Tools for Business Content: Efficient, Responsible Workflows", "Human review, fact checking, and brand safety when using generative AI.", "AI", "photo-1677442136019-21780ecad995", "AI neural abstract"],
    ["tech-ssd-vs-hdd-business-pcs", "SSD vs HDD for Business PCs in 2026", "Why NVMe drives pay for themselves in support time saved.", "Hardware", "photo-1597872200969-2b65d56bd16b", "SSD hard drive components"],
    ["tech-structured-cabling-offices", "Structured Cabling for New Offices: Plan Before You Drywall", "Cable trays, labels, and spare capacity that save money later.", "Infrastructure", "photo-1504384308090-c894fdcc538d", "Office workspace planning technology"],
    ["tech-it-support-retainer-vs-breakfix", "IT Support: Retainer vs Break-Fix for Growing Teams", "How to budget for proactive monitoring and faster incident response.", "IT support", "photo-1516321318423-f06f85e504b3", "IT support technician laptop"],
  ];

  for (const [slug, title, desc, cat, photo, alt] of tech) {
    const src = `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=80`;
    const deep = techBodies[slug] || "";
    articlePage(
      slug,
      title,
      desc,
      "2026-04-18",
      cat,
      `<figure><img src="${src}" width="1200" height="675" loading="lazy" alt="${escAttr(alt)}"><figcaption class="small text-muted px-2 py-2 mb-0 bg-light">Stock image via <a href="https://unsplash.com" rel="noopener noreferrer" target="_blank">Unsplash</a> (license: <a href="https://unsplash.com/license" rel="noopener noreferrer" target="_blank">Unsplash License</a>).</figcaption></figure>`,
      `<p>${desc}</p>
            <h2>Key takeaways</h2>
            <ul>
                <li>Align technology choices with how your team actually works day to day—not only with vendor marketing.</li>
                <li>Measure outcomes: uptime, ticket volume, lead response time, or checkout completion.</li>
                <li>Partner with specialists when security, compliance, or customer trust is on the line.</li>
            </ul>
            <h2>Deeper dive</h2>
            ${deep}
            <p>Fraittech provides website development, cloud guidance, integrations, and ongoing IT support from Nanyuki, with remote coverage nationwide. If you want a roadmap tailored to your budget, <a href="../contact.html">talk to our team</a>.</p>`
    );
  }

  const nanyukiList = [
    [
      "nanyuki-kenya-guide-location-county-travel",
      "Nanyuki location, county & travel",
      "Where Nanyuki is, distances from Nairobi, Meru, and Isiolo.",
      "Guide",
      "photo-1516426122078-c23e76319801",
      "Laikipia safari scenery—how many travellers experience the region around Nanyuki.",
    ],
    [
      "nanyuki-nairobi-distance-route-shuttles",
      "Nairobi to Nanyuki distance & shuttles",
      "Route tips and transport options.",
      "Travel",
      "photo-1469854523086-cc02fe5d8800",
      "Highland road journey toward Laikipia and Nanyuki.",
    ],
    [
      "nanyuki-hotels-accommodation-booking-guide",
      "Hotels & accommodation",
      "What guests search before they book.",
      "Hospitality",
      "photo-1520250497591-112f2f40a3f4",
      "Resort-style stay—what visitors expect from Nanyuki accommodation sites.",
    ],
    [
      "nanyuki-weather-attractions-golf-clubs",
      "Weather, golf & places to visit",
      "Plan around Nanyuki’s climate and attractions.",
      "Tourism",
      "photo-1535131749006-b7f58c99034b",
      "Golf fairway—cool-climate sport near Mount Kenya.",
    ],
    [
      "nanyuki-hospitals-healthcare-finding-care",
      "Hospitals & healthcare",
      "Finding care and publishing trustworthy info online.",
      "Healthcare",
      "photo-1519494026892-80bbd2d6fd0d",
      "Hospital architecture—how patients discover care near Nanyuki.",
    ],
  ];

  const laikipiaExtra =
    "nanyuki laikipia mount kenya ol pejeta sweetwaters equator ngare ndare timau safari club airstrip lolldaiga";

  const nanyukiCards = nanyukiList
    .map(([href, title, excerpt, tag, pid, alt]) => indexCard(href, title, excerpt, tag, pid, alt, "laikipia", laikipiaExtra))
    .join("\n");

  const techCards = tech
    .map(([slug, title, desc, cat, photo, alt]) => {
      const img = `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=80`;
      const search = escAttr(`${title} ${desc} ${cat}`.toLowerCase());
      const excerpt = `${desc.slice(0, 100)}…`;
      return `<div class="col-md-6 col-lg-4" data-blog-item data-category="technology" data-search="${search}"><div class="ft-blog-card"><img class="ft-blog-card__img" src="${img}" alt="${escAttr(
        alt
      )}" loading="lazy"><div class="ft-blog-card__body"><span class="ft-blog-card__tag">${cat}</span><h3 class="ft-blog-card__title"><a href="${slug}.html">${escTitle(
        title
      )}</a></h3><p class="ft-blog-card__excerpt">${escTitle(excerpt)}</p></div></div></div>`;
    })
    .join("\n");

  const totalPosts = nanyukiList.length + tech.length;

  let indexBody = `
        <header class="ft-blog-hero ft-blog-hero--modern">
            <div class="container-xxl ft-blog-hero__inner">
                <div class="ft-blog-hero__intro">
                    <span class="badge bg-primary rounded-pill px-3 py-2">Insights</span>
                    <h1 class="mt-3 mb-3">Guides for Nanyuki, Laikipia, and Kenyan businesses</h1>
                    <p class="lead ft-blog-hero__lead mb-0">Local travel context around Mount Kenya, Ol Pejeta, and the equator—plus practical IT and web guidance from our Nanyuki team.</p>
                    <div class="ft-blog-stats-card ft-blog-stats-card--hero p-4 rounded-4 bg-white shadow-sm border">
                        <p class="small text-uppercase text-muted fw-bold mb-2 letter-spacing-1">Library</p>
                        <p class="h3 mb-0 fw-bold" id="ftBlogCount">${totalPosts} articles</p>
                    </div>
                </div>
            </div>
        </header>
        <div class="container-xxl px-3 px-lg-4 pb-5">
            <div class="ft-blog-toolbar mb-4">
                <div class="row g-3 align-items-center">
                    <div class="col-lg-5">
                        <label class="visually-hidden" for="ftBlogSearch">Search articles</label>
                        <div class="input-group input-group-lg shadow-sm rounded-3 overflow-hidden ft-blog-search-wrap">
                            <span class="input-group-text bg-white border-0" aria-hidden="true"><i class="fa fa-search text-muted"></i></span>
                            <input type="search" id="ftBlogSearch" class="form-control border-0" placeholder="Search titles, topics, or keywords…" autocomplete="off">
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="d-flex flex-wrap gap-2 justify-content-lg-end ft-blog-filters" role="group" aria-label="Filter by category">
                            <button type="button" class="btn ft-blog-filter-btn active" data-blog-filter="all">All</button>
                            <button type="button" class="btn ft-blog-filter-btn" data-blog-filter="laikipia">Nanyuki &amp; Laikipia</button>
                            <button type="button" class="btn ft-blog-filter-btn" data-blog-filter="technology">Technology</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-4" id="ftBlogGrid">
${nanyukiCards}
${techCards}
            </div>
        </div>`;

  const indexHtml = shell(
    "Blog | Fraittech Kenya",
    "Guides on Nanyuki, Laikipia travel, and technology for Kenyan businesses.",
    "blog/",
    indexBody,
    "website",
    "active"
  );
  fs.writeFileSync(path.join(BLOG, "/"), indexHtml, "utf8");
  console.log("Wrote blog pages to", BLOG);
}

main();
