# Domain Registration & Hosting Research

## Executive Summary

This document provides research findings for Vera Site Builder's domain registration and hosting needs. The project requires:
- **Multi-tenant hosting** for potentially thousands of user-generated websites
- **Custom domain support** with automatic SSL provisioning
- **European hosting** preference (Rotterdam-based company, GDPR compliance)
- **Python backend** compatibility (FastAPI recommended by DnD Researcher)

**TL;DR Recommendation:**
- **Domain Registrar**: Cloudflare Registrar API (at-cost pricing, API just launched April 2026)
- **DNS Provider**: Cloudflare DNS + Cloudflare for SaaS (automatic SSL, $0.10/domain/month after 100 free)
- **Hosting**: Render or Fly.io for Python backend + Cloudflare for SaaS for user site delivery
- **Static Sites**: Cloudflare Pages or S3+CloudFront for user-generated static content

---

## 1. Domain Registrar API Comparison

### Cloudflare Registrar ⭐ RECOMMENDED

| Aspect | Details |
|--------|---------|
| **API Status** | Beta (launched April 15, 2026) |
| **Pricing Model** | At-cost (wholesale pricing, no markup) |
| **Example Prices** | .COM: $10.46/yr, .NET: $11.86/yr, .ORG: $7.50/yr, .IO: $50/yr |
| **API Quality** | Full REST API, MCP integration available |
| **SSL Automation** | Native integration with Cloudflare SSL |
| **Reseller Program** | "Registrar-as-a-service" launching later 2026 |

**Pros:**
- Wholesale (at-cost) pricing - no markup at all
- Same API handles registration + DNS + SSL
- Native integration with Cloudflare for SaaS for multi-tenant SSL
- 4.2 million domains under management (proven scale)
- MCP-compatible for AI agent integrations

**Cons:**
- API still in beta (April 2026)
- Transfers, renewals, contact updates coming "later this year"
- No reseller/white-label program yet (coming soon)

