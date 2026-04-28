# ROOTS (GỐC) - Agent Personas

AI agent personas for specialized tasks on the ROOTS project (landing page + family app).

## Available Agents

| Agent | Purpose |
|---|---|
| `frontend.agent.md` | UI/UX, Emotion styling (glass/clay), animations, i18n |
| `developer.agent.md` | General feature implementation across landing page + app |
| `tech-lead.agent.md` | Code review, pattern enforcement, technical decisions |
| `cto.agent.md` | Architecture decisions, dependency evaluation |
| `ceo.agent.md` | Product vision, business strategy |
| `cmo.agent.md` | Marketing copy, conversion optimization, UX copy |
| `cpo.agent.md` | Product strategy, feature prioritization |
| `product-designer.agent.md` | Visual design, design system (DESIGN.md), UX |
| `product-owner.agent.md` | Acceptance criteria, feature scope, definition of done |
| `seo-specialist.agent.md` | SEO, meta tags, structured data, Core Web Vitals |
| `qa.agent.md` | Testing, quality assurance, cross-locale/device testing |

## Usage

In Copilot Chat: attach the relevant `.agent.md` file as context, or reference
it with `#file:.github/agents/frontend.agent.md`.

## Quick Picks

- Building UI → `frontend` or `developer`
- Code review → `tech-lead`
- Architecture question → `cto`
- Writing copy → `cmo`
- Checking scope / acceptance → `product-owner`
- SEO / meta → `seo-specialist`
- QA checklist → `qa`
