# Competitor Analysis: Website Builder Elements for Associations

**Research Date:** 2026-04-22
**Focus:** Dutch association/organization website builders + general website builder best practices
**Target Use Cases:** Student housing, sports teams, events, associations

---

## Competitors Analyzed

### Website Builder Platforms (Identified via watermark/attribution tracing)

| Example Site | Builder Platform | Platform Type |
|--------------|------------------|---------------|
| antibarbari.nl | **VoetbalAssist** | Sports club SaaS (350+ clubs) |
| cedonulli.nl | **Genkgo/Verenigingenweb** | Association SaaS (700+ orgs) |
| dizkartes.nl | **Congressus** | Student association SaaS |
| congressus.nl | **Webflow** (marketing site only) | Visual builder |
| genkgo.nl | **Genkgo** (own platform) | Association SaaS |
| verenigingenweb.nl | **Genkgo** | Association SaaS |

### Dutch Association Builder Platforms
1. **Congressus** - Student/general association management + website builder
   - API + webhooks + OAuth for custom integrations
   - Partners with GeK for custom designs
   - Custom CSS support
2. **Genkgo/Verenigingenweb** - Community software for associations, clubs, unions
   - Two paths: Template-based or Custom design
   - Dutch GDPR-compliant hosting
   - 700+ organizations served
3. **VoetbalAssist** - Sports club SaaS (football/rugby focus)
   - KNVB data integration (Dutch Football Association)
   - Real-time match/standings sync via `site-api.voetbalassist.nl`
   - **37 customizable modules** including:
     - ClubWebsite, ClubApp, ClubTV/Narrowcasting, VeldTV (livestreaming)
     - Player Tracking System, sponsorship management, ticket sales
     - Crowdfunding, volunteer management, financial tools
   - Pricing: ~€2/member/year

### Industry Leaders (Reference)
- Wix, Squarespace, Webflow, WildApricot, Mobirise

---

## Feature Matrix: Droppable Elements by Competitor

> **Note:** The columns below represent the **builder platforms** these sites use, not the sites themselves:
> - Congressus (marketing site) uses Webflow; Dizkartes uses Congressus builder
> - Cedo Nulli uses Genkgo/Verenigingenweb
> - Antibarbari uses VoetbalAssist

| Element Category | Congressus | Genkgo | VoetbalAssist | Webflow | Industry Standard |
|-----------------|:----------:|:------:|:-------------:|:-------:|:-----------------:|
| **Content Blocks** |
| Text/Rich Text | ✓ | ✓ | ✓ | ✓ | ✓ |
| Heading Blocks | ✓ | ✓ | ✓ | ✓ | ✓ |
| Image | ✓ | ✓ | ✓ | ✓ | ✓ |
| Video Embed | ✓ | ✓ | ✓ | ✓ | ✓ |
| Photo Gallery | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Navigation** |
| Header/Navbar | ✓ | ✓ | ✓ | ✓ | ✓ |
| Footer | ✓ | ✓ | ✓ | ✓ | ✓ |
| Dropdown Menus | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sidebar Menu | - | - | ✓ | ✓ | ✓ |
| Breadcrumbs | - | - | ✓ | ✓ | ✓ |
| **Hero/Landing** |
| Hero Section | ✓ | ✓ | ✓ | ✓ | ✓ |
| CTA Buttons | ✓ | ✓ | ✓ | ✓ | ✓ |
| Banner/Announcement | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Statistics/Social Proof** |
| Stats Counter | - | - | ✓ | ✓ | ✓ |
| Member Count Display | ✓ | ✓ | ✓ | - | ✓ |
| Testimonials | - | ✓ | - | ✓ | ✓ |
| **Member Features** |
| Member Login | ✓ | ✓ | ✓ | - | ✓ |
| Member Portal | ✓ | ✓ | ✓ | - | ✓ |
| Member Directory | ✓ | ✓ | ✓ | - | ✓ |
| Profile Cards | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Events** |
| Event List/Grid | ✓ | ✓ | ✓ | - | ✓ |
| Event Calendar | ✓ | ✓ | ✓ | - | ✓ |
| Event Registration | ✓ | ✓ | ✓ | - | ✓ |
| Ticket Sales | ✓ | ✓ | ✓ | - | ✓ |
| **Content Feeds** |
| News/Blog Section | ✓ | ✓ | ✓ | ✓ | ✓ |
| Instagram Feed | - | - | ✓ | ✓ | ✓ |
| Social Media Links | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Forms** |
| Contact Form | ✓ | ✓ | ✓ | ✓ | ✓ |
| Registration Form | ✓ | ✓ | ✓ | ✓ | ✓ |
| Survey/Feedback | ✓ | ✓ | ✓ | - | ✓ |
| Poll Widget | - | - | ✓ | - | ✓ |
| **Commerce** |
| Webshop | ✓ | ✓ | ✓ | ✓ | ✓ |
| Payment Integration | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sponsor Logos | ✓ | ✓ | ✓ | ✓ | ✓ |
| Crowdfunding Widget | - | - | ✓ | - | - |
| **Organization** |
| Committee/Team Listings | ✓ | ✓ | ✓ | - | - |
| Group Pages | ✓ | ✓ | ✓ | - | - |
| Office Hours/Status | - | - | - | - | - |
| Vacancy Listings | - | ✓ | ✓ | - | ✓ |
| **Communication** |
| Newsletter Signup | ✓ | ✓ | ✓ | ✓ | ✓ |
| SMS Integration | ✓ | - | - | - | - |
| Forum/Discussion | - | ✓ | ✓ | - | ✓ |
| **Sports-Specific (VoetbalAssist)** |
| Match Details Widget | - | - | ✓ | - | - |
| Live Match Feed | - | - | ✓ | - | - |
| Team Lineup/Formation | - | - | ✓ | - | - |
| Top Scorers List | - | - | ✓ | - | - |
| Tournament Bracket | - | - | ✓ | - | - |
| Training Schedule | - | - | ✓ | - | - |

