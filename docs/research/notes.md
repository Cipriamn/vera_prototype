#### Project Vision

- nothing changed

#### Development Process & Collaboration

- Only GitLab 
- KanBan-style, but we can do Sprints
- Not here on Thursday
- We should be here Monday/Tuesday

- AI usage -> free to use

#### Technical Architecture

- Integration into Vera-Connect
    - Not in scope
- Authentication -> Separate from the app
- Tech stack -> Preferably keep what they have

#### Requirements

- Competition: congressus, genkgo 
- Example of website that the builder should be able to build: antibarbari, dizkartes

- Collaboration on building: nice to have/won't have 
- Hosting environmnets: They host on Azure but odn't really care
- DNS automation: Interested in free subdomains
            - Most basic: Just a tutorial of how to deploy to domain
            - Most advantced: automate it all
            - Look into Google Workspace domain automation and WebFlow
- Privacy: do our own
- Data collection: people building websites should be responsible for the data sent in

- Design: blocks should be customizable, builder should follow the design language of the app
- The builder should have a viewer of the website (including mobile) 

- Optional: Review before deployment

- Content moderation: Users should be able to report to Vera if website is offensive 

- AI integration: No preferances over AI used (look into openroute)

- CRM: Implement in a decoupled way for testing

- Storage: It depends on the subscirption of the user, but we shold not bother with that
    - Azurite?

- Website version history: probably could have

- Dependencies: ask Robin man

- Payment integration: they have it, maybe build an interface where they can throw their API

---
- Website Hosting
- Visualization of mobile experience
- Payment integration
---

#### Logistics & Other Questions


---

# Research Papers Reference (Research Lead)

**Added: 2026-04-22**

This section contains 10 academic papers/research relevant to the Vera Connect website builder proposal. Papers are categorized by downstream researcher responsibility.

---

## Papers for DnD Library Researcher (Drag-and-Drop UI)

### Paper 1: Low-Code Programming Models
- **Source**: Communications of the ACM
- **URL**: https://cacm.acm.org/research/low-code-programming-models/
- **Relevance**: Reviews visual programming, programming by demonstration, and natural language approaches for low-code. Maps techniques to target users—directly applicable to choosing DnD editor approach.
- **Key Extract Needed**: Comparison of visual programming paradigms, strengths/weaknesses for non-technical users

### Paper 2: The Rise of No/Low Code Software Development
- **Source**: ResearchGate
- **URL**: https://www.researchgate.net/publication/342951159_The_Rise_of_NoLow_Code_Software_Development-No_Experience_Needed
- **Relevance**: Shift toward visual programming and LCDPs. Covers security strategy requirements for low-code platforms.
- **Key Extract Needed**: Security considerations for visual builders, user adoption patterns

### Paper 3: Combining Low-Code Development with ChatGPT
- **Source**: ScienceDirect
- **URL**: https://www.sciencedirect.com/science/article/pii/S266730532300114X
- **Relevance**: Focus-group study on combining low-code with AI assistants. Directly relevant to AI-powered page generation feature.
- **Key Extract Needed**: User expectations when combining visual builders with LLMs

### Paper 4: Enhancing Accessibility for Non-experts in Low-Code/No-Code Through AI Chatbot
- **Source**: Springer
- **URL**: https://link.springer.com/chapter/10.1007/978-3-032-04999-5_12
- **Relevance**: SUS scores improved with AI chatbot assistance. 57% preference for visual builders. Hybrid approach findings.
- **Key Extract Needed**: UX metrics for AI-assisted visual builders, task completion data

---

## Papers for Domain & Hosting Researcher

### Paper 5: GDPR-Compliant Cloud Architecture with Sticky Policies
- **Source**: PMC/NIH
- **URL**: https://pmc.ncbi.nlm.nih.gov/articles/PMC11041943/
- **Relevance**: Data privacy challenges in cloud architecture design. GDPR compliance at system design stage—critical for EU hosting decisions.
- **Key Extract Needed**: Architecture patterns for GDPR-compliant cloud hosting

