# PROMPT 0 — CURRENT · STRICT CAPABILITY-FABRIC AUTHORITY PREFLIGHT

**Mode:** AUDIT ONLY — NO IMPLEMENTATION
**Audit target:** `Las0las/recruiting-focus-board`
**Literal current `main` HEAD:** `e904a21e17635564df0e9368bc8d40ad424d102d`
(`governance: enforce LAWRENCE execution-wave admission (#2118)`)
**Method:** shallow clone of `main`, static read of source, contracts,
constitution, and constitutional registry. No code executed, no test run, no
file in the audit target modified.

---

## 0. Scope note the owner must read first

The prompt series names `Las0las/recruiting-focus-board` as the working
repository. The session was scoped to `Las0las/-`, which is a **1,852-line
single-component React/Vite candidate dashboard backed by `localStorage`** — it
has no SDCP, no Governance Kernel, no DecisionEnvelope, no event spine, no
providers, and no reconciliation. It is not LAWRENCE and cannot be audited
against this program.

`recruiting-focus-board` was therefore attached and audited. All findings below
describe that repository. This audit document is committed to `Las0las/-` on
`claude/lawrence-capability-fabric-vlcrff` because that is the branch this
session was directed to develop on; **no P0.5+ slice should be implemented there.**
The owner must confirm the target repository before Prompt 0.5 opens a branch.

---

## A. Literal-current architecture map

Next.js 15 App Router / React 19 / TypeScript strict, Supabase Postgres with RLS
as the security boundary. 135 tables (squashed baseline + 80+ forward
migrations). No REST CRUD API — the product path is server components + server
actions.

Five layers matter for this program:

| Layer | Location | Character |
| --- | --- | --- |
| **Constitutional authority** | `constitution/lawrence-constitution.json` | 41 registered authorities, each with `purpose`, `canonical.files`, `mutationBoundary.allow/deny`, `denyCrossAuthority`, `invariants`, `verification` |
| **Constitutional procedure** | `constitutional-registry/`, `constitution/stage-contracts/`, `docs/governance/constitutional-operating-model.md` | primitive-question framework, allowlists, five stage-gates |
| **Contracts** | `contracts/` | ontology, admission, actions, action-ledger, lineage, operating-chain, work-items, transformations, release-authority, usage-registry, derived-intelligence, common-operational-picture |
| **Runtime** | `src/os/`, `src/core/`, `src/registry/`, `src/runtime/`, `src/services/`, `src/lib/` | kernel, canonical intent, governed registries, Event360 writer, command router |
| **Static enforcement** | `scripts/check-*.mjs` (~60), gated by `npm run check` | schema/type freshness, event360 direct-write allowlist, gates, spine, evidence immutability, provider-SDK boundaries, five-primitive convergence |

Enforcement is unusually strong: mutation boundaries are declared per authority
and enforced statically, and `check:event360-writes` plus
`constitutional-registry/allowlists/event360-direct-write-allowlist.json` already
prevent direct writes to the spine.

---

## B. Authority ownership map