---

## Droppable Elements: Prioritized List by Feasibility

### Tier 1: Essential Elements (Must Have - Simple Implementation)
These are standard components with well-established patterns.

| # | Element | Description | Observed In |
|---|---------|-------------|-------------|
| 1 | **Text Block** | Rich text editor with formatting | All 6 sites |
| 2 | **Heading** | H1-H6 with styling options | All 6 sites |
| 3 | **Image** | Single image with alt text, sizing | All 6 sites |
| 4 | **Button/CTA** | Clickable button with link | All 6 sites |
| 5 | **Divider/Spacer** | Visual separation between sections | All 6 sites |
| 6 | **Social Links** | Icons linking to social profiles | All 6 sites |
| 7 | **Header/Navigation** | Logo + nav links + login | All 6 sites |
| 8 | **Footer** | Contact info, links, copyright | All 6 sites |

### Tier 2: Core Association Elements (Must Have - Moderate Complexity)
Critical for association websites; require some state management.

| # | Element | Description | Observed In |
|---|---------|-------------|-------------|
| 9 | **Hero Section** | Large banner with text overlay + CTA | Dizkartes, Cedo Nulli |
| 10 | **Photo Gallery** | Grid of images with lightbox | Congressus, Cedo Nulli |
| 11 | **Event Card/List** | Upcoming events with dates, registration | Cedo Nulli, Congressus |
| 12 | **News Feed** | Blog posts with dates, excerpts | Dizkartes, Cedo Nulli |
| 13 | **Contact Form** | Name, email, message fields | Cedo Nulli, Dizkartes |
| 14 | **Stats Counter** | Animated number display | Cedo Nulli, Dizkartes |
| 15 | **Sponsor/Partner Logos** | Logo grid with links | Antibarbari, Dizkartes |
| 16 | **Announcement Banner** | Dismissible alert/promo bar | Cedo Nulli |

### Tier 3: Member & Organization Features (Should Have - Higher Complexity)
Requires user authentication and database integration.

| # | Element | Description | Observed In |
|---|---------|-------------|-------------|
| 17 | **Member Login Widget** | Login form with forgot password | All 6 sites |
| 18 | **Committee/Team Cards** | Group info with members | All 6 sites |
| 19 | **Member Directory** | Searchable list with photos | Congressus, Genkgo |
| 20 | **Event Calendar** | Monthly view with events | Congressus, Genkgo |
| 21 | **Registration Form** | Custom fields, membership signup | All 6 sites |
| 22 | **Video Embed** | YouTube/Vimeo player | Congressus |
| 23 | **Map/Location** | Google Maps embed | Dizkartes |

### Tier 4: Advanced Features (Nice to Have - Complex Implementation)
Requires significant backend logic or third-party integrations.