### Paper 6: Performance Comparison of Python Web Frameworks (FastAPI vs Flask vs Django)
- **Source**: IJSREM
- **URL**: https://ijsrem.com/download/performance-and-usability-comparison-of-python-web-frameworks-for-data-science-application-django-flask-and-fastapi/
- **Relevance**: Benchmark data for Python framework selection. FastAPI ideal for high-performance real-time applications.
- **Key Extract Needed**: Performance benchmarks, scalability metrics, framework recommendations for API-heavy applications

### Paper 7: Developer Discussion Topics on Low-Code Platform Adoption
- **Source**: PMC
- **URL**: https://pmc.ncbi.nlm.nih.gov/articles/PMC9643911/
- **Relevance**: Analysis of 33.7K Stack Overflow posts on 38 LCSD platforms. Identifies common deployment and hosting challenges.
- **Key Extract Needed**: Common infrastructure pain points, deployment patterns

---

## Papers for AI & Privacy Researcher

### Paper 8: Design Principles for GDPR (Formal Concept Analysis)
- **Source**: ScienceDirect
- **URL**: https://www.sciencedirect.com/science/article/pii/S0306437919305216
- **Relevance**: Systematic synthesis of privacy protection and access control for GDPR-compliance by design. Foundation for privacy-first architecture.
- **Key Extract Needed**: GDPR-compliance design principles, access control patterns

### Paper 9: UICoder - Finetuning LLMs to Generate UI Code
- **Source**: arXiv
- **URL**: https://arxiv.org/html/2406.07739v1
- **Relevance**: Method for using automated tools (compiler + vision-language model) to finetune LLMs for UI code generation from text descriptions.
- **Key Extract Needed**: Approach for AI-powered page/UI generation, validation methods

### Paper 10: Sketch2Code - Evaluating VLMs for Web Design Prototyping
- **Source**: arXiv
- **URL**: https://arxiv.org/html/2410.16232v1
- **Relevance**: Benchmark for Vision-Language Models converting sketches to webpage prototypes. Directly applicable to AI page generation service.
- **Key Extract Needed**: VLM capabilities for web design, accuracy metrics, model recommendations

---

## Additional References (Supplementary)

### Generative UI Paper
- **Source**: Google Research
- **URL**: https://generativeui.github.io/static/pdfs/paper.pdf
- **Note**: LLMs as effective UI generators, strong user preference data with newer models

### pix2code (Foundational)
- **Source**: arXiv
- **URL**: https://arxiv.org/abs/1705.07962
- **Note**: 77% accuracy generating code from UI screenshots across iOS, Android, web

### GDPR Compliance via Software Evolution
- **Source**: ScienceDirect
- **URL**: https://www.sciencedirect.com/science/article/pii/S0164121224001894
- **Note**: Pre-filled templates for privacy/security controls in MVC web applications

---

## Research Assignments Summary

| Researcher | Papers | Focus |
|------------|--------|-------|
| DnD Library | 1-4 | Visual builders, low-code UX, AI-assisted editing |
| Domain & Hosting | 5-7 | Cloud architecture, Python frameworks, deployment |
| AI & Privacy | 8-10 | GDPR design principles, LLM UI generation |

**Instructions for Downstream Researchers:**
1. Read your assigned papers (or at minimum the abstracts/key sections)
2. Extract findings relevant to the Vera Connect proposal requirements
3. Append your analysis to this notes.md file under a new section
4. Note specific recommendations with citations

---

# DnD Library Researcher Findings

**Added: 2026-04-22**

## Paper Analysis (Papers 1-4)

### Paper 1: Low-Code Programming Models (CACM)

**Key Findings:**
- Visual programming democratizes software development for non-technical users
- 80% of tech products will be built by "citizen developers" by 2024 (Gartner)
- 70% of users with no prior experience learned low-code in ≤1 month
- Low-code can reduce development time by 50-90% (Forrester 2024)
- The trend is evolving toward **agentic AI** where users orchestrate AI agents via natural language

**Application to Vera Connect:**
- Visual drag-and-drop approach is validated for target user base (associations, student houses)
- Pre-built component libraries accelerate development
- Consider hybrid approach: visual + AI-assisted

