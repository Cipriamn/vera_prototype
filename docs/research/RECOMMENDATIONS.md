# Vera Website Builder: Strategic Recommendations

**Prepared by:** Product Strategy Team
**Date:** 2026-04-22
**Status:** Final Synthesis

---

## 1. EXECUTIVE SUMMARY

### Top 10 Components Vera MUST Have at Launch

Based on competitor analysis and technical feasibility, these are non-negotiable for MVP:

| Priority | Component | Why Essential | Complexity |
|:--------:|-----------|---------------|:----------:|
| 1 | **Text Block** | Foundation of all content | 1 |
| 2 | **Heading (H1-H6)** | SEO and content hierarchy | 1 |
| 3 | **Image** | Visual content is expected | 2 |
| 4 | **Button/CTA** | Drives user actions | 1 |
| 5 | **Header/Navigation** | Every site needs navigation | 2 |
| 6 | **Footer** | Contact, links, branding | 2 |
| 7 | **Hero Section** | First impression, brand impact | 2 |
| 8 | **Contact Form** | Lead capture, communication | 3 |
| 9 | **Social Links** | Cross-platform presence | 1 |
| 10 | **Divider/Spacer** | Layout control | 1 |

**Total MVP Development Time:** ~4-6 weeks

### Key Differentiators vs Competitors

| Differentiator | Gap in Market | Vera Opportunity |
|----------------|---------------|------------------|
| **AI-Assisted Content** | No Dutch competitor offers this | Generate event descriptions, committee intros with context |
| **Modern Visual Design** | Congressus/Genkgo prioritize function over design | Webflow-level control with association templates |
| **Mobile-First Editor** | Desktop-centric competitors | True mobile editing experience |
| **Real-Time Collaboration** | No live multi-user editing in NL | Figma-style committee collaboration |
| **Template Variety** | Limited vertical-specific templates | Deep libraries for student housing, sports, cultural orgs |

---

## 2. COMPONENT PRIORITY MATRIX

### P0 (MVP) - Absolute Must-Haves

Launch-blocking components. Cannot ship without these.

| Component | Complexity | Est. Dev Time | Tech Stack |
|-----------|:----------:|:-------------:|------------|
| Text Block | 1 | 2 days | Tiptap/Slate.js |
| Heading | 1 | 1 day | HTML + CSS variables |
| Image | 2 | 3 days | Next.js Image + CDN |
| Button/CTA | 1 | 1 day | React component |
| Divider/Spacer | 1 | 0.5 days | CSS |
| Social Links | 1 | 1 day | Lucide icons |
| Header/Navigation | 2 | 4 days | Flexbox + dropdown |
| Footer | 2 | 2 days | Grid layout |
| Hero Section | 2 | 3 days | CSS Grid + overlay |
| Contact Form | 3 | 5 days | React Hook Form + Resend |

**P0 Total: ~22 days (4-5 weeks with buffer)**

---

### P1 (Fast-Follow) - Add Within 1 Month Post-Launch

Critical for association use cases. Retention-critical features.

| Component | Complexity | Est. Dev Time | Tech Stack |
|-----------|:----------:|:-------------:|------------|
| Photo Gallery | 3 | 5 days | PhotoSwipe + lazy load |
| Event Card/List | 3 | 7 days | Date-fns + API |
| News Feed/Blog | 3 | 7 days | Markdown CMS |
| Stats Counter | 2 | 2 days | Framer Motion + IntersectionObserver |
| Sponsor Logo Grid | 2 | 2 days | Image grid |
| Video Embed | 2 | 2 days | oEmbed iframe |
| Map Embed | 2 | 1 day | Google Maps iframe |
| Announcement Banner | 2 | 2 days | Fixed position + localStorage |

**P1 Total: ~28 days (5-6 weeks)**

---

### P2 (Nice-to-Have) - Future Roadmap

Differentiation features. Build after proving core value.

| Component | Complexity | Est. Dev Time | Tech Stack |
|-----------|:----------:|:-------------:|------------|
| Member Login Widget | 4 | 10 days | Better Auth / Clerk |
| Committee/Team Cards | 3 | 5 days | User profiles |
| Event Calendar | 4 | 10 days | FullCalendar + rrule.js |
| Registration Form | 4 | 8 days | Multi-step + validation |
| Member Directory | 4 | 10 days | Search + pagination |
| Newsletter Signup | 3 | 4 days | Mailchimp/ConvertKit API |
| Instagram Feed | 4 | 5 days | EmbedSocial widget |
| Payment Gateway | 5 | 15 days | Mollie integration |
| Ticket Sales | 5 | 20 days | E-commerce + QR |
| Webshop Products | 5 | 25 days | Full e-commerce |

**P2 Total: ~112 days (4-5 months)**

---

## 3. TECHNICAL STACK RECOMMENDATION

### Drag-and-Drop Framework

| Option | Recommendation | Rationale |
|--------|:--------------:|-----------|
| **Craft.js** | **RECOMMENDED** | React-native, component-based, TypeScript support |
| GrapesJS | Alternative | More features but not React-native |
| @dnd-kit + Custom | Future | Maximum flexibility for custom needs |

