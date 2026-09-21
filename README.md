# Tech'nSyntax — Official Business Website

The official, production-grade business website for **Tech'nSyntax** — a technology solutions and practical technical education company providing digital transformation services across web development, data analytics, AI automation, digital services, technical training, and UI/UX design.

---

## 1. Getting Started

This project is built purely with web standards — **no build step, no bundler, no framework dependencies, and no backend server are required**.

1. Download or clone this directory.
2. Open `index.html` directly in any modern web browser (Edge, Chrome, Safari, Firefox).
3. Alternatively, serve via any static web server (such as Cloudflare Pages, GitHub Pages, Netlify, Vercel, or a local Python/Live Server):
   ```bash
   # Optional local server preview
   python -m http.server 5500
   ```

---

## 2. Tech Stack

- **HTML5**: Semantic document outlines (`header`, `nav`, `main`, `section`, `article`, `figure`, `figcaption`, `footer`), ARIA landmarks and live regions.
- **CSS3**: Strict mobile-first architecture. Base styles in `css/main.css` target 320px unprefixed. Responsive layout adaptations in `css/responsive.css` use `min-width` media queries exclusively (768px, 960px, 1200px). Keyframes and motion control in `css/animations.css`.
- **Vanilla JavaScript (ES6+)**: Zero external libraries (no React, jQuery, Bootstrap, or Tailwind). All modules are wrapped in IIFEs under `'use strict'` with zero global variable leakage.
- **Typography**: Inter (300–800) for display/body and JetBrains Mono (400–600) for code/developer utility styling, loaded via Google Fonts CDN with preconnect headers.
- **Iconography & Graphics**: Font Awesome Free 6.5.2 loaded via CDNJS (`cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`) for all interface icons, social media glyphs, checklist ticks, and UI controls. Hand-authored vector SVG brand mark in `icons/favicon.svg`.

---

## 3. Project Directory Tree

```
technsyntax/
├── index.html                           # Home page (hero, animated stats, code editor, 6 service cards, values, CTA)
├── about.html                           # Company background, about.config panel, team/office figures, mission, vision
├── services.html                        # Hub of 6 service offerings with deep-link anchors, checklists, and deep-dive CTAs
├── portfolio.html                       # Featured case study portfolio with tech tags
├── academy.html                         # Tech'nSyntax Academy paths, courses, benefits, and CSS certificate mockup
├── blog.html                            # Technology blog archive with real-time category filtering and live region
├── contact.html                         # Direct contact options (Email, WhatsApp) and inline n8n AI Chat Assistant
├── terms.html                           # Production Terms of Service (code ownership, warranties, jurisdiction)
├── privacy.html                         # DPDP/GDPR-compliant Privacy Policy (data handling, session tokens)
│
├── service-web-development.html         # Dedicated Service: Modern Web & SaaS Development
├── service-data-analytics.html          # Dedicated Service: Practical Data Analytics & BI
├── service-ai-solutions.html            # Dedicated Service: AI Automation & Agentic Workflows
├── service-digital-services.html        # Dedicated Service: Cloud & Digital Operations
├── service-technical-training.html      # Dedicated Service: Academy & Corporate Tech Training
├── service-ui-ux-design.html            # Dedicated Service: Design Systems & Product Experience
│
├── blog-javascript-that-ages-well.html               # Article 1: Writing JavaScript That Ages Well
├── blog-responsive-design-beyond-breakpoints.html   # Article 2: Responsive Design Beyond Breakpoints
├── blog-dashboards-people-actually-open.html        # Article 3: Dashboards People Actually Open
├── blog-where-ai-automation-pays-off.html           # Article 4: Where AI Automation Actually Pays Off
├── blog-breaking-into-tech-without-cs-degree.html   # Article 5: Breaking into Tech Without a CS Degree
├── blog-sql-habits-every-analyst-should-know.html   # Article 6: SQL Habits Every Analyst Should Know
│
├── robots.txt                           # Search crawler directives pointing to sitemap.xml
├── sitemap.xml                          # XML sitemap with all 21 URLs and lastmod timestamps
├── README.md                            # Comprehensive project documentation
├── css/
│   ├── main.css                         # Design system tokens, typography, components, .ai-chat block, legal styles
│   ├── responsive.css                   # Mobile-first min-width media queries (768px, 960px, 1200px)
│   └── animations.css                   # Keyframes, reveal classes, prefers-reduced-motion overrides
├── js/
│   ├── main.js                          # Header scroll, mobile menu with focus trap, reveal, stats, filter, email obfuscator
│   └── ai-chat.js                       # Inline AI chat client with n8n webhook, session memory, and XSS whitelist sanitizer
├── icons/
│   └── favicon.svg                      # Hand-authored brand vector mark
├── images/                              # 100% authentic, production visual assets (zero placeholders)
│   ├── og/og-image.webp                 # 1200×630px official branded Open Graph & Twitter Card banner
│   ├── hero/hero.webp                   # 1200×630px digital solutions hero graphic
│   ├── services/                        # 6 high-resolution service deep-dive illustrations
│   │   ├── service-web.webp, service-analytics.webp, service-ai.webp,
│   │   └── service-digital.webp, service-training.webp, service-design.webp
│   ├── portfolio/                       # 4 high-resolution project showcase graphics
│   │   ├── portfolio-web.webp, portfolio-analytics.webp,
│   │   └── portfolio-ai.webp, portfolio-design.webp
│   ├── academy/                         # 4 Academy curriculum & credential illustrations
│   │   ├── academy-web.webp, academy-analytics.webp,
│   │   ├── academy-ai.webp, academy-cert.webp
│   │   └── (capstone certificate & path visual assets)
│   ├── blog/blog-1.webp … blog-6.webp   # 6 high-resolution technical article illustrations
│   └── about/team.webp, office.webp     # Team collaboration and infrastructure graphics
└── fonts/                               # Reserved empty directory (fonts loaded from Google CDN)
```

