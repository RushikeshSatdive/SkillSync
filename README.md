# SkillSync frontend prototype

A React + Vite + Tailwind CSS frontend-only prototype for SkillSync. It uses local demo data, React state, and browser `localStorage`; there is no backend, authentication, database, external API, or payment flow.

## Run locally

```bash
npm install
npm run dev
```

The Vite server binds to `0.0.0.0` for the hosted preview environment. For a production build, run `npm run build`.

## Product areas

- Landing page and interactive product journey
- Student dashboard and editable skill profile
- Simulated skill-gap flow and peer matching/profile pages
- Persistent learning path, activity timer, progress, and skill-proof drafts
- Skill exchange and a locally interactive community feed
- Social impact context, pricing/business-model hypotheses, market opportunity, unit economics, go-to-market, projections, funding, and About / Team

## Data integrity note

`SkillSync_Numeric_Data.xlsx` was not present in the provided workspace when the prototype was built. Therefore:

- Numerical context figures explicitly included in the brief are shown with their named sources.
- Student metrics and the specified match/skill examples are labeled as illustrative demo examples.
- The market, pricing, unit-economics, funding, and financial pages do not invent workbook figures. The unit-economics and projection scenario controls accept user-entered assumptions and label them as such.
- Team names and biographies were not supplied and have not been fabricated.

All local edits and demo interactions are stored only in the current browser's local storage unless a feature explicitly downloads a local JSON summary.
