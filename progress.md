# DAG Progress

**Run ID**: 9bc23ee7-b255-4634-8f7a-9803230f9627
**Created**: 2026-04-20 11:48 UTC

---

# Quick Summary

- Research alternatives to the current project proposal with a focus on switching the backend to Python
- Research Lead analyzes proposal.md and defines research directions for downstream agents
- DnD Library Researcher investigates Python-compatible D&D library options
- Domain & Hosting Researcher explores hosting solutions suitable for Python backends
- AI & Privacy Researcher evaluates AI integrations and privacy considerations for Python stack

# Plan

- Research Lead reads proposal.md to understand current architecture and requirements
- Research Lead identifies key areas needing alternative research and distributes focus areas
- DnD Library Researcher investigates Python libraries for D&D mechanics/data (depends on Research Lead)
- Domain & Hosting Researcher explores domain registrars and hosting platforms supporting Python backends (depends on Research Lead)
- AI & Privacy Researcher evaluates AI service options and privacy-compliant approaches for Python (depends on Research Lead)

# Global Notes

- **Constraints**: Backend must be changed to Python
- **Unknowns to verify**: Current tech stack in proposal.md; specific features requiring D&D data; AI functionality requirements; hosting/scaling needs

# Agent Checklists

## Research Lead

### Checklist

- [x] Read and analyze proposal.md to understand current project scope
- [x] Identify current backend technology and reasons for Python migration
- [x] Document key features/requirements that downstream researchers must address
- [x] Define specific research questions for DnD Library Researcher
- [x] Define specific research questions for Domain & Hosting Researcher
- [x] Define specific research questions for AI & Privacy Researcher
- [x] Update Global Notes with any discovered constraints or context

### Agent Updates

- (append-only log; downstream agent writes updates here)

## DnD Library Researcher

### Checklist

- [ ] Wait for Research Lead to provide context and research questions
- [ ] Research Python libraries for D&D 5e SRD data (e.g., open5e, dnd5eapi bindings)
- [ ] Evaluate Python packages for dice rolling and game mechanics
- [ ] Compare library options by: maintenance status, documentation, feature coverage
- [ ] Document recommended libraries with rationale
- [ ] Note any licensing considerations

### Agent Updates

- (append-only log)

## Domain & Hosting Researcher

### Checklist

- [x] Wait for Research Lead to provide context and research questions
- [x] Research domain registrar options and pricing
- [x] Evaluate Python-friendly hosting platforms (e.g., Railway, Render, Fly.io, AWS, Heroku)
- [x] Compare hosting options by: Python support, pricing, scalability, ease of deployment
- [x] Document recommended hosting solution with rationale
- [x] Note any database hosting considerations for Python backends

### Agent Updates

- 2026-04-20: Completed RESEARCH_DOMAINS_HOSTING.md with comprehensive findings:
  - **Domain Registrar**: Cloudflare Registrar API (at-cost pricing, API launched April 2026)
  - **DNS Provider**: Cloudflare DNS + Cloudflare for SaaS ($0.10/domain/month after 100 free)
  - **Python Backend Hosting**: Render (simplicity) or Fly.io (global scale), both with EU regions
  - **User Static Sites**: Cloudflare Pages + Workers for multi-tenant routing
  - **SSL Automation**: Cloudflare for SaaS handles automatic provisioning
  - **Cost Projections**: ~$300/month for 1,000 sites, ~$1,500/month for 10,000 sites
  - Alternative AWS architecture documented for teams with AWS expertise

## AI & Privacy Researcher

### Checklist

- [x] Wait for Research Lead to provide context and research questions
- [x] Research AI/LLM integration options compatible with Python (e.g., OpenAI, Anthropic, local models)
- [x] Evaluate Python AI libraries and SDKs
- [x] Research privacy-preserving approaches for AI features
- [x] Document data handling and privacy compliance considerations
- [x] Compare AI options by: cost, privacy, Python SDK quality, capabilities
- [x] Document recommended AI approach with rationale

### Agent Updates

- 2026-04-20: Completed RESEARCH_AI_PRIVACY.md with comprehensive findings:
  - **LLM Recommendation**: Claude Haiku 4.5 ($0.02/generation) for production, direct Anthropic SDK over LangChain
  - **Local LLM Fallback**: Ollama + Qwen 3 8B for cost reduction and privacy-sensitive batch processing
  - **Encryption**: PyCryptodome with AES-256-GCM for GDPR-compliant form data storage
  - **EU Hosting**: Required for all form data (Hetzner or Railway EU recommended)
  - **Cookie Consent**: Runtime script blocking before explicit consent (critical 2026 requirement)
  - **Member Auth**: JWT-based with site membership verification
  - Full cost projections: ~$50/mo at startup, ~$320/mo at 10K generations