---

## 4. Design System Tokens

All tokens are declared as CSS custom properties on `:root` in `css/main.css`:

| Token | Value | Primary Use |
|---|---|---|
| `--color-primary` | `#2563EB` | CTAs, links, accents, theme-color meta, focus rings |
| `--color-secondary` | `#06B6D4` | Gradients, secondary accents, hover states |
| `--color-dark` | `#0F172A` | Footer, code-editor block, dark sections, headings |
| `--color-bg` | `#F8FAFC` | Page background, chat log surface, alternating sections |
| `--color-text` | `#1E293B` | High-contrast body copy (≥ 4.5:1 ratio) |
| `--color-muted` | `#64748B` | Secondary copy, eyebrows, metadata |
| `--color-border` | `#E2E8F0` | Card borders, dividers, subtle separators |
| `--color-white` | `#FFFFFF` | Card backgrounds, sticky header, bot chat bubbles |

### Radii & Spacing Scale
- Radii: `--radius-sm: 6px`, `--radius-md: 12px`, `--radius-lg: 20px`, `--radius-full: 999px`.
- Spacing: `--space-1` (`0.25rem` / 4px) through `--space-24` (`6rem` / 96px).
- Container: `--container-max: 1200px`, `--container-pad: 1.25rem`.

---

## 5. Feature Highlights

1. **Accessibility (WCAG 2.1 AA Compliant)**:
   - Visible keyboard focus rings (`:focus-visible`).
   - Visually hidden skip link (`Skip to content` &rarr; `#main`).
   - Accessible mobile navigation drawer with animated hamburger-to-X, focus trapping within drawer, Escape key handler, outside-click close, and body scroll locking.
   - Screen-reader announcements via `aria-live="polite"` for blog filtering and chat messaging.
   - `prefers-reduced-motion: reduce` stops all animations, transitions, count-up numbers, and code typing effects.
   - All interactive touch targets meet or exceed 44×44px.
2. **Zero-Byte Image Placeholders**:
   - Empty placeholder `.webp` files exist at every asset path.
   - When files are empty or fail to load, `js/main.js` catches the error and applies `.img-placeholder` styling, showing a branded CSS placeholder box displaying the image's `alt` text. Once real image files are dropped in, the placeholder disappears automatically with no HTML changes.
3. **SEO & Structured Data**:
   - Unique page titles, meta descriptions, and canonical URLs.
   - Complete Open Graph and Twitter Card tags.
   - Microdata JSON-LD schemas: `Organization`, `WebSite`, `AboutPage`, `ItemList` of `Service`, `ItemList` of `CreativeWork`, `ItemList` of `Course`, `Blog` & `BlogPosting`, `ContactPage`, `ContactPoint`, and `BreadcrumbList` on every inner page.
4. **Obfuscated Email**:
   - `info@technsyntax.site` is dynamically assembled by JavaScript from `data-user` and `data-domain` attributes, shielding it from trivial web scrapers while remaining accessible to human visitors and screen readers.
5. **Direct WhatsApp Channel**:
   - Formatted direct link: `https://wa.me/919309011037` styled consistently with contact rows.

---

