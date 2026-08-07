# LAWRENCE CAPABILITY FABRIC — MASTER PROMPT SERIES v2.1

## AMENDMENT RECORD — insertion of PROMPT 0.5

Status: **ADOPTED**
Supersedes: Master Prompt Series v2 (seven prompts)
Effect: the program is now **eight steps**. The one-slice / one-branch / one-PR /
one-READY discipline is unchanged.

---

## 1. Why the amendment exists

Master Prompt Series v2, Prompt 2 ("CONTEXT-QUALIFIED CAPABILITY DISCOVERY +
PLANNING") contained this clause under REGISTRY INTEGRATION:

> If these are not yet represented in the current SDCP specification, implement
> only the smallest bounded integration contract necessary for this slice.

That clause let a single implementation slice own all of:

```text
SDCP protocol modification
+ capability registry integration
+ semantic candidate retrieval
+ capability validation
+ dependency closure
+ planning
+ execution
```

That is too much authority movement for one bounded slice, and it is the only
route by which the Capability Fabric could quietly acquire business-semantic
authorship — the FATAL 1 failure mode of Prompt 6, arriving as scope creep rather
than as an explicit design decision.

The remedy is to move contract authorship into its own slice **before** any
Fabric behavior is built, and to strip Prompt 2's permission to invent.

---

## 2. Sequencing ruling

Prompt 0.5 is inserted into the program **before execution begins**, but it
**runs after Prompt 0**, because Prompt 0 discovers the literal-current
authorities that Prompt 0.5 is permitted to bind. Prompt 0.5 may bind only what
Prompt 0 has evidenced.

---

## 3. Revised program map

```text
CURRENT
│
├─ P0    Authority Preflight
│        "What already owns this?"
│        DISCOVER THE AUTHORITIES
│
└─ P0.5  Semantic / Capability Contract Convergence
         "How may the Fabric attach?"
         BIND THE AUTHORITIES
              ↓
CONVERGE
│
├─ P1    Fixed SDCP Context + Provider Substitution
│        "Capability ≠ Provider"
│        PROVE PROVIDER SUBSTITUTION
│
├─ P2    Context-Qualified Discovery + Planning
│        "SDCP-qualified intent → bounded capabilities"
│        PROVE CAPABILITY COMPOSITION
│
└─ P3    Competition + Health + Bounded Fallback
         "Equivalent providers may change; meaning may not"
         PROVE RESILIENT PROVIDER RESOLUTION
              ↓
ACTIVATE
│
├─ P4    Consequential Proposal
│        → Governance → Human Authorization
│        → DecisionEnvelope → routeAction → Idempotent Execution
│        PROVE GOVERNED ACTUATION
│
└─ P5    Independent Observation
         → Reconciliation → Reality Delta
         → SDCP Successor Context → Governed Learning → Memory Admission
         PROVE REALITY RECONCILIATION
              ↓
TARGET
│
└─ P6    Golden Journey + Adversarial Certification
         CERTIFY THE CLOSED LOOP
```

---

## 4. Runtime correction — provider result admission is a boundary, not metadata

Section 2 of the v2 program (CANONICAL INTEGRATED RUNTIME) already placed
normalized provider results into bounded assertion classes rather than canonical
truth, and the program-wide invariants already prohibited
`PROVIDER RESULT ≠ CANONICAL TRUTH`. The correction makes the admission step
**visible in the runtime itself**, so `provider_result_admission` is enforced at
runtime rather than merely declared in a registry.

**Before (v2):**

```text
NORMALIZED PROVIDER RESULT
      ↓
EVIDENCE / OBSERVATION / INFERENCE / RECOMMENDATION
```

**After (v2.1) — binding:**

```text
PROVIDER INVOCATION
      ↓
PROVIDER-NATIVE RESULT
      ↓
NORMALIZATION
      ↓
PROVIDER RESULT ADMISSION      ← explicit runtime boundary
      ↓
EVIDENCE / OBSERVATION / INFERENCE / RECOMMENDATION
```

This replaces the corresponding segment of the canonical integrated runtime in
§2 of the v2 program. Everything above `PROVIDER INVOCATION` and below the
assertion classes is unchanged.

---

## 5. The ten bindings

Prompt 0.5 owns authorship of exactly these integration references:

```text
domain_concept_refs
supported_intent_refs
required_capability_refs
permitted_capability_refs
capability_input_semantics
capability_output_assertion_class
provider_result_admission
observation_capability_refs
reconciliation_contract_ref
learning_admission_ref
```

---

## 6. Consequential edit to PROMPT 2

The REGISTRY INTEGRATION clause of Prompt 2 is **repealed and replaced**.

**Repealed text:**

> If these are not yet represented in the current SDCP specification, implement
> only the smallest bounded integration contract necessary for this slice.
> Do not freeze a broader `semantic_domain_registry_v1.0.json` prematurely.

**Replacement text (binding from v2.1):**

> The ten SDCP ↔ Capability Fabric integration references are authored by
> Prompt 0.5 and are already merged before Prompt 2 begins. Prompt 2 may
> `READ`, `REFERENCE`, `VALIDATE AGAINST`, and `CONSUME` them. Prompt 2 may
> **not** define, rename, reinterpret, version, or extend them.
>
> If Prompt 2 discovers a genuinely missing contract:
>
> ```text
> STOP
> → report prerequisite contradiction
> ```
>
> Do not expand SDCP inside the capability-planning PR.

Prompt 2's READY conditions gain one line:

```text
✓ no SDCP ↔ Capability Fabric integration reference was defined or modified by this slice
```

---

## 7. PROMPT 0.5 — verbatim

> The text below is the adopted prompt as authored by the charter owner. It is
> reproduced without alteration and is the authority for the P0.5 slice.

---

### PROMPT 0.5 — CURRENT → CONVERGE BOUNDARY
### SDCP ↔ CAPABILITY FABRIC CONTRACT CONVERGENCE
### BIND EXISTING AUTHORITIES — DO NOT BUILD THE FABRIC

#### ENTRY CONDITION

Prompt 0 has completed and returned:

```text
SLICE_1_JUSTIFIED
```

or has otherwise established sufficient literal-current evidence to identify:

- the canonical SDCP / semantic authority,
- the existing context-envelope authority,
- canonical intent/object references,
- the Capability Fabric attachment point,
- Governance Kernel boundaries,
- DecisionEnvelope / `routeAction`,
- provider-result/evidence admission,
- Reconciliation Runtime / Reality Delta,
- learning admission,
- memory admission.

Refresh literal current `main`.
Do not stack on an unmerged branch.

This invocation is:

```text
ONE bounded semantic/capability contract slice
ONE branch
ONE PR
ONE READY stop
```

#### 0. PURPOSE

Create the smallest executable contract boundary between the existing Semantic
Domain Context Protocol and the future Capability Fabric.

This prompt does NOT build:

```text
provider routing
provider competition
provider health
fallback
semantic capability retrieval
capability planning
consequential writes
authorization workflows
outcome reconciliation
learning behavior
```

Its sole purpose is:

Make it structurally impossible for Capability Fabric implementation to become a
second business-semantic authority.

The Capability Fabric must be able to consume SDCP-qualified semantics later
without redefining them.

#### 1. CANONICAL AUTHORITY LAW

The following division is binding:

```text
SDCP
OWNS MEANING

Capability Fabric
REFERENCES MEANING AND RESOLVES MEANS

Governance Kernel
OWNS PERMISSION

DecisionEnvelope + routeAction
OWNS MUTATION ADMISSION

Domain Authorities + Event Spine
OWN CANONICAL TRUTH

Reconciliation Runtime
OWNS EXPECTED ↔ OBSERVED COMPARISON

SDCP Reconciliation
OWNS SUCCESSOR-CONTEXT MEANING

Governed Learning
OWNS ADMISSIBLE LEARNING SIGNALS

Memory Admission
OWNS DURABLE REUSE
```

Therefore:

```text
DOMAIN MEANING ≠ CAPABILITY
CAPABILITY ≠ PROVIDER
PROVIDER ≠ AUTHORITY
LEARNING ≠ MEMORY
```

#### 2. REQUIRED SDCP ↔ CAPABILITY FABRIC BINDINGS

Converge or define exactly these integration references using existing
repository authorities wherever possible:

```text
domain_concept_refs
supported_intent_refs
required_capability_refs
permitted_capability_refs
capability_input_semantics
capability_output_assertion_class
provider_result_admission
observation_capability_refs
reconciliation_contract_ref
learning_admission_ref
```

Do not expand the contract beyond what Prompt 0 evidence demonstrates is
required. Do not create speculative domains, capabilities, providers, or
ontology.

#### 3. `domain_concept_refs`

Purpose: reference canonical SDCP-owned domain concepts relevant to a governed
context.

Contract:

```text
Capability Fabric MAY reference domain_concept_refs.

Capability Fabric MUST NOT define,
rename,
reinterpret,
duplicate,
or version business meaning independently.
```

If literal-current LAWRENCE already has canonical concept identifiers, use them.
Do not introduce a competing concept namespace.

Example shape only:

```json
{
  "domain_concept_refs": [
    "recruiting.job",
    "recruiting.person"
  ]
}
```

Repository truth takes precedence over example naming.

#### 4. `supported_intent_refs`

Purpose: reference SDCP-owned business intents that are valid in the governed
context.

Required rule:

```text
SDCP determines the intent.
Capability Fabric consumes the intent reference.
```

Forbidden:

```text
raw prompt
→ Capability Fabric creates new business intent
```

Required:

```text
business signal
→ SDCP intent resolution
→ supported_intent_ref
→ later capability discovery
```

No capability, provider, model, MCP server, or adapter may create a competing
intent authority.

#### 5. `required_capability_refs`

Purpose: allow SDCP/domain contracts to state that specific canonical
capabilities are semantically required for a qualified intent.

```text
qualified intent
+
domain context
→ requires capability X
```

Capability Fabric planning may determine valid ordering and execution
implementation later. It may not silently omit an SDCP-required capability.

Do not populate speculative requirements. Only encode requirements supported by
current domain contracts.

#### 6. `permitted_capability_refs`

Purpose: establish the maximum semantically admissible capability boundary for
the current governed context where such restriction is required.

Canonical law:

```text
SEMANTIC SIMILARITY
does not expand
PERMITTED CAPABILITY SCOPE
```

Later semantic retrieval may find a highly similar capability. If that
capability is outside the permitted context boundary:

```text
NOT ADMITTED
```

unless SDCP/context authority explicitly changes.

#### 7. `capability_input_semantics`

Purpose: define how SDCP-qualified concepts and canonical object/context
references may bind to canonical capability inputs.

```json
{
  "capability_input_semantics": {
    "some.capability": {
      "job_ref": {
        "concept_ref": "recruiting.job",
        "binding": "canonical_object_ref"
      }
    }
  }
}
```

Provider-native input fields do NOT belong here.

Forbidden examples:

```text
linkedin_project_id
zoominfo_query
vendor_specific_filter
postgres_where_clause
MCP_tool_argument_name
```

unless they are already canonical business semantics independently of that
provider. Provider translation belongs below the capability/provider adapter
boundary.

#### 8. `capability_output_assertion_class`

Purpose: define the highest epistemic status a capability output may claim when
entering governed LAWRENCE context.

Support the smallest required bounded vocabulary based on current authorities,
conceptually including:

```text
EVIDENCE
OBSERVATION
INFERENCE
RECOMMENDATION
```

Critical rule:

```text
CAPABILITY OUTPUT ASSERTION
≠
CANONICAL TRUTH
```

A provider/capability result must not directly assert:

```text
canonical state
authorized decision
observed business outcome
```

unless admitted through the authority that owns that state transition.

#### 9. `provider_result_admission`

This MUST become an explicit runtime boundary — not merely registry metadata.

Canonical path:

```text
PROVIDER INVOCATION
      ↓
PROVIDER-NATIVE RESULT
      ↓
NORMALIZATION
      ↓
PROVIDER RESULT ADMISSION
      ↓
EVIDENCE / OBSERVATION / INFERENCE / RECOMMENDATION
```

NOT:

```text
provider result
→ canonical object mutation
```

The admission contract must preserve at least the existing canonical
equivalents of:

```text
provider identity
external reference
provenance
retrieval / observation time
freshness
assertion class
confidence where applicable
canonical correlation where already established
```

Do not create a second evidence store to achieve this. Converge into existing
evidence/provenance authorities.

#### 10. `observation_capability_refs`

Purpose: reference canonical read capabilities that may later observe the
external consequence of an execution.

Do not implement the observation capability in this prompt unless one already
exists and only registration/reference convergence is required.

The contract must preserve:

```text
EXECUTION CAPABILITY
≠
OBSERVATION CAPABILITY
```

Where the same provider eventually supplies both, later runtime must classify
observation independence honestly.

#### 11. `reconciliation_contract_ref`

Purpose: reference the canonical reconciliation contract responsible for
comparing expected and observed reality.

Required boundary:

```text
Execution Receipt
+
Independent Observation
→ Reconciliation Runtime
→ Reality Delta
```

Capability Fabric MUST NOT own reconciliation semantics.

Do not create:

```text
CapabilityFabricRealityDelta
ProviderRealityDelta
ToolDelta
```

or equivalent parallel authorities. Reference the existing Reconciliation /
Reality Delta authority identified by Prompt 0.

#### 12. `learning_admission_ref`

Purpose: reference the governed contract controlling what reconciled reality may
emit as a learning signal and what that signal may influence.

Required sequence:

```text
reconciled outcome
→ governed learning signal
→ learning admission
→ optional memory admission
```

Never:

```text
provider result
→ learning
→ permanent memory
```

Freeze:

```text
LEARNING SIGNAL ≠ POLICY
LEARNING SIGNAL ≠ AUTHORITY
LEARNING SIGNAL ≠ AUTONOMY
LEARNING SIGNAL ≠ MEMORY
```

#### 13. PROVIDER SEMANTIC FIREWALL

Prove structurally that providers cannot redefine:

```text
domain concepts
business intents
canonical object meaning
purpose
temporal qualification
disclosure
capability meaning
capability input semantics
capability output assertion class
policy scope
authorization scope
```

Providers may later implement capabilities. They may not define the meaning of
those capabilities.

```text
PROVIDER
IMPLEMENTS MEANS

PROVIDER
DOES NOT DEFINE MEANING
```

#### 14. FALLBACK CONTRACT PREPARATION

Do NOT implement fallback. Establish only the semantic invariance contract that
Prompt 3 must later consume.

A future provider substitution/fallback may vary:

```text
provider_ref
provider evidence
provider provenance
provider receipt
provider health
provider attempt history
```

It may not vary:

```text
domain_concept_refs
supported intent
canonical object refs
purpose
capability ID
capability version
capability input semantics
capability output assertion class
policy scope
authorization scope
```

If one of those semantic or governance properties changes:

```text
THIS IS NOT FALLBACK
```

It is a new context, new plan, or new authorization decision.

#### 15. DO NOT FREEZE THE FULL DOMAIN REGISTRY YET

This prompt must NOT prematurely freeze:

```text
semantic_domain_registry_v1.0.json
```

unless literal-current evidence proves that every contract contained within it
is already mature and required by this bounded slice.

Preferred behavior:

```text
define / converge proven integration contract
→ test it
→ use it in P1/P2/P3
→ certify it
→ only then freeze broader semantic registry
```

No speculative registry expansion.

#### 16. PROMPT 2 AUTHORITY REMOVAL

After this PR merges, Prompt 2 loses authority to invent or modify these
semantic/capability integration concepts opportunistically:

```text
domain_concept_refs
supported_intent_refs
required_capability_refs
permitted_capability_refs
capability_input_semantics
capability_output_assertion_class
provider_result_admission
observation_capability_refs
reconciliation_contract_ref
learning_admission_ref
```

Prompt 2 may:

```text
READ
REFERENCE
VALIDATE AGAINST
CONSUME
```

them. Prompt 2 may NOT redefine their ownership or semantics.

If Prompt 2 discovers a real missing contract:

```text
STOP
→ report prerequisite contradiction
```

Do not "helpfully" expand SDCP inside the capability-planning PR.

#### 17. REQUIRED TEST MATRIX

Prove at minimum:

- **A. Concept authority** — capability registration can reference an SDCP
  concept; it cannot independently redefine that concept.
- **B. Intent authority** — a capability may reference a canonical SDCP intent;
  it cannot create an alternate intent with equivalent wording and different
  semantics.
- **C. Capability bounds** — required/permitted capability references are
  enforceable where present.
- **D. Input semantics** — canonical capability bindings accept SDCP-qualified
  references; provider-native fields remain outside the semantic contract.
- **E. Assertion class** — provider output cannot exceed the assertion class
  declared for the capability.
- **F. Provider admission** — provider-native output must cross
  `normalize → provider_result_admission` before entering governed context.
- **G. Canonical truth protection** — attempt direct provider-result →
  canonical-state admission. Expected: `REJECT / BLOCK` through the
  repository's existing authority mechanism.
- **H. Reconciliation reference** — observation/reconciliation references point
  to canonical Reconciliation / Reality Delta authority. No duplicate authority.
- **I. Learning reference** — learning contract cannot directly produce durable
  memory.
- **J. Semantic isolation** — a fake/new provider identifier must not appear in
  the canonical domain concept ontology merely because the provider implements a
  capability.

#### 18. AUTHORITY RED-TEAM

Search the resulting diff for accidental creation of:

```text
second domain-semantic registry
second intent resolver
second canonical object taxonomy
provider-owned domain concepts
MCP-owned business semantics
capability-owned domain semantics
second evidence authority
second Reality Delta authority
second learning authority
second memory authority
```

Any such duplication blocks READY.

#### 19. EXPLICIT NON-GOALS

Do not implement:

```text
provider invocation
provider substitution
provider ranking
provider competition
provider health
fallback
semantic vector retrieval
capability planning
agent planning
consequential execution
DecisionEnvelope changes unrelated to references
routeAction changes unrelated to contract compatibility
outcome observation
reconciliation behavior
learning behavior
memory writes
new domains
new navigation
new UI architecture
```

#### 20. ACCEPTANCE TEST

The slice is complete only when:

```text
✓ one SDCP semantic authority remains
✓ Capability Fabric references domain concepts; does not define them
✓ canonical intent refs remain SDCP-owned
✓ required capability refs are contractually defined where proven
✓ permitted capability refs are contractually defined where proven
✓ capability input semantics are SDCP-qualified
✓ provider-native inputs remain below the semantic boundary
✓ capability output assertion classes are defined
✓ provider-result admission is a runtime boundary
✓ provider provenance survives normalization/admission
✓ provider result cannot directly become canonical truth
✓ observation capability reference contract exists
✓ reconciliation contract points to canonical reconciliation authority
✓ Reality Delta remains canonical and singular
✓ learning admission reference exists
✓ learning signal does not become memory automatically
✓ provider identity does not enter the domain ontology
✓ capability meaning does not become provider-specific
✓ Prompt 2 no longer owns semantic-contract invention
✓ no speculative semantic_domain_registry_v1.0.json freeze
✓ no competing authority introduced
```

#### 21. ADMISSION / READY

Run:

```text
normal repository validation
+ contract tests
+ authority/collision guards
+ exact-head validation
+ literal-current-main union / merge-admission validation
```

If the repository uses generated artifacts or migrations, verify them according
to existing project policy.

If every gate passes:

```text
READY
```

STOP. Do not begin Prompt 1.

#### 22. OUTPUT PACKET

Return:

- **A.** Authority disposition — for each touched existing authority:
  `KEEP` / `EXTEND` / `WRAP` / `CONVERGE`
- **B.** Exact SDCP ↔ Capability Fabric contract
- **C.** Runtime provider-result admission boundary
- **D.** Proof no second semantic resolver exists
- **E.** Proof no provider concepts entered domain ontology
- **F.** Proof Prompt 2 can consume the contract without modifying it
- **G.** Test evidence
- **H.** Exact-head / literal-current-main admission evidence
- **I.** Verdict — exactly one:

```text
READY
BLOCKED_BY_AUTHORITY_CONTRADICTION
BLOCKED_BY_CURRENT_MAIN
BLOCKED_BY_CONTRACT_FAILURE
```

STOP.

---

## 8. Final boundary

Prompt 0 discovers existing authority. Prompt 0.5 binds those authorities.
Prompts 1–3 prove provider-independent means. Prompt 4 activates governed
mutation only through existing LAWRENCE authority. Prompt 5 reconciles execution
with reality. Prompt 6 certifies that the entire closed loop works without
creating a competing semantic, mutation, truth, reconciliation, learning, or
memory authority.