**Sources:**
- [Cloudflare Registrar API Beta Launch](https://blog.cloudflare.com/registrar-api-beta/)
- [Cloudflare Domain Pricing](https://cfdomainpricing.com/)

---

### Namecheap API

| Aspect | Details |
|--------|---------|
| **API Status** | Mature, production-ready |
| **Pricing Model** | Retail pricing with markup |
| **Example Prices** | .BIZ: $6+/yr, varies by TLD |
| **API Quality** | XML-based API, sandbox testing available |
| **SSL Automation** | Separate SSL purchase required |
| **Reseller Program** | Available but "not very suited for resellers" |

**Pros:**
- Mature API with sandbox testing environment
- Wide TLD support (.biz, .ca, .cc, .co, .com, .info, .me, .net, .org, etc.)
- WHMCS addon available
- `getPricing` and `getBalances` API methods

**Cons:**
- Not competitive for resellers at scale
- No intro discounts (same price day one as renewal)
- XML-based API (older technology)
- ICANN fee ($0.20) added separately

**Sources:**
- [Namecheap API Documentation](https://www.namecheap.com/support/api/intro/)
- [Namecheap API Methods](https://www.namecheap.com/support/api/methods/)

---

### GoDaddy Reseller API

| Aspect | Details |
|--------|---------|
| **API Status** | Production-ready |
| **Pricing Model** | "Good as Gold" prepaid account |
| **API Quality** | REST API, requires 50+ domains for full access |
| **SSL Automation** | Separate configuration |
| **Reseller Program** | Full white-label support |

**Pros:**
- Full white-label branding capability
- Set your own prices
- WHMCS integration available
- Production + OTE testing environments

**Cons:**
- **Availability API limited to accounts with 50+ domains**
- Requires "Good as Gold" prepaid account funding
- 60 requests/minute rate limit
- Must set up own payment processor
- Terms prohibit modifying domains not under user's direct control

**Sources:**
- [GoDaddy API Getting Started](https://developer.godaddy.com/getstarted)
- [GoDaddy Reseller Program](https://www.godaddy.com/reseller-program)

---

### AWS Route53 Domains

| Aspect | Details |
|--------|---------|
| **API Status** | Production-ready (AWS SDK) |
| **Pricing Model** | Per-domain, varies by TLD |
| **Example Prices** | .COM: ~$12/yr |
| **API Quality** | Full AWS SDK support (boto3 for Python) |
| **SSL Automation** | Via AWS Certificate Manager (free) |
| **Reseller Program** | None |

**Pros:**
- Full AWS ecosystem integration
- Python boto3 SDK support
- AWS Certificate Manager for free SSL
- Pairs naturally with S3/CloudFront hosting

**Cons:**
- No volume discounts
- Default limit: 20 domains per account (can request increase)
- Cannot use promotional credits for domain registration
- Pricing not competitive with Cloudflare

**Sources:**
- [AWS Route 53 Pricing](https://aws.amazon.com/route53/pricing/)
- [Route 53 Domain Price API](https://docs.aws.amazon.com/Route53/latest/APIReference/API_domains_DomainPrice.html)

---

### Google Domains / Cloud Domains

| Aspect | Details |
|--------|---------|
| **API Status** | Cloud Domains API (Squarespace backend) |
| **Pricing Model** | Retail pricing |
| **API Quality** | Google Cloud API with gcloud CLI |
| **SSL Automation** | Limited - no ACME DNS API |
| **Current Status** | Migrated to Squarespace (July 2024) |

**Pros:**
- Google Cloud API/gcloud CLI support
- Can charge to Google Cloud Billing Account
- IAM integration for access control

**Cons:**
- **Squarespace is now the registrar** (ownership transferred)
- **No Dynamic DNS or ACME DNS API support**
- Cannot change DNS records if using Google Domains DNS
- Uncertain future under Squarespace

**NOT RECOMMENDED** due to Squarespace migration limitations.

**Sources:**
- [Cloud Domains Overview](https://docs.cloud.google.com/domains/docs/overview)
- [Google Domains Migration to Squarespace](https://support.squarespace.com/hc/en-us/articles/17131164996365)

---

## 2. DNS Provider Comparison

### Cloudflare DNS ⭐ RECOMMENDED

| Feature | Details |
|---------|---------|
| **Pricing** | Free (included with Cloudflare) |
| **API** | Full REST API for DNS management |
| **SSL** | Universal SSL (free), automatic provisioning |
| **Wildcard SSL** | Supported via Let's Encrypt DNS-01 challenge |
| **Multi-tenant** | Cloudflare for SaaS ($0.10/domain/month, 100 free) |

**Why Cloudflare for Multi-Tenant:**
- **Cloudflare for SaaS** specifically designed for SaaS providers with customer domains
- Automatic SSL certificate provisioning and renewal
- Single distribution serves all tenant domains
- WAF rules can be inherited by customer domains
- Wildcard custom hostnames supported

**SSL Automation Methods:**
1. **Cloudflare Universal SSL** - Automatic, free
2. **Let's Encrypt + Cloudflare DNS API** - For self-hosted scenarios
   - Use Certbot with `python3-certbot-dns-cloudflare` plugin
   - Or acme.sh with CF_Token export
   - Or Caddy with Cloudflare DNS module (auto-renewal)

**Sources:**
- [Cloudflare for SaaS Plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/)
- [Custom Hostnames Documentation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/)

---

### AWS Route53 DNS

| Feature | Details |
|---------|---------|
| **Pricing** | $0.50/hosted zone/month + $0.40/million queries |
| **API** | AWS SDK (boto3) |
| **SSL** | AWS Certificate Manager (free) |
| **Multi-tenant** | Requires ALB + CloudFront architecture |

**Limitation:** ALB has 100 SSL certificate limit per load balancer.

---

## 3. Hosting Platform Comparison

### For Python Backend (FastAPI)

#### Render ⭐ RECOMMENDED FOR SIMPLICITY

| Aspect | Details |
|--------|---------|
| **Python Support** | Native, first-class |
| **Pricing** | Free tier available, paid from $7/month |
| **Custom Domains** | Full support with automatic TLS |
| **Auto-scaling** | Traffic-based, CPU/memory thresholds |
| **Global CDN** | Edge network included |
| **EU Region** | Frankfurt available |

**Pros:**
- "Modern Heroku" experience
- Git-based deployments
- HA Postgres with point-in-time recovery
- Zero-downtime deploys
- Built-in logs, metrics, alerts
- Flat-rate pricing (predictable costs)

**Cons:**
- Per-user pricing adds up for larger teams
- Bandwidth overages: $0.55/GB

**Sources:**
- [Render FastAPI Deployment](https://render.com/docs/deploy-fastapi)
- [Render Pricing](https://render.com/pricing)

---

#### Fly.io ⭐ RECOMMENDED FOR GLOBAL SCALE

| Aspect | Details |
|--------|---------|
| **Python Support** | Docker-based (Uvicorn/Gunicorn) |
| **Pricing** | Usage-based, starts ~$1.94/month |
| **Custom Domains** | Full support |
| **Regions** | 35+ data centers worldwide |
| **Static IPs** | Included (even on free tier) |
| **EU Regions** | Amsterdam, Frankfurt, London, Paris, etc. |

**Pros:**
- Best for global edge deployment
- Low-latency worldwide
- Docker-native (any stack)
- Micro-VMs with strong isolation
- $0.02/GB bandwidth

**Cons:**
- Requires Docker expertise
- More complex than Render

**Typical Cost:** $5-20/month for small app with database

**Sources:**
- [Fly.io FastAPI Documentation](https://fly.io/docs/python/frameworks/fastapi/)
- [FastAPI Deployment with Docker and Fly.io](https://pybit.es/articles/fastapi-deployment-made-easy-with-docker-and-fly-io/)

---

#### Railway

| Aspect | Details |
|--------|---------|
| **Python Support** | Native |
| **Pricing** | $5/month Hobby plan + usage |
| **Custom Domains** | Automatic encryption |
| **Best For** | Prototypes, side projects |

**Pros:**
- Fastest developer experience
- Push code → running app
- Good for rapid prototyping

**Cons:**
- "Complex setups and scaling issues" reported
- Better for prototypes than production

**Sources:**
- [Railway vs Render vs Fly.io 2026](https://thesoftwarescout.com/heroku-vs-railway-vs-render-vs-fly-io-2026-which-platform-should-you-deploy-on/)

---

### For User-Generated Static Sites

#### Cloudflare Pages + Workers for Platforms ⭐ RECOMMENDED

| Aspect | Details |
|--------|---------|
| **Pricing** | Free tier generous, usage-based after |
| **Custom Domains** | Via Cloudflare for SaaS |
| **SSL** | Automatic, free |
| **Multi-tenant** | Workers for Platforms (per-tenant isolation) |

**Architecture for Vera:**
1. Deploy main app to Cloudflare Pages
2. Use Cloudflare Worker proxy for tenant routing
3. Cloudflare for SaaS for custom domain SSL ($0.10/domain/month after 100 free)
4. Per-tenant D1 databases, KV namespaces, R2 buckets

**Sources:**
- [Cloudflare Pages API](https://developers.cloudflare.com/pages/configuration/api/)
- [Workers for Platforms](https://workers.cloudflare.com/solutions/platforms)

---

#### Vercel

| Aspect | Details |
|--------|---------|
| **Pricing** | Free hobby, Pro $20/user/month |
| **Custom Domains** | 50/project (Hobby), unlimited (Pro/Enterprise) |
| **SSL** | Automatic |
| **Domains API** | Full registrar API (Oct 2025) |

**Pros:**
- Excellent DX for React/Next.js
- 2.3 million websites hosted
- Domains Registrar API available

**Cons:**
- **3-4x more expensive than equivalent AWS** at scale
- $0.15/GB bandwidth overage
- Per-user pricing adds up
- Enterprise pricing for thousands of sites

**NOT RECOMMENDED** for user-generated sites at scale due to cost.

**Sources:**
- [Vercel Pricing](https://vercel.com/pricing)
- [Vercel Domains API](https://vercel.com/changelog/new-domains-registrar-api-for-domain-search-pricing-purchase-and-management)

---

#### Netlify

| Aspect | Details |
|--------|---------|
| **Pricing** | Free tier, Pro $20/user/month |
| **Custom Domains** | Supported with SSL |
| **Bandwidth** | $0.55/GB overage |

**Pros:**
- Generous free tier (100GB bandwidth, custom domains, SSL)

**Cons:**
- Credit-based billing (Sept 2025) makes cost prediction harder
- Per-user pricing adds up
- "Hidden costs" documented (Identity charges per committer)
- Median buyer pays $16,500/year (Enterprise)

**NOT RECOMMENDED** at scale due to unpredictable costs.

**Sources:**
- [Netlify Pricing](https://www.netlify.com/pricing/)
- [Netlify Domain Pricing Analysis](https://www.oreateai.com/blog/demystifying-netlify-domain-pricing-from-free-tiers-to-enterprise-scale/)

---

#### AWS S3 + CloudFront

| Aspect | Details |
|--------|---------|
| **Pricing** | Pay-per-use, very cost-effective at scale |
| **Custom Domains** | Via CloudFront + ACM |
| **SSL** | AWS Certificate Manager (free) |
| **Multi-tenant** | CloudFront Multi-Tenant SaaS distribution |

**Scaling:**
- CloudFront Multi-Tenant SaaS: 2000 SSL certificates per distribution
- Multiple distributions possible for more domains
- Decouples tenant domains from ALB entirely
- Host header forwarding for tenant identification

**Cost Estimates:**
| Traffic Level | Monthly Cost |
|---------------|-------------|
| 1-5 GB/month | $0.10-$2 |
| 10-50 GB/month | $1.5-$10 |
| 100-500 GB/month | $8-$75 |
| TBs/month | Hundreds (volume discounts apply) |

**Pros:**
- Most cost-effective at high scale
- Proven multi-tenant architecture
- Flat-rate pricing plans available (includes WAF, DDoS protection)

**Cons:**
- More complex to set up
- Requires AWS expertise
- ALB has 100 SSL cert limit (use CloudFront Multi-Tenant instead)

**Sources:**
- [CloudFront Multi-Tenant Architecture](https://dev.to/peter_dyakov_06f3c69a46b7/scalable-multi-tenant-architecture-for-hundreds-of-custom-domains-56mn)
- [CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)

---

## 4. Recommended Architecture for Vera

### Option A: Cloudflare-Centric (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Custom Domain                      │
│                   (customer.example.com)                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare for SaaS                             │
│         (Custom Hostnames + Automatic SSL)                   │
│              100 free, then $0.10/domain/month               │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌─────────────────────┐     ┌─────────────────────┐
│  Cloudflare Pages   │     │   Cloudflare Worker │
│  (User's Static     │     │   (Dynamic routing  │
│   Site Content)     │     │    + tenant logic)  │
└─────────────────────┘     └──────────┬──────────┘
                                       │
                                       ▼
                           ┌─────────────────────┐
                           │  Python Backend     │
                           │  (FastAPI on        │
                           │   Render/Fly.io)    │
                           │  EU Region          │
                           └──────────┬──────────┘
                                       │
                                       ▼
                           ┌─────────────────────┐
                           │    PostgreSQL       │
                           │   (Render/Fly.io    │
                           │    managed DB)      │
                           └─────────────────────┘
```

**Domain Registration Flow:**
1. User purchases domain via Vera UI
2. Backend calls Cloudflare Registrar API
3. DNS automatically configured to Cloudflare
4. Cloudflare for SaaS provisions SSL
5. Worker routes to user's site content

**Cost at Scale (1000 sites):**
| Component | Monthly Cost |
|-----------|-------------|
| Cloudflare for SaaS (900 domains) | $90 |
| Cloudflare Pages/Workers | ~$50 |
| Render/Fly.io Backend | $50-100 |
| PostgreSQL | $50-100 |
| **Total** | **~$240-340/month** |

---

### Option B: AWS-Centric (Alternative)

Better for teams with AWS expertise who want maximum control.

```
User Domain → Route53 DNS → CloudFront (Multi-Tenant) → S3 Static Sites
                                    ↓
                              ALB → ECS/Fargate (FastAPI)
                                    ↓
                                  RDS PostgreSQL
```

**Pros:** More control, potentially cheaper at very high scale
**Cons:** More complex, requires AWS expertise

---

## 5. SSL Automation Strategy

### For Cloudflare-Managed Domains (Recommended)
- **Universal SSL**: Automatic, free, no configuration needed
- **Cloudflare for SaaS**: Automatic cert provisioning per custom hostname

### For Self-Hosted Scenarios
Use **Certbot with Cloudflare DNS plugin** or **Caddy with Cloudflare module**:

```bash
# Certbot method
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/cloudflare.ini \
  -d example.com,*.example.com
```

```bash
# acme.sh method
export CF_Token="your_cloudflare_api_token"
acme.sh --issue -d example.com -d '*.example.com' --dns dns_cf
```

---

## 6. Cost Projections

### At Different Scales

| Scale | Cloudflare-Centric | AWS-Centric |
|-------|-------------------|-------------|
| 100 sites | ~$50/month | ~$100/month |
| 1,000 sites | ~$300/month | ~$400/month |
| 10,000 sites | ~$1,500/month | ~$1,200/month |
| 100,000 sites | Contact sales | ~$8,000/month |

*Note: AWS becomes more cost-effective at very high scale but requires more engineering effort*

---

## 7. Final Recommendations

### Domain Registration
**Use Cloudflare Registrar API** when it exits beta (or now for early access)
- At-cost pricing (lowest in industry)
- Native integration with DNS and SSL
- Reseller program coming soon

### DNS + SSL
**Use Cloudflare DNS + Cloudflare for SaaS**
- 100 custom hostnames free
- $0.10/domain/month after that
- Automatic SSL provisioning and renewal
- No certificate management overhead

### Python Backend Hosting
**Use Render** (simplicity) or **Fly.io** (global scale)
- Both have EU regions (Frankfurt/Amsterdam)
- Both support FastAPI natively
- Render: easier to start, flat pricing
- Fly.io: better for global edge, lower latency

### User Site Static Content
**Use Cloudflare Pages** with Worker for tenant routing
- Free tier generous
- Same Cloudflare ecosystem
- No vendor lock-in (standard HTML/CSS/JS)

### Alternative: AWS for Maximum Control
If team has AWS expertise, S3+CloudFront+ECS is more cost-effective at >10,000 sites but requires significantly more DevOps investment.

---

## 8. Implementation Checklist

- [ ] Create Cloudflare account (if not existing)
- [ ] Enable Cloudflare for SaaS on account
- [ ] Set up Cloudflare Registrar API access (beta)
- [ ] Choose backend hosting (Render vs Fly.io)
- [ ] Set up PostgreSQL (managed DB from same provider)
- [ ] Deploy FastAPI backend to EU region
- [ ] Configure Cloudflare Worker for tenant routing
- [ ] Implement domain purchase flow via Cloudflare API
- [ ] Test custom hostname provisioning end-to-end
- [ ] Set up monitoring and alerting

---

*Last Updated: 2026-04-20*
*Author: Domain & Hosting Researcher Agent*