| # | Element | Description | Observed In |
|---|---------|-------------|-------------|
| 24 | **Instagram Feed** | Live social media integration | Cedo Nulli |
| 25 | **Ticket Sales Widget** | E-commerce with QR codes | Congressus, Genkgo |
| 26 | **Payment Gateway** | iDeal, card processing | Congressus, Genkgo |
| 27 | **Webshop Product Grid** | Products with variants | Congressus |
| 28 | **Newsletter Signup** | Email collection + integration | Congressus, Genkgo |
| 29 | **Member Portal Link** | SSO to member area | Congressus, Genkgo |
| 30 | **Office Status Widget** | Open/closed indicator | Cedo Nulli |
| 31 | **Attendance/Bar Duty** | Scheduling widget | Antibarbari (VoetbalAssist) |
| 32 | **Match Details Widget** | Reports, photos, scorers, cards | VoetbalAssist |
| 33 | **Live Match Feed** | Liveblog with real-time updates | VoetbalAssist |
| 34 | **Team Lineup/Formation** | Visual formation display | VoetbalAssist |
| 35 | **Top Scorers List** | Player statistics display | VoetbalAssist |
| 36 | **Crowdfunding Goal** | Progress tracker for fundraising | VoetbalAssist |
| 37 | **Tournament Bracket** | Bracket/knockout visualization | VoetbalAssist |
| 38 | **Vacancy Listing** | Job/volunteer positions with QR | VoetbalAssist |
| 39 | **Poll/Survey Widget** | Interactive voting element | VoetbalAssist |
| 40 | **Birthday Display** | GDPR-compliant member birthdays | VoetbalAssist |
| 41 | **Buy/Sell Classifieds** | Marketplace section | VoetbalAssist |

---

## Gaps in the Market Vera Could Exploit

### 1. Modern Visual Design Tools
- **Gap:** Dutch platforms (Congressus, Genkgo) focus on functionality over design flexibility
- **Opportunity:** Offer Webflow-level visual control with association-specific templates

### 2. Mobile-First Builder Interface
- **Gap:** Most competitors have desktop-centric editors
- **Opportunity:** True mobile-first editing experience

### 3. AI-Assisted Content Creation
- **Gap:** No competitors offer AI content generation for associations
- **Opportunity:** AI that understands association context (event descriptions, committee intros)

### 4. Real-Time Collaboration
- **Gap:** No live multi-user editing in Dutch market
- **Opportunity:** Figma-style collaboration for committee members

### 5. Template Variety for Specific Verticals
- **Gap:** Limited templates for:
  - Student housing
  - Sports teams (beyond football)
  - Cultural associations
  - Alumni networks
- **Opportunity:** Deep template library for each vertical

### 6. Component Marketplace
- **Gap:** Closed ecosystems; no third-party components
- **Opportunity:** Allow community-built components

### 7. Simplified Member Management
- **Gap:** Member features require separate complex software
- **Opportunity:** Built-in lightweight member management

---

## Template Categories That Resonate with Target Users

Based on analysis of association needs:

### Student Associations
- Introduction/KEI week landing pages
- Committee recruitment pages
- Event promotion (parties, galas)
- Study materials/resources section

### Sports Teams/Clubs
- Team roster pages
- Match schedules/results
- Training schedule
- Bar duty/volunteer scheduling
- Sponsor showcase

### Housing Associations
- Resident portal
- Maintenance request forms
- Community announcements
- Common space booking

### Cultural/Professional Associations
- Speaker/guest profiles
- Conference/event programs
- Resource library
- Job board/career section

### Alumni Networks
- Reunion event pages
- Member search/directory
- Donation/fundraising
- Success stories/testimonials

---

## Recommended MVP Element Set for Vera

Based on frequency across competitors and feasibility:

### Phase 1 (Launch)
1. Text Block
2. Heading
3. Image
4. Button
5. Divider/Spacer
6. Header with Navigation
7. Footer
8. Hero Section
9. Contact Form
10. Social Links

### Phase 2 (Growth)
11. Photo Gallery
12. Event Card/List
13. News Feed
14. Stats Counter
15. Sponsor Logo Grid
16. Video Embed
17. Map Embed

### Phase 3 (Differentiation)
18. Member Login Widget
19. Committee/Team Cards
20. Event Calendar
21. Registration Form
22. Member Directory
23. Announcement Banner

### Phase 4 (Advanced)
24. Payment Integration
25. Ticket Sales
26. Newsletter Signup
27. Social Feed Integration
28. Webshop Components

---

## Sources

### Builder Platforms (Primary Research)
- https://www.congressus.nl - Association management platform
- https://www.congressus.nl/verenigingswebsite - Website builder features
- https://support.congressus.nl/nl/articles/2781235-introductie-congressus-api - API documentation
- https://www.genkgo.nl/en - Community management platform
- https://verenigingenweb.nl/nl - Template vs custom design options
- https://www.voetbalassist.nl - Sports club platform (VoetbalAssist)
- https://www.voetbalassist.nl/faq/ - KNVB Dataservice API details

### Example Sites Analyzed (for element identification)
- https://www.cedonulli.nl (built on Genkgo/Verenigingenweb)
- https://www.antibarbari.nl (built on VoetbalAssist)
- https://www.dizkartes.nl/home (built on Congressus)

### Industry Reference
- Wix.com drag-and-drop documentation
- Squarespace, Webflow comparison articles (2024-2026)
- WildApricot association website best practices
