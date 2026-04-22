# Research Plan: Vera Site Builder Tech Stack Improvement

## Executive Summary

This document outlines the research areas for migrating the Vera Site Builder from its current Express.js/TypeScript backend to a Python-based backend while maintaining/improving all existing functionality.

## Current State Analysis

### Existing Tech Stack
- **Frontend**: React.js + TypeScript + Vite + Tailwind CSS
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **State Management**: Zustand
- **Backend**: Express.js + TypeScript (TO BE REPLACED)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT-based authentication
- **File Upload**: Multer

### Current Backend Capabilities
1. User authentication (register, login, JWT refresh, logout)
2. Site CRUD operations
3. Page management within sites
4. Template system
5. Image upload
6. Public site serving

### Project Requirements from Proposal
1. **Drag-and-Drop Builder** - Visual editor for layouts (text, images, videos, buttons, grids)
2. **Templates** - Pre-built templates (student house, sports team, event, association)
3. **Content Features** - Photo albums, event calendars, forms, blogs, sales pages
4. **Domain Management** - Custom domain purchase and DNS setup
5. **AI Page Generation** - LLM-powered content generation from prompts
6. **Privacy/GDPR** - Privacy-by-design, secure form handling, member-only pages
7. **Standalone Module** - Must integrate with Vera Connect later

---

## Research Areas

### 1. Drag-and-Drop Editor Libraries (DnD Researcher)

**Current Implementation**: Using @dnd-kit for React drag-and-drop

**Research Questions**:
- Should we keep @dnd-kit or evaluate alternatives (GrapesJS, Craft.js, Editor.js)?
- How do these integrate with a Python backend?
- What's the best approach for storing/serving editor state?
- Can GrapesJS provide richer WYSIWYG features out-of-box?
- How to handle responsive design editing across these libraries?

**Deliverables**:
- Comparison matrix of DnD libraries (features, bundle size, learning curve, community)
- Recommendation with justification
- Migration path if switching from @dnd-kit

---

### 2. Python Backend Framework (DnD Researcher - Backend Section)

**Research Questions**:
- FastAPI vs Django vs Flask for this use case?
- ORM selection: SQLAlchemy vs Django ORM vs Tortoise ORM?
- How to replicate current Prisma migrations workflow?
- JWT auth library recommendations for Python (python-jose, PyJWT, Authlib)?
- File upload handling equivalent to Multer?
- WebSocket support for real-time collaboration (if needed)?

**Deliverables**:
- Framework comparison with pros/cons
- Recommended Python backend stack
- Migration strategy from Express.js

---

### 3. Domain Registration & DNS Management (Domain & Hosting Researcher)

**Context**: Proposal requests ability for users to purchase/connect custom domains

**Research Questions**:
- Which domain registrar APIs are best for programmatic domain purchase?
  - Namecheap, GoDaddy, Gandi, Cloudflare Registrar, Google Domains
