Phase 6–12 Implementation Checklist

Phase 6 — Backend Development
- [x] Auth & authorization scaffold (defer full JWT to Phase 6.1)
- [x] Product endpoints (GET list, GET by slug)
- [x] Cart endpoints (in-memory dev store)
- [x] Orders endpoints (create + store)
- [x] Payment provider abstraction + mock provider
- [x] Daraja adapter stub (dev mock)
- [x] Protected downloads endpoint (dev stub)

Phase 7 — Frontend Development
- [x] Storefront home (static catalog)
- [x] Product detail page + add to cart
- [x] Cart page
- [x] Checkout page (creates order via API)

Phase 8 — Digital Product Delivery
- [x] Entitlement checks for downloads (dev stub returning protected content)
- [ ] Integrate with S3/Bunny for signed URLs
- [ ] Watermark/preview strategy for galleries

Phase 9 — Payment Integration
- [x] Provider abstraction implemented
- [x] Mock provider for development
- [ ] Implement Daraja flow using MPESA credentials
- [ ] Idempotent callback handling and retries

Phase 10 — Testing
- [x] Smoke tests for API endpoints
- [ ] Unit/integration tests for services (vitest/jest)
- [ ] Security and load testing before launch

Phase 11 — Deployment
- [x] CI workflow for build and smoke tests
- [ ] CD workflow to deploy to Render/Fly/Railway
- [ ] Add environment secret management and rotation

Phase 12 — Launch & Maintenance
- [ ] Monitoring (Sentry) and observability dashboards
- [ ] Backups and data retention policies
- [ ] On-call and runbooks
- [ ] Post-launch analytics and conversion monitoring

Notes:
- This repository contains a dev-first scaffold meant to be production hardened: replace in-memory stores with MongoDB (see .env.example), wire Daraja with credentials, and secure file storage before launch.
- Outstanding decisions: JWT vs cookies, Daraja vs aggregator, branch inventory model, referral scope, entitlement/permanent-access rules.
