# Technical Feasibility Analysis: Drag-and-Drop Website Builder Elements

**Research Date:** 2026-04-22
**Agent:** Tech Researcher

---

## Identified Website Builder Platforms

Based on tracing watermarks/attributions from the example sites:

| Example Site | Builder Platform | Platform Type |
|--------------|------------------|---------------|
| antibarbari.nl | **VoetbalAssist** | Sports club SaaS |
| cedonulli.nl | **Genkgo/Verenigingenweb** | Association SaaS |
| dizkartes.nl | **Congressus** | Association SaaS |
| congressus.nl | **Webflow** (their marketing site) | Visual builder |
| genkgo.nl | **Genkgo** (own platform) | Association SaaS |
| verenigingenweb.nl | **Genkgo** | Association SaaS |

---

## Element Feasibility Tiers

### Tier 1: Simple (Low Complexity) - 1-2 weeks each

| Element | Implementation Notes | Data Storage | Third-Party Required |
|---------|---------------------|--------------|---------------------|
| **Text Block** | Rich text editor (TipTap/Slate), WYSIWYG | JSON/HTML blob | No |
| **Heading** | H1-H6 with styling options | Simple string + level | No |
| **Image** | Upload + CDN, alt text, sizing | URL + metadata | CDN (Cloudflare/S3) |
| **Button** | Link/action, style variants | URL + label + style | No |
| **Divider/Spacer** | Pure CSS, height config | Height value | No |
| **Icon** | Icon library picker | Icon ID + size | No |
| **Quote/Blockquote** | Styled text variant | Text + attribution | No |

**Technical Considerations:**
- Use contenteditable or dedicated editor libraries
- Responsive handling via CSS container queries
- Image optimization pipeline needed (Sharp/Cloudinary)

---

### Tier 2: Moderate (Medium Complexity) - 2-4 weeks each

| Element | Implementation Notes | Data Storage | Third-Party Required |
|---------|---------------------|--------------|---------------------|
| **Image Gallery** | Grid layout, lightbox, lazy loading | Array of image refs | Lightbox lib |
| **Video Embed** | YouTube/Vimeo iframe wrapper | URL + provider | YouTube/Vimeo API |
| **Contact Form** | Field builder, validation, submission | Form schema JSON | Email service |
| **Accordion/FAQ** | Collapsible sections | Array of Q&A pairs | No |
| **Tabs** | Tabbed content container | Array of tab content | No |
| **Cards/Grid** | Repeatable card layout | Array of card data | No |
| **Social Links** | Icon + URL pairs | Array of social refs | No |
| **Map** | Embedded Google/Mapbox | Coordinates + zoom | Google Maps/Mapbox |
| **Slider/Carousel** | Image/content rotation | Array + config | Swiper.js/Embla |
| **Navigation Menu** | Page links, dropdowns | Tree structure | No |
| **Footer** | Multi-column layout | Nested content | No |

**Technical Considerations:**
- Form submissions need backend endpoint + spam protection (reCAPTCHA)
- Video embeds require iframe sandboxing for security
- Maps need API key management per customer
- Carousels need touch/swipe handling for mobile

---

### Tier 3: Complex (High Complexity) - 4-8 weeks each

| Element | Implementation Notes | Data Storage | Third-Party Required |
|---------|---------------------|--------------|---------------------|
| **Blog/News Feed** | CMS-like, pagination, categories | Posts collection | No |
| **Event Calendar** | Date picker, registration, tickets | Events collection | Payment gateway |
| **Member Directory** | List/search, privacy controls | Members collection | Auth system |
| **E-commerce/Shop** | Products, cart, checkout | Products + orders | Stripe/Mollie |
| **File Downloads** | Upload, access control | Files + permissions | Storage (S3) |
| **Newsletter Signup** | Email capture, double opt-in | Subscribers list | Email service (Resend) |
| **Comments/Guestbook** | Moderation, spam filter | Comments collection | No |
| **Search** | Full-text search across content | Search index | Algolia/Meilisearch |
| **Login/Member Area** | Auth, sessions, protected content | Users + sessions | Auth provider |
| **Multi-language** | Content variants, language switcher | Content per locale | No |

**Technical Considerations:**
- E-commerce requires PCI compliance considerations
- Member areas need robust authentication (consider Better Auth/Auth.js)
- Search requires indexing pipeline and query optimization
- Events with payments need webhook handling for payment confirmation

---

### Tier 4: Advanced Integrations (8+ weeks)

| Element | Implementation Notes | Third-Party Required |
|---------|---------------------|---------------------|
| **Live Chat** | Real-time messaging | Intercom/Crisp |
| **Booking System** | Calendar + availability | Cal.com/Calendly |
| **Payment Collection** | Invoicing, subscriptions | Stripe/Mollie |
| **CRM Integration** | Sync contacts/members | Salesforce/HubSpot API |
| **Email Campaigns** | Templates, scheduling | Resend/Mailchimp |
| **Analytics Dashboard** | Custom reports | Plausible/PostHog |
| **API Widgets** | External data display | Custom per integration |

---

## Platform-Specific Insights

### VoetbalAssist (Sports Clubs)
- **Unique Elements:** Match schedules, standings, team rosters, KNVB data sync
- **API:** Custom `site-api.voetbalassist.nl` for real-time sports data
- **Pricing:** ~€2/member/year

### Congressus (Student Associations)
- **Unique Elements:** Event registration, member administration, photo albums with tagging
- **API:** REST API + webhooks + OAuth for custom integrations
- **Technical:** Custom CSS support, GeK partnership for custom designs

### Genkgo/Verenigingenweb (General Associations)
- **Unique Elements:** Member administration, contribution management, committee tools
- **Hosting:** Dutch-based, GDPR compliant
- **Options:** Template-based or custom design paths

---

## Feasibility Scoring Criteria

For the Synthesizer to use when ranking elements:

| Score | Criteria |
|-------|----------|
| **5** | < 1 week, no third-party, standard HTML/CSS |
| **4** | 1-2 weeks, optional third-party, well-documented patterns |
| **3** | 2-4 weeks, requires third-party API, moderate state management |
| **2** | 4-8 weeks, payment/auth integration, complex data models |
| **1** | 8+ weeks, external service dependency, compliance requirements |

---

## Recommended Tech Stack for Vera

Based on competitor analysis:

### Frontend (Page Builder)
- **Editor Framework:** React + dnd-kit (drag-drop) or craft.js
- **Rich Text:** TipTap (Prosemirror-based)
- **Component Library:** Radix UI + Tailwind

### Backend
- **Framework:** Next.js App Router (SSR for SEO)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (based on project patterns)
- **File Storage:** Cloudflare R2 or S3

### Third-Party Services
- **Payments:** Mollie (Netherlands) or Stripe
- **Email:** Resend
- **Maps:** Mapbox (better pricing than Google)
- **Search:** Meilisearch (self-hosted) or Algolia

---

## Implementation Priority Recommendation

**Phase 1 (MVP):** Tier 1 + Navigation + Contact Form + Footer
**Phase 2:** Gallery, Video, Cards, Accordion
**Phase 3:** Blog, Events, Member Area
**Phase 4:** E-commerce, Integrations

---

*Research completed by Tech Researcher agent for downstream Synthesizer.*
