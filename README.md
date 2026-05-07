# Institutional AI Runtime

Institutional AI Runtime is a governance-first monorepo for operating enterprise AI workloads with policy admission, model registry controls, routing arbitration, replayability, observability lineage, deployment health, economic governance, and cryptographic execution receipts.

## Workspace layout

- `apps/runtime-gateway` exposes runtime, registry, replay, observability, and health routes.
- `apps/governance-console` contains governance console modules for registry, policy, replay, health, routing, lineage, and observability surfaces.
- `apps/replay-engine` reconstructs historical execution events and validates deterministic replay.
- `packages/*` provide reusable runtime, policy, routing, observability, deployment-health, memory, constitutional, economic, and receipt primitives.
- `schemas`, `contracts`, `manifests`, and `event-spine` define cross-system integration boundaries.
- `infrastructure` contains deployment, container, monitoring, and cloud provisioning entry points.

## Development

```bash
npm run build
npm run test
npm run lint
```

The current repository provides typed scaffolding and validation fixtures for the institutional runtime architecture. Implementations are intentionally dependency-light so platform teams can bind them to their preferred HTTP server, policy engine, event bus, and cloud runtime.