**Decision:** Start with **Craft.js** for MVP, migrate to @dnd-kit for custom blocks in Phase 2.

### Domain/DNS Solution

| Approach | Recommendation | Rationale |
|----------|:--------------:|-----------|
| **Cloudflare** | **RECOMMENDED** | Free tier, excellent DNS, Workers for edge logic |
| Vercel | Alternative | Good DX, but more expensive at scale |
| Custom | Avoid | Unnecessary complexity |

**Configuration:**
- Cloudflare DNS for all customer domains
- Wildcard SSL via Cloudflare (free)
- Edge caching for static exports
- Workers for dynamic routing (custom domains → site mapping)

### AI Generation Approach

| Model | Use Case | Cost |
|-------|----------|------|
| **Claude Sonnet** | Content generation (events, descriptions) | ~$3/1M tokens |
| **Claude Haiku** | Quick suggestions, autocomplete | ~$0.25/1M tokens |

**Implementation:**
1. Template-based prompts for association context
2. Streaming responses for better UX
3. Content moderation layer before publish
4. Usage limits per plan tier

### Hosting Recommendation

| Component | Platform | Rationale |
|-----------|----------|-----------|
| **Builder App** | Vercel | Edge functions, great DX |
| **Published Sites** | Cloudflare Pages | Free, fast, unlimited bandwidth |
| **Database** | Supabase | PostgreSQL, auth, realtime |
| **Images** | Cloudflare Images | Optimization, free 100K/month |
| **Email** | Resend | 3K free/month, good DX |

---

## 4. RISK ANALYSIS

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|:-----------:|:------:|------------|
| **Drag-and-drop performance on complex pages** | Medium | High | Virtual rendering, component chunking, performance budget |
| **Mobile editor UX complexity** | High | Medium | Progressive disclosure, desktop-first MVP with mobile view-only |
| **Third-party embed instability (Instagram API)** | High | Low | Use widget services (EmbedSocial), not direct API |
| **Form spam/abuse** | Medium | Medium | hCaptcha, rate limiting, email verification |
| **Image storage costs at scale** | Low | Medium | Cloudflare Images with compression, storage limits per plan |

### Competitive Risks

| Risk | Probability | Impact | Mitigation |
|------|:-----------:|:------:|------------|
| **Congressus improves their builder** | Medium | High | Move fast, focus on design differentiation |
| **International player enters Dutch market** | Low | High | Deep localization, iDeal integration, Dutch support |
| **Price war** | Medium | Medium | Focus on value (AI, templates), not price |
| **Associations stay with manual WordPress** | High | Medium | Migration tools, onboarding support, ROI calculator |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|:-----------:|:------:|------------|
| **Slow adoption by associations** | Medium | High | Free tier, pilot program with 10 associations |
| **Feature creep delays MVP** | High | High | Strict P0 discipline, weekly scope reviews |
| **Support burden** | Medium | Medium | Self-service docs, video tutorials, community forum |

---

## 5. NEXT STEPS

### Recommended Implementation Order

```
Week 1-2: Foundation
├── Set up Craft.js framework
├── Create component architecture
├── Implement Text Block + Heading
└── Set up CI/CD pipeline

Week 3-4: Core Content
├── Image component + CDN integration
├── Button/CTA component
├── Divider/Spacer
└── Social Links

Week 5-6: Layout & Navigation
├── Header/Navigation (mobile hamburger)
├── Footer component
├── Hero Section
└── Basic template system

Week 7-8: Forms & Polish
├── Contact Form + email integration
├── Form validation + CAPTCHA
├── MVP polish + bug fixes
└── Beta testing with 3 associations

Week 9-10: P1 Sprint 1
├── Photo Gallery
├── Event Card/List
├── News Feed
└── Stats Counter

Week 11-12: P1 Sprint 2
├── Video Embed
├── Map Embed
├── Sponsor Logo Grid
├── Announcement Banner
└── Launch prep
```

### Estimated Effort Summary

| Phase | Components | Duration | Team Size |
|-------|:----------:|:--------:|:---------:|
| **P0 MVP** | 10 | 8 weeks | 2 devs |
| **P1 Fast-Follow** | 8 | 4 weeks | 2 devs |
| **P2 Roadmap** | 10 | 16 weeks | 2-3 devs |

### Critical Success Metrics

| Metric | Target (6 months) | Measurement |
|--------|:-----------------:|-------------|
| Associations using builder | 50 | Active sites |
| Pages created | 500 | Database count |
| Average build time | < 30 min | Analytics |
| NPS score | > 40 | Survey |
| Support tickets per user | < 2/month | Help desk |

---

## Appendix: Decision Log

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| DnD Framework | GrapesJS, Craft.js, @dnd-kit | Craft.js | React-native, good TypeScript |
| Auth Provider | Clerk, Auth.js, Better Auth | Better Auth | Full control, self-hosted |
| Payment Provider | Stripe, Mollie, Adyen | Mollie | Best iDeal support for NL |
| Email Service | SendGrid, Resend, Postmark | Resend | Modern API, good free tier |
| Hosting | Vercel, Netlify, Cloudflare | Hybrid | Vercel (app) + Cloudflare (sites) |

---

*Document generated as part of Vera prototype research phase.*