- DNS provider options (Cloudflare DNS API, AWS Route53, etc.)
- SSL certificate provisioning (Let's Encrypt automation, Cloudflare SSL)
- Cost structure for reselling domains
- How to handle domain verification and ownership transfer?

**Deliverables**:
- Comparison of registrar APIs (pricing, API quality, TLD support)
- DNS provider recommendation
- SSL automation strategy
- Architecture diagram for domain → site routing

---

### 4. Hosting & Deployment (Domain & Hosting Researcher)

**Context**: Need Python-friendly hosting that supports custom domains per user site

**Research Questions**:
- Platform options: Railway, Render, Fly.io, Vercel, AWS, DigitalOcean
- Multi-tenant architecture: How to serve thousands of user sites efficiently?
- Static vs dynamic rendering for published sites?
- CDN integration for performance
- Cost analysis at different scales (100 users vs 1000 vs 10000)
- CI/CD pipeline options for Python deployments

**Deliverables**:
- Hosting platform comparison with pricing tiers
- Recommended architecture for multi-tenant site serving
- CI/CD setup recommendations
- Cost projections

---

### 5. AI-Powered Page Generation (AI & Privacy Researcher)

**Context**: Proposal requests LLM-powered site content generation from prompts

**Research Questions**:
- Which LLM APIs are best suited (OpenAI, Anthropic Claude, Google Gemini)?
- Structured output generation for converting AI response to site components
- Python libraries: LangChain vs LlamaIndex vs direct SDK usage?
- Prompt engineering for site generation (business type, goals, style inputs)
- Cost per generation and rate limiting strategies
- Caching strategies for common templates/components
- Local LLM options (Ollama, llama.cpp) for cost reduction?

**Deliverables**:
- LLM API comparison (capabilities, pricing, response quality)
- Recommended Python framework for LLM integration
- Example prompt structure for site generation
- Cost analysis per user generation

---

### 6. GDPR-Compliant Form & Data Handling (AI & Privacy Researcher)

**Context**: Vera Connect is privacy-focused; sites must handle user data securely

**Research Questions**:
- Form submission storage: encrypted at rest? separate DB?
- Data retention policies and automated deletion
- User consent management (cookie banners, privacy policies)
- Data export/portability for site visitors
- Member-only page authentication strategies
- Audit logging requirements
- Python libraries for encryption, hashing, data anonymization

**Deliverables**:
- GDPR compliance checklist for the site builder
- Recommended data architecture for form submissions
- Privacy-by-design implementation guide
- Member authentication options

---

## Research Timeline

| Phase | Task | Owner | Duration |
|-------|------|-------|----------|
| 1 | Project context distribution | Research Lead | Complete |
| 2 | DnD library research | DnD Researcher | 1-2 days |
| 3 | Python backend research | DnD Researcher | 1-2 days |
| 4 | Domain/DNS API research | Domain & Hosting | 1-2 days |
| 5 | Hosting platform research | Domain & Hosting | 1-2 days |
| 6 | AI integration research | AI & Privacy | 1-2 days |
| 7 | GDPR compliance research | AI & Privacy | 1-2 days |
| 8 | Synthesis & recommendations | Research Lead | 1 day |

---

## Success Criteria

The research phase is complete when we have:
1. ✅ Clear recommendation for Python backend framework
2. ✅ Decision on keeping/replacing @dnd-kit
3. ✅ Selected domain registrar and DNS provider with API integration plan
4. ✅ Hosting platform selected with cost projections
5. ✅ AI integration approach with LLM selection
6. ✅ GDPR compliance strategy documented
7. ✅ Migration path from current Express.js backend

---

## Notes for Downstream Researchers

### For DnD Researcher
Focus on frontend editor experience AND Python backend framework selection. The current @dnd-kit implementation works but may benefit from a more feature-rich solution like GrapesJS. Also research Python backend options since this is a key migration.

### For Domain & Hosting Researcher
The project will serve potentially thousands of user sites with custom domains. Research needs to account for:
- Multi-tenant architecture
- Dynamic domain routing
- Cost at scale
- European hosting for GDPR (Rotterdam-based company)

### For AI & Privacy Researcher
Two distinct areas:
1. **AI**: Site generation from prompts - focus on structured output that maps to our component system
2. **Privacy**: GDPR compliance for form data, user consent, member-only pages

Privacy is core to Vera Connect - this must not be an afterthought.

---

## Questions Requiring Clarification

1. What's the expected user scale at launch vs 1-year growth?
2. Budget constraints for hosting and API costs?
3. Is real-time collaboration (multiple editors) a requirement?
4. Should published sites be static HTML or server-rendered?
5. Integration timeline with Vera Connect main app?

---

## Research Lead Status

**Last Updated**: 2026-04-20 11:48 UTC

### Completed Tasks
- [x] Read and analyzed proposal.md - understood project scope (website builder for Vera Connect)
- [x] Explored project structure - identified monorepo with web/server/shared packages
- [x] Documented current backend (Express.js + Prisma) and migration target (Python)
- [x] Identified key requirements: DnD editor, templates, domain mgmt, AI generation, GDPR
- [x] Formulated research questions for each downstream researcher (see sections above)
- [x] Updated Global Notes with constraints

### Key Findings
1. **Current Stack**: React + TypeScript frontend with @dnd-kit, Express backend with Prisma/PostgreSQL
2. **Migration Scope**: Backend only - frontend stays React
3. **Core Features Needed**:
   - Enhanced DnD builder (consider GrapesJS/Craft.js)
   - Domain registration + DNS automation
   - AI page generation from prompts
   - GDPR-compliant form handling
4. **Python Backend Candidates**: FastAPI (recommended for async), Django, Flask

### Ready for Downstream Researchers
Each researcher has specific questions assigned above. The research plan is COMPLETE.
Waiting for DnD, Domain & Hosting, and AI & Privacy researchers to contribute findings.

### Next Step (Research Lead)
After all researchers complete their sections, I will synthesize into RESEARCH_REPORT.md with final recommendations.

---

## DnD Library Researcher Status

**Last Updated**: 2026-04-20 12:15 UTC
**Status**: ✅ COMPLETE

### Completed Tasks
- [x] Researched DnD libraries: dnd-kit, GrapesJS, Craft.js, Puck, Builder.io, Plasmic
- [x] Researched Python backend frameworks: FastAPI, Django, Flask
- [x] Researched ORMs: SQLAlchemy 2.0 vs Django ORM
- [x] Created comparison matrices for all options
- [x] Documented migration strategy from Express.js to FastAPI
- [x] Wrote comprehensive report: RESEARCH_DND_LIBRARIES.md

### Key Recommendations

**Frontend (DnD Library)**:
- **Primary: Puck** - Ready-to-use UI, AI support built-in, MIT license, uses dnd-kit internally
- Alternative: Keep dnd-kit if maximum customization needed
- Avoid: GrapesJS (too heavy), Builder.io/Plasmic (proprietary)

**Backend (Python)**:
- **Primary: FastAPI + SQLAlchemy 2.0 + Alembic**
- Async-first design critical for AI/LLM integrations
- Pydantic v2 for TypeScript-like type safety
- 7x faster than Flask, better async than Django

**React Native Note**:
- No open-source DnD library supports React Native
- Consider web-based editor with RN app wrapper, or Builder.io for native (proprietary)

### Deliverables
- `RESEARCH_DND_LIBRARIES.md` - Full comparison matrix and recommendations