| Target-state layer | Literal-current owner | Status |
| --- | --- | --- |
| **SDCP / semantic authority** | **Does not exist under that name.** `grep -rI "SDCP\|semantic_domain\|SemanticDomain"` across `src contracts constitution constitutional-registry governance supabase scripts tests` → **0 hits**. Function is distributed across `constitution/lawrence-constitution.json` (domain ownership), `contracts/ontology/operational-ontology.json` (objects + relationship types), `src/lib/EnterpriseObjectRegistry360.ts` (object existence), `src/core/intent/*` (intent) | **ABSENT — distributed** |
| **Intent resolution** | `CORE-INTENT` authority — `src/core/intent/canonical.ts` (`CanonicalIntent`, `buildCanonicalIntent`, `canonicalFromResolution`, `CanonicalEntityReference`, `CanonicalConstraint`, `CanonicalTemporalExpression`, `CanonicalProvenance`, `CanonicalEvidenceClass`), `src/core/intent/resolve.ts`, `src/core/query/canonical.ts`. Invariants: `deterministic_by_default`, `advisory_unless_approved`, `no_hidden_model_call` | **PRESENT, canonical** |
| **Context qualification** | `CanonicalSessionContext` + a single pure resolver `resolveContext` (`src/lib/command/router/context.ts`), specified in `docs/context-architecture.md`. Fields: route, page, entityType, entityId, viewingOwnerId, filters, search. Pure — no I/O, no cookies, entity **identity** not the loaded row | **PRESENT, canonical** |
| **Capability discovery / planning** | **Does not exist.** `grep "CapabilityFabric\|capability_fabric"` → 0 hits. Nearest surfaces: `src/lib/query-planner/*` (13 files: `query-intent.ts`, `planner-policy.ts`, `strategy-engine.ts`, `execution-strategy.ts`, `execute-planned-query.ts`, `explain.ts`) and `src/lib/command/command-registry.ts` (quick actions) | **ABSENT** |
| **Provider abstraction** | `CONNECTORS` authority — `src/lib/provider-adapters/contract.ts` ("Provider Adapter Contract / SDK — Phase 0.5B", **types-only**, invariant `no_implementation_contract_only`), `src/integrations/contracts/*`, `src/integrations/mappings/*`. Real adapters: `provider-adapters/embeddings/{contract,index,openai-embedding-adapter,synthetic-embedding-adapter}` and `provider-adapters/microsoft/*` (10 files incl. `execution-envelope`, `execution-receipt`, `receipt-integrity`, `failure-taxonomy`, `reconciliation`, `lane-state`, `proof-harness`) | **PRESENT, registered, mostly contract-only** |
| **Governance kernel** | `GOVERNANCE` authority — `src/lib/EnterpriseObjectRegistry360.ts`, `src/lib/authority/AuthorityModel.ts`, `src/lib/enforcement/stage-gates.ts`. Kernel side: `src/os/governance/PolicyEngine.ts` (`POLICY_VERSION = "policy-2"`), `src/os/governance/AuthorityResolver.ts`. Admission decomposition: `contracts/admission/admission-contract.json` (19 dimensions bound to existing mechanisms; explicit note "no new authorizer is introduced") | **PRESENT, canonical** |
| **Mutation admission** | **Two partial paths, no single authority.** (1) Product path: `requireUser()` → `ActionResult<T>` server action → `record_*` SECURITY DEFINER RPC → `emit_lifecycle_event` → Event360, fenced by `mutationBoundary.allow/deny` + `check:gates`. (2) Kernel path: `bootPersonalAIOS` → `KernelDecisionEnvelope` → `StateTransition` → `EventSpine` | **PRESENT but split** |
| **`routeAction`** | `src/lib/command/router/router.ts:268` — `function routeAction(request: CommandRequest): CommandPlan`. **Module-private (not exported), read-only, builds a plan** (disposition / href / target / confidence / reasons). It performs no mutation and admits no mutation. The only other hit is `scripts/check-claim-evidence.mjs` | **NAME EXISTS, AUTHORITY DOES NOT** |
| **`DecisionEnvelope`** | **Two definitions.** (1) `src/core/intent/types.ts:420` — `{mission_id, intent, goal, objects, actions, risk, owner, approvals}`, documented as "a read-only description; the actual write happens only through the existing governed action after explicit approval (D156 Decision 4)". (2) `src/os/contracts/ExecutionContract.ts:39` — `KernelDecisionEnvelope` `{id, kernelVersion, envelopeVersion, decidedAt, proposedTransition, authorityId, policyEvaluation, disposition, traceId}` | **DUPLICATED** |
| **Canonical truth** | Domain authorities: JOB-360, CANDIDATE-360, PERSON-CANON, CLIENT-360, CONTACT-360, SUBMISSION-360, INTERVIEW-360, OFFER, PLACEMENT-360, TASK-360, NOTE, PRESCREEN, SENDOUT, TALENTPOOL-360, MISSION-360, COVERAGE-RECOVERY-360 … each with `record_*` RPCs and `mutationBoundary` | **PRESENT, canonical** |
| **Event spine** | `EVENT-360` — `src/services/event360.ts`, contracts `src/lib/events/contracts.ts`, kernel `src/os/events/EventSpine.ts` + `TransitionLog.ts`. Invariants `events_via_spine_only`, `immutable_events` | **PRESENT, canonical, singular** |
| **Evidence / provenance** | `EVIDENCE` authority — `src/lib/evidence/*` (`hash.ts`, `chain.ts`, `immutability.ts`, `replay.ts`, `record.ts`, `serialize.ts`, `types.ts`), `src/lib/evidence-graph/*`, `src/lib/observation/*`, `src/lib/facts/registry.ts`. `EvidenceProvenance extends FactProvenance`; `ObservationRef` present; `EvidenceConfidenceBand`, `ValidationStatus`, `ReviewStatus` present. Explicit invariant: **"no parallel store"** | **PRESENT, canonical, singular** |
| **Reality Delta** | `src/lib/reality-delta.ts` — `classifyDeltaEvent`, `projectRealityDeltas`, `DeltaSignificance/Consequence/Valence`, `groupRealityDeltas`, `deriveOverdueTaskDeltas`; read paths `src/lib/queries/reality-delta.ts`, UI `src/components/os/briefing/RealityDeltaFeed.tsx` | **PRESENT — but means something else (see H4)** |
| **Reconciliation runtime** | **No general runtime.** Provider-local only: `src/lib/provider-adapters/microsoft/reconciliation.ts` (`reconcileOutlookInterview`; `LocalCalendarIntent` = scheduled/cancelled vs `ProviderPresence` = present/absent/cancelled/**unobserved**; `SafeRepair`). Adjacent: `src/services/command360-reconcile.ts`, `src/lib/command/router/observable-execution.ts`, `src/lib/command/router/completion-receipt.ts`, `src/services/outlook-observable-mapping.ts` | **PARTIAL, provider-scoped** |
| **Execution receipt** | Three separate shapes: `src/lib/provider-adapters/microsoft/execution-receipt.ts` (+ `receipt-integrity.ts`), `src/lib/command/router/completion-receipt.ts`, `src/lib/workforce-intelligence/recommendation-ledger.ts` | **PRESENT, fragmented** |
| **Idempotency** | Enforced per-write, not centrally: `src/lib/actions/assignment.ts` (`p_idempotency_key` → RPC), `src/lib/actions/workforce-recommendation.ts` (`workforceRecommendationIdempotencyKey` + `idempotency_key` column), `src/lib/actions/threads.ts` (payload-key dedupe). `contracts/actions/action-registry.json` carries an `idempotency` dimension | **PRESENT, per-authority** |
| **Learning** | `LEARNING` authority — `src/lib/ai360/learning.ts`, purpose *"Learning-signal derivation (terminal; no sink)"*, invariant **`terminal_no_sink`**. Kernel type `LearningSignal` (`src/os/bootstrap/types.ts:126`) = `{intentGoal, intentConfidence, outcome, allowed, realityChanged, emittedAt}`, emitted once per `ExecutionContract` | **PRESENT, canonical, deliberately sink-less** |
| **Memory admission** | **Does not exist.** `grep "memory_admission\|memoryAdmission\|memory-admission"` → 0 hits. No memory authority among the 41 | **ABSENT** |
| **MCP** | **Does not exist.** `grep -rI "modelcontextprotocol\|\bMCP\b"` over `src`, `package.json`, `docs/ai` → 0 hits | **ABSENT** |

---

## C. SDCP attachment point

There is no SDCP to attach to. The closest thing to an SDCP-qualified context
envelope that literal-current LAWRENCE produces is the **pair** consumed by the
CommandRouter, per `docs/context-architecture.md`:

```text
CanonicalIntent          (what the user wants)   — src/core/intent
CanonicalSessionContext  (what they are doing)   — resolveContext
```

Concept identity for those references is owned by
`contracts/ontology/operational-ontology.json` (objects + `relationshipTypes`)
and `src/lib/EnterpriseObjectRegistry360.ts` (object existence and ownership).

**Ruling for Prompt 0.5:** `domain_concept_refs` and `supported_intent_refs` must
resolve against `operational-ontology.json` / `EnterpriseObjectRegistry360` and
`CanonicalIntent` respectively. Do **not** introduce
`semantic_domain_registry_v1.0.json`; the ontology already carries the note
*"CONVERGENCE, not a new registry. Every object binds to an EXISTING constitution
authority… No table is invented."* A new semantic registry would violate that
contract on arrival.

---

## D. Capability Fabric attachment point

`src/lib/provider-adapters/contract.ts` — the `CONNECTORS` authority. It is the
correct seam and it is already fenced by its own header:

> Provider adapters translate already-governed commands into external provider
> API calls and normalize provider responses back into Runtime event envelopes.
> They do not decide, rank, approve, plan, orchestrate missions, own state, own
> evidence, or mutate governed objects directly.

It exports a provider-neutral vocabulary that already anticipates most of what
Prompt 3 will need: `ProviderAdapterHealthStatus` (healthy/degraded/unavailable/
unknown), `ProviderValidationStatus`, `ProviderExecutionStatus` (13 members incl.
`rate_limited`, `timed_out`, `unauthorized`, `refused`, `context_exceeded`,
`fallback_served`), and `ProviderExecutionTelemetry` explicitly marked
*"observational only… does not authorize retries, choose providers, own routing,
create a resilience runtime"*.

The one already-working substitution precedent is
`src/lib/provider-adapters/embeddings/index.ts::resolveEmbeddingAdapter` —
deterministic two-provider resolution (`synthetic` default, `openai` only on
explicit `allowNetwork:true` + API key, lazily imported), with
`assertEmbeddingIdentity` rejecting a synthetic vector that tries to pass as
production. That is the shape Prompt 1 needs, one level below the business
capability.

---

## E. Governance / DecisionEnvelope / `routeAction` attachment point

**Governance — clean.** `PolicyEngine` + `AuthorityModel` + `stage-gates` +
`contracts/admission/admission-contract.json`. The admission contract already
decomposes *"May this actor execute this business decision on this object in its
current state using these parameters and evidence under the applicable policy at
this moment?"* across 19 dimensions, each bound to an existing mechanism, and
states that Decision360 owns authorization exclusively. Attach here; add nothing.

**DecisionEnvelope — contradicted.** See B. Two envelopes exist with different
shapes and different owners. Prompt 4 instructs *"Do not create a parallel
Capability Fabric authorization envelope"* — but a parallel envelope already
exists, and Prompt 4 does not say which of the two is canonical.

**`routeAction` — the authority does not exist.** The program treats
`routeAction` as *"the mutation-admission authority"* through which *"all
consequential execution must enter"*. In literal-current LAWRENCE it is a
private plan-builder inside a read-only router. The real mutation-admission
boundary is:

```text
requireUser()
  → ActionResult<T> server action  (mutationBoundary.allow)
    → record_* SECURITY DEFINER RPC  (state guards, atomic, minimal-touch)
      → emit_lifecycle_event → Event360  (immutable, spine-only)
        → revalidatePath
```

Prompt 4 must be restated against that chain, or `routeAction` must be created
as a genuine admission authority by explicit owner decision. Writing Prompt 4
literally against today's `routeAction` would produce a Capability-Fabric write
path that does **not** cross the real mutation boundary — manufacturing exactly
the FATAL 2 bypass the program forbids.

---

## F. Reconciliation / Reality Delta attachment point

There is no canonical `reconciliation_contract_ref` target today.

- The only worked expected-vs-observed comparison is
  `reconcileOutlookInterview` — and it is genuinely good: it models
  `unobserved` as distinct from `absent`, which is precisely the
  `NOT_YET_OBSERVABLE` vs `CONTRADICTED` distinction Prompt 5 requires. It is
  provider-scoped, not general.
- `src/lib/reality-delta.ts` is a **derived projection over the event stream** —
  "what changed in the business since you last looked", classified by
  significance/consequence/valence and grouped for a briefing feed. It is not a
  record of *expected execution vs observed outcome*.

**Ruling for Prompt 0.5:** `reconciliation_contract_ref` cannot point at
`src/lib/reality-delta.ts` without silently redefining it. Either the Outlook
reconciliation shape is generalized into a canonical contract, or the owner
rules that a new `RECONCILIATION` constitutional authority is registered. That
decision belongs to P0.5 and must be recorded, not assumed.

---

## G. Learning / memory-admission attachment point

`learning_admission_ref` → the `LEARNING` authority (`src/lib/ai360/learning.ts`),
whose invariant `terminal_no_sink` is already the exact property the program
wants: a learning signal is derived and goes nowhere durable.

`LEARNING SIGNAL ≠ MEMORY` is therefore currently true **by absence** — there is
no memory authority to leak into. The correct P0.5 action is to record that
absence as a contract (`memory admission: NOT IMPLEMENTED — no durable sink
exists; any future sink requires a new registered authority`), **not** to create
a memory authority in order to have something to reference.

---

## H. Duplicate-authority risks

### H1 — CRITICAL · the word "capability" is already a domain concept
`OWNER_RULING_REQUIRED`

In literal-current LAWRENCE, **a "capability" is a candidate's skill**. There are
`capabilities` and `capability_evidence` tables, plus
`src/lib/queries/capabilities.ts` (`listCapabilities`,
`candidateResumeCapabilityIds`, `getCandidateCapabilitySummary`),
`src/lib/capability-extract.ts`, `capability-summary.ts`,
`capability-confidence.ts`, `src/lib/facts/producers/capability-facts.ts`, and
`src/lib/ai-capabilities/gateway.ts`.

Introducing "Capability" to mean *executable canonical operation* puts two
incompatible meanings on one word **inside the domain ontology**. This is the
FATAL 1 condition (`NO SECOND BUSINESS-SEMANTIC RESOLVER`) arriving through
naming rather than through logic, and no amount of careful layering fixes it
afterward. The owner must rule on a distinct term before P0.5 authors
`required_capability_refs` / `permitted_capability_refs` /
`capability_input_semantics` / `capability_output_assertion_class`.

### H2 — HIGH · `DecisionEnvelope` is already duplicated
`CONVERGE` · blocks Prompt 4

`src/core/intent/types.ts:420` vs `src/os/contracts/ExecutionContract.ts:39`.
Prompt 4 requires binding into "the existing DecisionEnvelope authority" — there
are two, and the program does not name a winner.

### H3 — HIGH · `routeAction` is not a mutation authority
`OWNER_RULING_REQUIRED` · blocks Prompt 4

See E. Either restate Prompt 4 against `record_*` RPCs, or create the authority
deliberately.

### H4 — MEDIUM · `RealityDelta` name collision
`OWNER_RULING_REQUIRED` · blocks Prompt 5

See F. Prompt 5 says "reuse the existing Reality Delta authority"; reusing this
one would redefine a live, UI-bound concept.

### H5 — MEDIUM · a second planning surface already exists
`CONVERGE` · affects Prompt 2

`src/lib/query-planner/*` has its own intent (`query-intent.ts`), policy
(`planner-policy.ts`), strategy engine, execution strategy, explain, metrics, and
telemetry. Prompt 2's "bounded capability plan" must explicitly subordinate to or
reuse it, or LAWRENCE gains two planners.

### H6 — MEDIUM · two intent surfaces already
`CONVERGE`

`CanonicalIntent` (`src/core/intent/canonical.ts`) and `MissionIntent`
(`src/core/intent/types.ts`) coexist; `ExecutionContract` carries `MissionIntent`
while the router carries `CanonicalIntent`. `src/lib/query-planner/query-intent.ts`
is a third. The Fabric must consume one, named explicitly.

### H7 — MEDIUM · `searchTalent` is already a second semantic resolver
`CONVERGE` · pre-existing FATAL-1 condition

See the trace below. `searchTalent` re-parses the operator's raw string with
`extractCriteria(query, vocab)` instead of consuming `CanonicalIntent`. The
condition Prompt 6 FATAL 1 forbids **already exists on the exact read path
Slice 1 wants to use**, before any Capability Fabric code is written.

### H8 — LOW · no MCP, no memory authority, one evidence store, one event spine
`KEEP`

Four of the program's hardest guarantees are currently satisfied and must simply
not be broken: MCP is absent entirely, memory admission has no implementation,
`EVIDENCE` carries an explicit "no parallel store" invariant, and `EVENT-360`
carries `events_via_spine_only` + `immutable_events` with a static allowlist.

### Reuse classification summary

| Disposition | Items |
| --- | --- |
| `KEEP` | Event360 spine · EVIDENCE (no parallel store) · constitution + 41-authority registry · stage-gates · `record_*` RPC boundary · `requireUser()` · `CanonicalSessionContext` + `resolveContext` · CORE-INTENT · absence of MCP · absence of memory authority |
| `EXTEND` | `src/lib/provider-adapters/contract.ts` (capability reference fields) · `contracts/ontology/operational-ontology.json` (concept refs) · `contracts/admission/admission-contract.json` (provider-result admission dimension) |
| `WRAP` | `provider-adapters/embeddings/*` · `provider-adapters/microsoft/*` · `src/lib/actions/talent-search.ts` |
| `CONVERGE` | DecisionEnvelope ×2 → 1 · execution receipt ×3 → 1 · reconciliation (Outlook-local → general) · intent surfaces ×3 → 1 · planning surfaces ×2 → 1 |
| `DEPRECATE_LATER` | none identified in this slice |
| `OWNER_RULING_REQUIRED` | H1 "capability" naming · H3 `routeAction` · H4 `RealityDelta` naming |

---

## Required current-state trace

Capability chosen: the `SEARCH` authority's talent search — *"Find known people
who may fit this Job."* Constitution `SEARCH`: *"Search/boolean/ranking/matching
(read-only)"*, `rpc: none (read-only) — hands to SUBMISSION-360`, invariants
`deterministic_by_default`, `advisory_unless_approved`.

```text
BUSINESS SIGNAL
  operator query on a job / talent surface

CURRENT SEMANTIC RESOLUTION
  src/core/intent/* → CanonicalIntent (goal, entities, constraints, confidence)
  ⚠ but searchTalent() does NOT consume CanonicalIntent. It re-parses the raw
    string itself: extractCriteria(query, vocab)  (src/lib/talent-match.ts:221)
    → SECOND BUSINESS-SEMANTIC RESOLVER, present today  [H7]

CURRENT OBJECT RESOLUTION
  requireUser() → request-scoped supabase client   (Hard Rule 9)
  skills vocabulary ← `skills`; candidate skills ← `candidate_skills`

CURRENT CONTEXT
  CanonicalSessionContext is resolved for the router but is NOT passed into
  searchTalent — the read path is context-free

CURRENT SERVICE / FUNCTION
  src/lib/actions/talent-search.ts :: searchTalent(query, …)
    → ActionResult<TalentSearchOutput>          (Hard Rule 5)

CURRENT PROVIDER
  Supabase Postgres, single provider, no adapter boundary.
  A second retrieval path exists but is unconnected: candidates.embedding
  vector(1536) + HNSW cosine, fed by provider-adapters/embeddings

CURRENT RESULT
  rows → ScoredCandidateInput[]

CURRENT NORMALIZATION
  pure engine: extractCriteria → rankTalent → TalentMatchResult[]
  TALENT_SEARCH_LIMIT = 20  (src/lib/talent-match.ts:470)

CURRENT EVIDENCE
  none. No Evidence record, no provenance, no retrieval timestamp, no receipt.

CURRENT CANONICAL AUTHORITY
  none written. SEARCH is read-only and "hands to SUBMISSION-360".
```

Two consequences follow directly:

1. **The FATAL-1 condition already exists on this path** (H7). Slice 1 cannot
   "hold domain meaning constant by a fixed SDCP-qualified context envelope"
   while `searchTalent` derives its own meaning from raw text.
2. **`provider_result_admission` has nothing to converge into on this
   capability.** The path emits no evidence and no provenance, so P0.5's
   requirement to "converge into existing evidence/provenance authorities" means
   wiring this read path into `src/lib/evidence/*` for the first time — real
   work, correctly scoped to P0.5/P1, not assumable.

---

## Required questions — answers

| # | Question | Answer |
| --- | --- | --- |
| 1 | Where is business meaning currently resolved? | Split. `CORE-INTENT` (`src/core/intent/*`) is canonical; `contracts/ontology/operational-ontology.json` + `EnterpriseObjectRegistry360` own concept identity; but `talent-match.ts::extractCriteria` and `query-planner/query-intent.ts` resolve meaning independently. |
| 2 | Where are canonical object references resolved? | `EnterpriseObjectRegistry360.ts` (existence/ownership), `operational-ontology.json` (objects + relationships), `CanonicalEntityReference` (`src/core/intent/canonical.ts:107`), `CanonicalSessionContext.entityType/entityId`. |
| 3 | Does an SDCP or equivalent qualified context already exist? | **No SDCP.** The functional equivalent is `CanonicalIntent` + `CanonicalSessionContext`, but it carries no purpose, temporal qualification, or disclosure fields, and no capability references. |
| 4 | Where can Capability Fabric attach without recreating semantic resolution? | `src/lib/provider-adapters/contract.ts` (CONNECTORS), below the CommandRouter and above the adapters. |
| 5 | Which current operations are already de facto canonical capabilities? | `searchTalent`, `rankTalent`, `rankRediscovery` (SEARCH); `resolveEmbeddingAdapter` (embedding); the Outlook calendar adapter's schedule/cancel; the `record_*` RPC family (writes); the `contracts/actions/action-registry.json` governed-action set. |
| 6 | Where do provider-specific schemas leak into domain/UI code? | Contained today. `provider-adapters/microsoft/outlook-types.ts` is adapter-local; `check:provider-sdk-boundaries` enforces it; `ProviderExecutionStatus` is deliberately provider-neutral. The embedding provider identity is exposed as provenance, which is correct. **No known leak into UI.** |
| 7 | Which existing provider paths can implement the same read capability? | Two, both real and both in-repo: (A) lexical/vocabulary ranking over `candidate_skills` (`searchTalent`); (B) pgvector HNSW cosine over `candidates.embedding` via `resolveEmbeddingAdapter`. |
| 8 | Where does policy currently sit relative to invocation? | Before it, on the write path (`requireUser()` → action → `record_*` guards → gates). On the read path, effectively **only RLS** — SEARCH has no per-invocation policy evaluation. |
| 9 | Where do consequential writes cross DecisionEnvelope / `routeAction`? | **Nowhere.** They cross `requireUser()` → server action → `record_*` SECURITY DEFINER RPC → `emit_lifecycle_event`. `routeAction` is not on any write path. The kernel path (`KernelDecisionEnvelope` → `StateTransition` → `EventSpine`) is separate and not the product write path. |
| 10 | Where are idempotency guarantees enforced? | Per-write: `record_*` RPC state guards; `p_idempotency_key` (`actions/assignment.ts`); `idempotency_key` column (`actions/workforce-recommendation.ts`); payload-key dedupe (`actions/threads.ts`); `idempotency` dimension in `contracts/actions/action-registry.json`. No central enforcer. |
| 11 | Where do execution receipts live? | Three shapes: `provider-adapters/microsoft/execution-receipt.ts` (+ `receipt-integrity.ts`), `command/router/completion-receipt.ts`, `workforce-intelligence/recommendation-ledger.ts`. |
| 12 | Where does Reality Delta live? | `src/lib/reality-delta.ts` — but it is a derived event-stream projection, **not** expected-vs-observed reconciliation. [H4] |
| 13 | Where are observed outcomes reconciled? | Only `provider-adapters/microsoft/reconciliation.ts` (Outlook), plus `services/command360-reconcile.ts` and `command/router/observable-execution.ts`. No general runtime. |
| 14 | How are learning signals admitted? | `LEARNING` authority, `src/lib/ai360/learning.ts`, invariant `terminal_no_sink`. Kernel emits one `LearningSignal` per `ExecutionContract`. There is no admission *gate* — there is no sink to gate. |
| 15 | Is there memory admission distinct from learning generation? | **No — and no memory authority at all.** `LEARNING ≠ MEMORY` holds by absence. |
| 16 | Smallest real slice proving provider substitution without semantic duplication? | See I. |

---

## I. Exact Slice 1 boundary (for when it is reached — after P0.5)

```text
one SDCP-qualified context
  frozen fixture: CanonicalSessionContext{entityType:"job", entityId:<fixture>}
  + CanonicalIntent{goal: find-candidates-for-job}
  + purpose / temporal / disclosure fields added by P0.5
  Consumed as-is. searchTalent must stop re-parsing raw text. [H7]

one canonical read capability
  the SEARCH authority's "known people who may fit this Job"
  input semantics:  job canonical_object_ref (+ constraints from the intent)
  output assertion class: OBSERVATION / INFERENCE  (never Person, never canonical)
  normalized contract: TalentMatchResult[]  (held invariant across providers)

two real providers
  A. postgres.lexical  — candidate_skills vocabulary ranking (today's searchTalent)
  B. postgres.pgvector — HNSW cosine over candidates.embedding,
                         embeddings resolved via resolveEmbeddingAdapter

provider substitution
  identical context + identical capability request through A, then B.
  Invariant:  domain concept · intent · purpose · object refs · capability ·
              input semantics · output assertion class · policy scope
  Varies only: provider_ref · provider-native request/response · provider
              evidence · provenance · receipt
  Zero diff in src/app/** and src/components/**.
```

**Why this slice and not another.** Both providers already exist in the
repository. Neither requires a new vendor, new credentials, or network egress in
CI (`resolveEmbeddingAdapter` defaults to the deterministic synthetic adapter and
refuses OpenAI without explicit `allowNetwork:true`). The capability is
read-only, so no write authority is touched. `SEARCH` is already a registered
constitutional authority with `advisory_unless_approved`, so the assertion-class
constraint is already law rather than a new invention.

**Stated weakness the owner should rule on.** A and B are two retrieval
*implementations* over the same datastore, not two independent vendors. That is
sufficient to prove *capability ≠ provider* structurally, and it is the safest
first proof. It is not sufficient to prove vendor independence. If the owner
requires a genuinely external second provider, the honest alternative is the
Outlook calendar capability — but that is a write path and belongs to Prompt 4,
not Slice 1.

---

## J. Verdict

```text
BLOCKED_BY_AUTHORITY_CONTRADICTION
```

Slice 1 is **not** justified yet. Three contradictions, all pre-existing and
none created by this program, must be ruled on before any Capability Fabric code
is written:

1. **H1 — "capability" already means "candidate skill"** in the domain ontology
   and in live tables. Authoring the ten bindings under that word writes a
   second meaning for a domain concept into the semantic layer. `OWNER_RULING_REQUIRED`.
2. **H2/H3 — the mutation-admission authority the program names does not exist,
   and the envelope it names exists twice.** `routeAction` is a private
   read-only plan builder; `DecisionEnvelope` has two incompatible definitions.
   Prompt 4 is unexecutable as written.
3. **H4 — `RealityDelta` already denotes a different concept.** Prompt 5's
   "reuse the existing Reality Delta authority" would redefine a live, UI-bound
   projection.

Additionally noted, not blocking: **H7** — the chosen read path already contains
a second business-semantic resolver, which Slice 1 must remove rather than
inherit.

### What unblocks it

**Prompt 0.5 is the correct next invocation**, and its entry condition is
satisfied by the alternate clause — *"or has otherwise established sufficient
literal-current evidence to identify"* the ten authorities — every one of which
is located above, including the three located as **absent** (SDCP, memory
admission, general reconciliation) and the one located as **misnamed**
(`routeAction`).

Prompt 0.5 must open by recording owner rulings on H1, H3, and H4 before
authoring any binding. It must not resolve them by choosing quietly.

**STOP. Slice 1 not implemented.**
