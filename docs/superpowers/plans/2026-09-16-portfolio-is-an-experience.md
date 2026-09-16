# The Portfolio Is an Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the root portfolio at `lielbenor.com` as a short, narrative experience that lets visitors encounter Liel's curiosity, standards, growth, and capability through what the site does and reveals—not through a conventional skills-first résumé.

**Architecture:** Keep the root site static and progressively enhanced. The complete narrative remains present in semantic HTML so it can be read without JavaScript; vanilla JavaScript adds stateful reveals, artifact interactions, and restrained transitions. The root landing page is the experience, while archival/project routes and the separately hosted `app-site/` showcase remain independently addressable and deployable.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, existing Flask local server (`app.py`), static assets, Vercel static deployment from the repository root, and manual browser verification at desktop and phone widths.

**Spec:** The user-provided pitch titled “The Portfolio Is an Experience” in the task conversation on 2026-09-16.

## Global Constraints

- The site sells the person and the way he thinks, not merely a list of services or technologies.
- Use “show, don't tell”: passion, growth, and quality must be evidenced by content, interaction, craft, and truthful reflection.
- `PASSION · GROWTH · QUALITY` is an earned thematic title drop, not the first-viewport hero headline.
- The visitor journey must have a clear progression: Prologue → Title Drop → Story → Adversary → Prevail → Epilogue.
- Every major section must answer: What do they see? What do they do? What do they discover? What do they feel? What question makes them continue?
- Technology serves the story. No 3D, WebGL, animation, or interaction may exist only to demonstrate technical sophistication.
- Every interactive or visual proof must have a meaningful static fallback and an accessible keyboard path.
- Do not invent metrics, clients, outcomes, failures, interests, or personal history. Use only material that can be supported by the supplied content, existing assets, or new material explicitly authored for this site.
- Keep the root landing page independent from `app-site/`; do not add cross-site routing, runtime dependencies, or showcase asset loading to the root page.
- Keep `index.html` and `templates/index.html` byte-equivalent because Vercel serves the root file while Flask renders the template locally.
- Avoid adding a framework, CMS, dependency, or backend endpoint unless a concrete experience requirement cannot be met with the existing static stack.
- Preserve useful archive/project routes and provide a conventional résumé/contact path for visitors who need direct professional evidence.
- Support narrow screens, keyboard navigation, screen readers, `prefers-reduced-motion`, slow connections, and JavaScript-disabled browsing.
- No unit-testing suite is required; verification uses static inspection, local HTTP smoke checks, and manual/Playwright browser review.

---

## Product thesis

The portfolio should leave a visitor thinking:

> “I spent five minutes here and feel like I encountered someone. I want to know what this person will build next.”

It should not leave them thinking only:

> “This person has a lot of skills.”

The site is therefore both the container and the strongest work sample. Its pacing, typography, transitions, spatial composition, artifact behavior, responsiveness, and restraint are evidence of the maker behind it.

## Current repository context

- `index.html` is the production root landing page for `https://lielbenor.com`.
- `templates/index.html` is the Flask-local mirror rendered by `app.py` at `/`.
- `static/css/site.css` and `static/js/site.js` implement the current “living diff” landing-page experience.
- `app.py` preserves `/2022` and `/projects/<name>` routes for legacy and project material.
- `concept-v1-journey.html`, `concept-v2-coexistence.html`, and `concept-mockup.html` are design explorations, not production routes. They may inform direction but are not sources of factual content by themselves.
- `app-site/` is a separate selected-work showcase deployed as `https://app.lielbenor.com`; it is out of scope for this plan.
- The repository currently contains uncommitted changes to the existing root experience. Executors must inspect and preserve those changes before editing overlapping files.

## Experience contract

| Stage | Visitor experience | Evidence medium | Continue question |
| --- | --- | --- | --- |
| Prologue | Encounter an unexpected fragment, object, observation, or piece of work before receiving a professional introduction. | One authored visual, artifact, interaction, or concise fragment grounded in Liel's actual material. | “What is this, and who made it?” |
| Title Drop | Recognize that the fragment was not random; it belongs to a philosophy. | A deliberate reveal of `PASSION · GROWTH · QUALITY` after the prologue has earned attention. | “What do those words mean here?” |
| Story | Follow a progression of obsessions, builds, lessons, experiments, and changing standards. | Chronological or thematic chapters, project artifacts, process notes, and interaction that exposes relationships. | “What kept changing, and why?” |
| Adversary | See resistance rather than a frictionless success montage. | Truthful constraints, failed attempts, tradeoffs, bugs, limits, or things that were not good enough. | “What did the resistance produce?” |
| Prevail | Understand what Liel can build now and what quality means today. | Interactive work, current product evidence, outcomes that can be verified, and concise technical context. | “What might he build next?” |
| Epilogue | Return to the present without pretending the story is complete. | Ongoing-trajectory statement, direct contact, résumé, and selected links. | “Should I start a conversation?” |

