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
