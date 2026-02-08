# AGENTS.md

This file guides agentic coding assistants working in this repository.

## Project Overview
- Frontend-only app with static HTML + vanilla JS.
- Tailwind CSS via CDN in `index.html`.
- Pages are rendered via functions in `pages/*.js` and exported on `window`.
- Routing is hash-based in `app.js` (`#player`, `#head-to-head`, etc.).
- Sidebar is rendered dynamically via `components/sidebar.js`.

## Commands (Build / Lint / Test)
There is no package manager or build system detected (no `package.json`).

### Local Run (manual)
- Open `index.html` directly in a browser.
- Or serve the repo from a static server:
  - `python -m http.server 8000`
  - Open `http://localhost:8000` and use hash routes.

### Tests
- No automated test runner detected.
- Single-test commands: not applicable (no test framework configured).

### Lint / Format
- No lint/format tooling detected.
- Keep formatting consistent with existing files (see Style Guide below).

## Repository Rules
- No Cursor rules found (`.cursor/rules/`, `.cursorrules` not present).
- No Copilot rules found (`.github/copilot-instructions.md` not present).

## Code Style Guide

### General
- Use vanilla JavaScript (no bundler, no imports/exports).
- Prefer `const` over `let`, and `let` over `var`.
- Keep functions small and focused; use helper functions for repeated UI logic.
- Use semicolons consistently (existing code does).
- Use template literals for HTML strings (`content.innerHTML = \
...`).

### File Structure
- `app.js`: router, global state, and app bootstrapping.
- `components/*.js`: shared UI components (sidebar, etc.).
- `pages/*.js`: page renderers, exported on `window`.
- `index.html`: global layout + top nav + script includes.

### Naming Conventions
- Functions: `lowerCamelCase` (e.g., `renderComparePage`).
- Constants: `lowerCamelCase` for local constants, `UPPER_SNAKE_CASE` only if truly global constants.
- DOM ids: `kebab-case` (e.g., `team-search`).
- Data attributes: `data-page`, `data-tab`, `data-scope`.

### HTML / Tailwind
- Follow existing Tailwind class patterns and spacing.
- Use `bg-surface-dark`, `border-slate-800`, and `text-slate-*` to match theme.
- Keep layout consistent with the current “Midnight” design language.
- Add `aria-*` for dropdowns and buttons where relevant.

### Routing & Navigation
- Register new routes in `Router.routes` in `app.js`.
- Export renderers as `window.renderXxxPage` for routing.
- Ensure sidebar entries include `data-page` so active highlighting works.
- Top nav highlighting uses parent mapping in `Router.updateActiveNav`.

### State / UI Updates
- Guard DOM lookups (`if (!content) return;`).
- Keep state in local variables inside render functions.
- Re-render sections when state changes (e.g., stats after search).
- Use small helper functions for:
  - Filtering dropdowns
  - Rendering stat cards
  - Updating tab active styles

### Inputs & Dropdowns
- League selection should enable dependent inputs.
- Type-to-filter dropdowns:
  - Use a hidden list container.
  - Support keyboard navigation (ArrowUp/Down/Enter/Escape).
  - Close on outside click.
- Search actions should validate required fields and show inline feedback.

### Data & Mocking
- Keep mock data colocated in page files.
- For yearly stats, use `activeStartYear` and `activeEndYear` and generate seasons.
- For “recent games,” keep `last10`, `season`, `postseason` arrays.
- Use consistent stat labels and units (e.g., `Win%`, `Net Rtg`).

### Error Handling
- Validate inputs before running a search.
- Show user-facing feedback (small inline text) for missing/invalid selections.
- Fail gracefully: if data is missing, render placeholders (`--`, `N/A`).

### Formatting Guidelines
- Indentation: 4 spaces (match existing files).
- Keep lines readable; wrap long template strings with line breaks.
- Use `@container` responsive patterns consistently where used in existing pages.

## Common Tasks

### Add a New Page
1) Create `pages/<name>.js` with `render<Name>Page()`.
2) Export it on `window`.
3) Add script to `index.html`.
4) Add route in `app.js`.
5) Add sidebar and/or top nav entry with `data-page`.

### Update Sidebar Entries
- Edit `components/sidebar.js`.
- Pass the current page to `renderPlayerSidebar(activePage)`.
- Ensure `renderNavLink` gets a `data-page` value.

### Update Top Nav Highlight
- Adjust `Router.updateActiveNav(page)` mapping in `app.js`.
- Keep top nav highlight stable across sidebar routes.

## Notes for Agents
- Do not introduce build tooling unless requested.
- Keep changes localized to relevant page files.
- Avoid non-ASCII characters unless already present.
- If you add new mock data, keep it consistent with existing schemas.