## Narrative and content rules

### What belongs in the story

- Things Liel became obsessed with.
- Things he built and what each made possible or taught him.
- Problems he could not leave alone.
- Experiments and technical rabbit holes that reveal curiosity.
- Moments where he went beyond what was required.
- Real failures, constraints, tradeoffs, and changes in standards.
- Current professional work as part of the trajectory, not the entire identity.

### What does not belong by default

- A technology wall used as the opening statement.
- Generic adjectives such as “passionate,” “innovative,” or “quality-focused” without an accompanying proof.
- Decorative 3D scenes, scroll effects, or WebGL experiments with no narrative job.
- A fictionalized struggle or manufactured drama.
- Screenshots presented without context, interaction, or a reason to care.
- A service catalog that makes the person disappear behind deliverables.

### Title-drop rule

The exact title text is fixed for the first implementation: `PASSION · GROWTH · QUALITY`. The placement, typography, transition, and whether the reveal is scroll-led or action-led remain design decisions, but the title must not be visible as the conventional first-screen hero claim. It must follow a prologue the visitor can actually encounter.

## Decision gates before implementation

These are required inputs to the first build slice. They are intentionally kept as decisions because choosing them requires personal/source material that the repository cannot author safely.

1. Select the prologue medium and source: a real artifact, photo, observation, interactive object, or fragment of work that represents the person without explaining him.
2. Select the first three to five story chapters. Each chapter needs one truthful source, one change or discovery, and one reason it belongs in the visitor's journey.
3. Select two or three artifacts for interaction. For each, decide what the visitor can manipulate or discover and what static fallback communicates the same point.
4. Select the adversary material that can be public. Name the actual constraint, failure, or tradeoff; do not add narrative drama where the evidence is absent.
5. Confirm the primary professional audience and final action. The default plan assumes hiring managers, collaborators, and potential clients should all be able to reach a direct contact path, with résumé and selected-work links as secondary paths.
6. Set an experience budget before implementation: maximum initial asset weight, maximum number of custom interaction systems, and a rule that mobile/reduced-motion behavior is designed alongside desktop behavior.

## File map

| File or directory | Responsibility in this plan |
| --- | --- |
| `index.html` | Production semantic shell for the six-stage narrative; contains all essential copy and fallbacks. |
| `templates/index.html` | Exact local Flask mirror of `index.html`; update in lockstep. |
| `static/css/site.css` | Visual language, stage pacing, artifact presentation, responsive layout, focus states, reduced-motion and no-JS-safe states. |
| `static/js/site.js` | One small experience controller for progressive enhancement, stage state, reveals, artifact interactions, and shareable state where useful. |
| `static/img/experience/` | New authored assets that directly support the story; use existing `static/img/` assets when they are truthful and stronger. |
| `docs/portfolio-experience-content.md` | Content/evidence ledger created during implementation; records source, chapter, proof, fallback, and publication status for every narrative element. |
| `README.md` | Update only the root-site description or verification notes that become inaccurate after the landing-page change. |
| `app.py` | Leave unchanged unless a specific archival or artifact route is required; the default implementation needs no new backend behavior. |
| `app-site/` | No changes. It remains a separate Vercel project and showcase. |

---

### Task 1: Author the content and evidence ledger

**Files:**

- Create: `docs/portfolio-experience-content.md`
- Reference: `docs/superpowers/plans/2026-09-16-portfolio-is-an-experience.md`
- Reference: `index.html`, `templates/index.html`, `concept-v1-journey.html`, `concept-v2-coexistence.html`, `concept-mockup.html`, existing `static/img/` assets

**Interfaces:**

- Produces the approved copy/evidence inventory consumed by Tasks 2–6.
- Every entry uses: `stage`, `visitor sees`, `visitor does`, `visitor discovers`, `visitor feels`, `continue question`, `source`, `static fallback`, `truth/permission check`, and `status`.