### Paper 2: The Rise of No/Low Code Software Development (ResearchGate)

**Key Findings - Security:**
- Most frequent vulnerabilities: **code injection, XSS, insecure APIs**
- Information security risks: weak encryption, data breaches, misconfigurations
- Shadow IT risk when non-technical users create apps without IT oversight
- OWASP Low-Code/No-Code Top 10 provides security checklist

**Mitigation Strategies:**
- Request SBOM (Software Bill of Materials) from vendors
- Implement SAST/DAST scanning
- Create inventory of all LCNC apps
- Provide citizen developers with clear remediation instructions

**Application to Vera Connect:**
- Security-first design critical for GDPR compliance
- Need automated security scanning for user-generated sites
- Content moderation system aligns with security requirements

### Paper 3: Combining Low-Code with ChatGPT (ScienceDirect)

**Key Findings:**
- LLMs effective for problem-solving, code generation, and code repair
- AI can fully automate low-code pipeline instructions
- Microsoft's Low-code LLM framework: 6 types of visual programming interactions
- Users prefer clicking, dragging, or text editing over prompt engineering

**Application to Vera Connect:**
- AI page generation feature well-validated by research
- Combine visual drag-and-drop with LLM assistance
- Use AI to generate initial page structure, then visual refinement

### Paper 4: AI Chatbot Enhancing LCNC Accessibility (Springer)

**Key Findings (n=26 user study):**
- **SUS scores significantly higher** with AI chatbot (p = .03)
- Task completion **faster** (p<.001)
- **Fewer errors** (p<.001)
- Less external help needed (p<.001)
- Most users preferred **hybrid approach** (visual + AI)
- Some experienced users eventually preferred visual builder alone

**Application to Vera Connect:**
- Strong empirical support for AI-assisted building
- Implement AI chatbot for guidance, not replacement
- Allow toggle between AI-assisted and pure visual modes

---

## Drag-and-Drop Library Comparison Matrix

| Library | React Native | License | Learning Curve | Maintenance | Best For |
|---------|-------------|---------|----------------|-------------|----------|
| **Puck** | ❌ | MIT | Low | Active (v0.21) | Full page builder, AI built-in |
| **dnd-kit** | ❌ | MIT | Medium | Active | Low-level DnD primitives |
| **GrapesJS** | ❌ | BSD-3 | High | Active | Full HTML template builder |
| **Craft.js** | ❌ | MIT | Medium | Moderate | React page editors |
| **Builder.io** | ✅ (Native SDK) | Proprietary | Low | Active | Enterprise, CMS |
| **Plasmic** | ❌ | Proprietary | Medium | Active | Design-to-code |

### Detailed Library Analysis

#### 1. Puck (⭐ PRIMARY RECOMMENDATION)
- **GitHub**: 6,800+ stars, active development
- **Pros**:
  - Ready-to-use UI out of box
  - Built-in AI page generation (v0.21)
  - Uses dnd-kit internally (proven DnD)
  - MIT licensed, no vendor lock-in
  - Plugin system, Tailwind v4 support
  - Strong React ecosystem support
- **Cons**:
  - No React Native support
  - Smaller community than GrapesJS