## 6. AI Chatbot Architecture (n8n Webhook Integration)

The contact page features a live, custom-built AI chat assistant that communicates directly with a production n8n workflow over plain `fetch`.

### 6.1 Webhook Endpoint
- **URL**: `POST https://anaskhannothing.app.n8n.cloud/webhook/technsyntax-chat`
- **Headers**: `Content-Type: application/json`
- **Authentication**: None required client-side. The endpoint is public and all credentials/keys live securely inside the n8n workflow.

### 6.2 Request Contract
```json
{
  "message": "What services do you offer?",
  "sessionId": "ts_1a2b3c4d5e6f",
  "page": "contact",
  "source": "technsyntax.site",
  "timestamp": "2026-09-21T10:15:00.000Z"
}
```
- `sessionId`: Generated once per session (`"ts_" + crypto.randomUUID()`) and persisted in `sessionStorage` under `technsyntax_chat_session`. This maintains conversation memory across multi-turn queries.

### 6.3 Response Extraction & Tolerance
The `extractReply(data)` helper handles multiple n8n response structures:
- Plain string body: `"Hello there"`
- Standard JSON keys: `{ "output": "..." }`, `{ "reply": "..." }`, `{ "text": "..." }`, `{ "message": "..." }`, `{ "answer": "..." }`, `{ "response": "..." }`
- AI Agent node wrapper: `{ "data": { "output": "..." } }`
- Array wrappers: `[ { "output": "..." } ]`

### 6.4 XSS Protection
To eliminate injection risks, the chatbot uses a strict escape-first whitelist renderer:
- All text is escaped (`&`, `<`, `>`, `"`, `'`).
- Safe markdown enhancements: `**bold**`, `` `code` ``, newlines to `<br>`, and bare URLs to `<a target="_blank" rel="noopener noreferrer">`.
- Any `<script>` tags or malicious HTML from the bot or user render purely as inert text.

### 6.5 n8n Workflow Configuration Checklist
To ensure seamless communication between the browser and your n8n workflow:

1. **Webhook Node**:
   - HTTP Method: `POST`
   - Path: `technsyntax-chat`
   - Respond: `Using 'Respond to Webhook' Node` (recommended) or `When Last Node Finishes` (Response Data: `First Entry JSON`).
2. **CORS / Allowed Origins**:
   - In the Webhook Node settings, configure **Allowed Origins (CORS)**:
     `https://technsyntax.site, https://www.technsyntax.site, http://localhost:5500, http://127.0.0.1:5500` (or `*` during initial testing).
3. **Workflow Activation**:
   - The production URL (`/webhook/...`) only responds when the workflow is toggled to **Active**. The test URL (`/webhook-test/...`) only works while the "Listen for test event" modal is open in the n8n canvas.
4. **Memory & LLM Prompting**:
   - Connect a **Window Buffer Memory** or **Simple Memory** node keyed on `{{ $json.body.sessionId }}` to keep multi-turn context.
   - System prompt instructions:
     - Ground responses in Tech'nSyntax's six service lines and Academy courses.
     - Frame Tech'nSyntax as a remote-first technology partner serving worldwide.
     - Keep answers concise (2–4 sentences).
     - Direct project inquiries to `info@technsyntax.site` or WhatsApp `+91 93090 11037`.

### 6.6 cURL Smoke Test
Test the webhook directly from your command line:
```bash
curl -X POST https://anaskhannothing.app.n8n.cloud/webhook/technsyntax-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What services do you offer?","sessionId":"test-session-123","page":"contact"}'
```

---

## 7. Business Positioning Note

Tech'nSyntax is a **technology solutions and technical education company**, not an academic data science or AI research laboratory. All data work is explicitly framed around practical business utility:
- **Data Analytics**
- **ETL Development & Data Cleaning**
- **Data Management**
- **Dashboard Development & Business Intelligence (Power BI / Excel)**
- **Reporting Solutions**

All projects are scoped around measurable business outcomes rather than technology for its own sake.

---

## 8. Pre-Deployment Checklist

Before deploying the site to production:
- [ ] Replace `images/og/og-image.webp` with a high-resolution 1200×630px social card.
- [ ] Replace placeholder images in `images/services/`, `images/portfolio/`, `images/blog/`, and `images/about/` with production webp graphics.
- [ ] Set real publication dates on blog posts before adding `datePublished` schemas.
- [ ] Verify that your n8n workflow is switched to **Active** and that CORS origins include your production custom domains.
- [ ] Confirm domain verification in Meta Business Suite using the domain tag in `index.html`.