- [ ] Inventory existing copy, projects, images, archive routes, résumé, and contact links without treating old concept copy as automatically factual.
- [ ] Write one entry for Prologue, Title Drop, Story, Adversary, Prevail, and Epilogue using the required fields above.
- [ ] Mark unsupported claims as excluded rather than filling gaps with marketing language.
- [ ] Record which existing project pages can serve as deeper evidence and which projects should remain archive-only.
- [ ] Record the approved prologue, chapter order, artifact behaviors, adversary material, and final action before markup work begins.
- [ ] Review the ledger against the product thesis and remove any section whose only purpose is to display a skill list.

### Task 2: Replace the landing-page shell with the six-stage narrative

**Files:**

- Modify: `index.html`
- Modify: `templates/index.html`
- Preserve: `app.py` routes `/2022` and `/projects/<name>`

**Interfaces:**

- Produces semantic sections with stable IDs: `prologue`, `title-drop`, `story`, `adversary`, `prevail`, and `epilogue`.
- Produces one page-level `h1` for the title drop, while each other stage uses ordered subordinate headings.
- Produces meaningful anchors for `#story`, `#prevail`, and `#epilogue`, plus a skip link and direct résumé/contact links.

- [ ] Build the Prologue markup from the approved ledger entry; do not place “full-stack developer,” a stack list, or a conventional service headline before the encounter.
- [ ] Add the Title Drop as the page thesis with the exact text `PASSION · GROWTH · QUALITY` and an adjacent plain-language explanation available to screen readers and no-JS visitors.
- [ ] Add Story chapters that pair each narrative claim with a concrete artifact, project, observation, or linked deeper page.
- [ ] Add Adversary content using the selected real constraints/failures/tradeoffs and state what changed because of them.
- [ ] Add Prevail content that demonstrates present capability through current work, interactive artifact entry points, and concise factual technical context.
- [ ] Add the Epilogue with an ongoing-trajectory statement, email, résumé, GitHub, LinkedIn, and a clear primary contact action.
- [ ] Keep all essential content in the HTML so disabling JavaScript still exposes the complete story in the same order.
- [ ] Copy the finished root markup into `templates/index.html` and verify the two files are byte-equivalent.

### Task 3: Establish a restrained visual and motion system

**Files:**

- Modify: `static/css/site.css`
- Reference: `index.html`, `templates/index.html`

**Interfaces:**

- Consumes the six stable section IDs and the artifact classes defined in Task 2.
- Produces visual states named by meaning, not implementation detail: `is-entered`, `is-active`, `is-revealed`, `has-focus`, and `is-complete`.

- [ ] Define a small token layer for canvas, text, muted text, rule, accent, spacing, content measure, and stage timing; reuse the existing font strategy unless a stronger approved choice is documented.
- [ ] Give each stage a distinct compositional role and pacing without turning each stage into a different visual theme.
- [ ] Make the Title Drop feel earned through spacing, contrast, and transition timing rather than a permanent hero treatment.
- [ ] Use motion only to reveal sequence, causality, or artifact response; remove any effect that cannot be explained in one sentence as part of the story.
- [ ] Implement mobile layout and touch targets as first-class states, not as a desktop layout compressed by media queries.
- [ ] Implement visible keyboard focus, forced-colors-safe rules, readable contrast, and `prefers-reduced-motion` behavior in the same pass.
- [ ] Verify that the no-JS HTML remains legible when animation classes and script-generated state are absent.

### Task 4: Build the first interactive proof slice

**Files:**

- Modify: `static/js/site.js`
- Modify: `index.html`
- Modify: `templates/index.html`
- Add: approved assets from Task 1 under `static/img/experience/`

**Interfaces:**

- Defines one `EXPERIENCE_STAGES` model with the IDs `prologue`, `title-drop`, `story`, `adversary`, `prevail`, and `epilogue`.
- Defines one `ARTIFACTS` model whose entries provide `id`, `label`, `instruction`, `fallbackSelector`, and `reset()` behavior.
- Initializes through a single `initExperience()` entrypoint and exits cleanly when required DOM nodes are absent.