- **Source**: [Puck GitHub](https://github.com/puckeditor/puck)

#### 2. dnd-kit (KEEP CURRENT)
- **Downloads**: 12M+ weekly
- **Performance**: Best in class
  - Maintains 60fps with 1,000 draggable items
  - ~10kb core, no external dependencies
  - Uses GPU-accelerated transforms
- **Pros**:
  - Already in use in project
  - Excellent accessibility (keyboard, screen readers)
  - Multiple input methods (pointer, touch, keyboard)
- **Cons**:
  - Low-level - requires building UI layer
  - No file drag-from-desktop support
- **Source**: [dnd-kit](https://dndkit.com/)

#### 3. GrapesJS
- **GitHub**: 25,695 stars, 140K weekly downloads
- **Pros**:
  - Most mature open-source option
  - Extensive plugin ecosystem
  - Multi-purpose (emails, sites, mobile)
- **Cons**:
  - Framework-agnostic (React wrapper available)
  - Steep learning curve
  - Requires custom UI build
- **Source**: [GrapesJS GitHub](https://github.com/GrapesJS/grapesjs)

#### 4. Craft.js
- **Pros**:
  - Native React framework
  - Modular architecture
  - Inspired by GrapesJS but simpler
  - MIT licensed
- **Cons**:
  - Less active development than alternatives
  - Smaller ecosystem
- **Source**: [Craft.js GitHub](https://github.com/prevwong/craft.js/)

#### 5. Builder.io (Commercial)
- **Pricing**: From $199/month
- **Pros**:
  - **Only option with React Native SDK**
  - Native Swift/SwiftUI/Kotlin support
  - Built-in CMS and hosting
  - AI-powered design features
- **Cons**:
  - Proprietary, vendor lock-in risk
  - Higher cost
- **Source**: [Builder.io](https://www.builder.io/)

#### 6. Plasmic (Commercial)
- **Pricing**: From $10/user/month
- **Pros**:
  - Code export (zero lock-in possible)
  - Figma-like design experience
  - Incremental adoption
- **Cons**:
  - No React Native support
  - Proprietary
  - More complex than Builder.io
- **Source**: [Plasmic](https://www.plasmic.app/)

---

## React Native Compatibility Summary

**Critical Finding**: No open-source DnD library supports React Native out of the box.

**Options for Mobile Support:**
1. **Builder.io Native SDK** - Only drag-and-drop solution with native iOS/Android support
2. **WebView wrapper** - Embed web-based editor in React Native WebView
3. **Separate mobile viewer** - Build-only on web, view on mobile (recommended for Vera Connect)

---

## Recommendations for Vera Connect

### Primary Stack Recommendation

| Layer | Tool | Rationale |
|-------|------|-----------|
| DnD Engine | **dnd-kit** (keep) | Already integrated, best performance |
| Page Builder | **Puck** | Ready UI, AI built-in, uses dnd-kit, MIT |
| Mobile Strategy | Web editor + RN viewer | No viable RN editor exists open-source |

### Why Puck Over Alternatives?

1. **Ready-to-use UI** vs GrapesJS/Craft.js requiring UI from scratch
2. **AI page generation built-in** (v0.21) aligns with proposal requirements
3. **MIT license** avoids vendor lock-in (vs Builder.io/Plasmic)
4. **Uses dnd-kit internally** - consistent with current stack
5. **Active development** with modern React patterns

### Migration Path from Current Setup

1. Keep dnd-kit for low-level interactions
2. Add Puck for complete page builder experience
3. Customize Puck components to match Vera Connect design system
4. Integrate AI generation with OpenRouter/Claude API

---

## Sources

- [SAP Low-Code/No-Code Guide](https://www.sap.com/products/technology-platform/build/what-is-low-code-no-code.html)
- [Low-Code Security Concerns - CSO Online](https://www.csoonline.com/article/572021/4-security-concerns-for-low-code-and-no-code-development-2.html)
- [ResearchGate: Rise of No/Low Code](https://www.researchgate.net/publication/342951159_The_Rise_of_NoLow_Code_Software_Development-No_Experience_Needed)
- [ScienceDirect: LCNC Adoption Review](https://www.sciencedirect.com/science/article/abs/pii/S0164121224003443)
- [Microsoft Low-code LLM Research](https://visualstudiomagazine.com/articles/2023/04/26/low-code-llms.aspx)
- [Springer: AI Chatbot for LCNC](https://link.springer.com/chapter/10.1007/978-3-032-04999-5_12)
- [Puck Top 5 DnD Libraries](https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react)
- [npm trends comparison](https://npmtrends.com/craft.js-vs-draft-js-vs-grapesjs-vs-react-web-editor)
- [Plasmic vs Builder.io](https://www.plasmic.app/vs-builder-io)
- [Builder.io Native SDK](https://www.builder.io/blog/native-mobile-sdks)