- [ ] Write the stage model and artifact model before adding event listeners so narrative state is not scattered across unrelated handlers.
- [ ] Implement one meaningful artifact interaction from the approved ledger; the interaction must reveal information or let the visitor experience a capability, not merely trigger an effect.
- [ ] Add a visible instruction, keyboard equivalent, reset path, and static fallback for the artifact.
- [ ] Add stage-entry enhancement with `IntersectionObserver` only after the complete no-JS story works; do not hide essential content until an observer fires.
- [ ] Keep all event listeners scoped to the root landing page and avoid global behavior that could affect archive/project pages.
- [ ] Make reduced-motion mode use immediate state changes with no loss of content or interaction meaning.
- [ ] Remove or repurpose the current era-navigation behavior where it competes with the new linear narrative; preserve archive access through ordinary links.

### Task 5: Connect professional proof to the narrative

**Files:**

- Modify: `index.html`
- Modify: `templates/index.html`
- Modify: the project-template files named in the Task 1 ledger when their factual copy needs correction
- Reference: `static/img/projects/`, `static/img/experience/`, `static/img/liel_ben_or_resume.pdf`

**Interfaces:**

- Produces a consistent artifact entry shape: title, period/context, what the visitor can inspect, what it reveals about the maker, and a deeper link or static fallback.
- Keeps technical details subordinate to the visitor's understanding of the problem, decision, or change.

- [ ] Select the smallest set of projects that demonstrates the trajectory; omit projects that only add technology names without a distinct lesson or capability.
- [ ] For each selected project, write a factual one-sentence “why this belongs in the story” and a factual one-sentence “what changed or was learned.”
- [ ] Link to existing project detail pages only where their content is accurate and public; correct wording in those pages when the landing-page narrative would otherwise overclaim.
- [ ] Use interactive presentation for only the artifacts that benefit from it; use a photograph, screenshot, or paragraph where that is the stronger medium.
- [ ] Put the résumé and direct contact path in the Epilogue and make them reachable without completing every interaction.

### Task 6: Validate the whole experience as an experience

**Files:**

- Verify: `index.html`, `templates/index.html`, `static/css/site.css`, `static/js/site.js`
- Verify: `app.py`, `/2022`, `/projects/<name>`, and `app-site/` boundaries
- Update if needed: `README.md`

**Interfaces:**

- Produces a review record containing concrete behavior, viewport, motion mode, and known limits.

- [ ] Start the local Flask server from the repository root and confirm `/`, `/2022`, and at least one project route return successfully.
- [ ] Fetch the root page with JavaScript disabled or absent and confirm all six stages, title-drop text, contact path, and fallback artifacts are present in HTML.
- [ ] Review the root page in Playwright at a desktop viewport and a phone viewport; verify the journey order, interaction affordances, and no horizontal overflow.
- [ ] Review keyboard-only navigation from skip link through the prologue, title drop, artifacts, résumé, and contact links.
- [ ] Review with `prefers-reduced-motion: reduce` and confirm no content or capability disappears.
- [ ] Inspect the browser console and network requests for errors, broken assets, accidental showcase dependencies, and excessive initial transfers.
- [ ] Confirm `index.html` and `templates/index.html` remain byte-equivalent after all markup changes.
- [ ] Confirm the separate `app-site/` page still has its own source/assets and that the root page does not load from `app-site/`.
- [ ] After publication, verify `https://lielbenor.com` with `curl -I` and repeat the desktop/phone browser review against the production URL.
- [ ] Record what was verified and any limitation in `README.md` or the implementation handoff; do not claim that local review proves search ranking, analytics, or enquiry delivery.

## Definition of done

- A first-time visitor encounters something before being given a conventional professional label.
- `PASSION · GROWTH · QUALITY` appears as a meaningful reveal whose context makes the words specific.
- The visitor can move through Prologue → Title Drop → Story → Adversary → Prevail → Epilogue without needing JavaScript.
- At least one interaction communicates a real capability or personal quality through direct experience and has an equivalent fallback.
- The story includes truthful friction and change, not only polished outcomes.
- Current professional work is discoverable without overwhelming the narrative.
- The page is calm, performant, accessible, responsive, and technically restrained.
- The final impression points toward an unfinished trajectory: what Liel may build next.
- Root-site production behavior and the independent `app-site/` deployment boundary remain intact.

## Handoff sequence

After this plan is approved, execute it in the task order above with a review checkpoint after Tasks 1, 2, 4, and 6. Keep each checkpoint focused on one question:

1. Does the chosen material represent the actual person?
2. Does the static page already tell a coherent story?
3. Does the interaction add evidence rather than spectacle?
4. Does the finished site make the visitor want to know what comes next?
