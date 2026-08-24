# thefutonshop-dropin — Monorepo Requirements

**Repo:** `thefutonshop-dropin`  
**Type:** Multi-drop-in monorepo (one directory per drop-in)  
**Storefront consumer:** `thefutonshop-eds`  
**Docs reference:** [Creating Drop-In Components](https://experienceleague.adobe.com/developer/commerce/storefront/dropins/all/creating/)  
**Last updated:** 2026-08-24

---

## 1. Purpose

Central requirements and status for **all** custom drop-ins built for The Futon Shop Adobe Commerce storefront.

Each drop-in lives in its **own directory**, is packaged and published to npm independently, then installed in `thefutonshop-eds`.

This file is **global** — do not treat it as product-slider–only. Add a new section when work starts on the next drop-in.

---

## 2. Monorepo layout

```
thefutonshop-dropin/
├── newsletter/        # ✅ Published & used in storefront
├── product-slider/    # ✅ Published & used in storefront
├── menu/              # ✅ Published & integrated in storefront
└── …
```

| Directory | npm package | Version | Status |
|-----------|-------------|---------|--------|
| `newsletter/` | `@ajay0641/tfs-newsletter` | 1.0.3+ | Published & working in `thefutonshop-eds` |
| `product-slider/` | `@ajay0641/tfs-product-slider` | 1.0.3+ | Published & working in `thefutonshop-eds` |
| `menu/` | `@ajay0641/tfs-menu` | **1.0.0** | **Published** — storefront block wired (`tfs-menu`); confirm live GraphQL |

**Source:** `menu/` was copied from `acs-menu-dropin` and adapted to monorepo conventions (`@/tfsmenu/*`, `@ajay0641/tfs-menu`).

---

## 3. Shared conventions (all drop-ins)

| Topic | Convention |
|-------|------------|
| Scaffold | Adobe [dropin-template](https://github.com/adobe-commerce/dropin-template) / Elsie CLI |
| Stack | Preact, `@adobe-commerce/elsie`, fetch-graphql, event-bus |
| Init pattern | `initialize` + Magento GraphQL headers + optional endpoint |
| Publish | Build → `scripts/prepare-publish.js` → publish `.publish/` package root |
| Naming | `@ajay0641/tfs-<name>` |
| Storefront use | Import from npm; EDS block mounts container only |
| Design reference | [thefutonshop.com](https://www.thefutonshop.com/) where UI is customer-facing |
| npm registry | `https://registry.npmjs.org/` (canonical; `registry.npmjs.com` also resolves) |

### Typical Magento headers

```
Magento-Store-View-Code: default
Magento-Website-Code: base
Magento-Store-Code: main_website_store   # when required by the API
```

### Storefront integration pattern

```js
import { render as provider } from '@ajay0641/tfs-<name>/render.js';
import SomeContainer from '@ajay0641/tfs-<name>/containers/SomeContainer.js';
import { initialize } from '@ajay0641/tfs-<name>/api.js';
// initializers.register(initialize, { … }) + provider.render(…)(el)
```

After `npm install`, always run in `thefutonshop-eds`:

```bash
npm run install:dropins
```

This copies scoped packages from `node_modules/@ajay0641/*` → `scripts/__dropins__/` and updates the import map in `head.html`.

### Shared publish scripts (every drop-in package)

| Script | What it does |
|--------|----------------|
| `npm run prepare:publish` | `build` + stage `dist/` → `.publish/` with publish `package.json` |
| `npm run pack:dropin` | prepare + `npm pack` (`.tgz` in package dir, for local storefront test) |
| `npm run publish:dropin` | prepare + `npm publish .publish --access public` |

---

## 4. Drop-in: Newsletter

| Field | Value |
|-------|--------|
| Path | `newsletter/` |
| Package | `@ajay0641/tfs-newsletter` (1.0.3+) |
| Role | Newsletter email subscription form |
| Storefront | `blocks/tfs-newsletter/` — **working** |

### Notes
- Reference for publish scripts, sandbox, initialize/headers, container + component split.
- New drop-ins follow the same pack/publish flow unless intentionally different.

---

## 5. Drop-in: Product Slider

| Field | Value |
|-------|--------|
| Path | `product-slider/` |
| Package | `@ajay0641/tfs-product-slider` (1.0.3+) |
| Role | **Global** product slider for any storefront section |
| Storefront | `blocks/tfs-product-slider/` — **working** |

### Goals
1. Reusable carousel + product cards used site-wide.
2. **Presentation fixed** in the drop-in (slider + card UI).
3. **Data source pluggable** — only fetch/API/filter logic changes per section.
4. Default API: Catalog Service `productSearch` with `isNew = 1`, page size 8.

### Locked decisions

| Topic | Decision |
|-------|----------|
| Slider location | **In the drop-in** (not reimplemented per EDS block) |
| Storefront role | Initialize, mount, optional CMS title/CSS overrides |
| Flexibility | Props (`filter`, `phrase`, `pageSize`, …) + optional `fetchProducts()` |
| UI reference | [thefutonshop.com](https://www.thefutonshop.com/) product card |
| Card content | Image, name, optional subtitle, optional rating/reviews, From / prices / save % |
| Click targets | **Only image + product name** are links; separate handlers for each |
| Headers | Store-View + Website + Store code |

### Delivered
- [x] `getProductSlider` + Magento headers via `initialize`
- [x] Product card (TFS-style) + horizontal slider
- [x] Simple + Complex product price mapping
- [x] Click only on image & name
- [x] Events: `product-slider/data`, `product-slider/error`, `product-slider/product-click`
- [x] Config props + optional `fetchProducts`
- [x] Publish scripts, unit tests, production build
- [x] Published to npm & integrated in `thefutonshop-eds`

### Consumer imports

```js
import { render as provider } from '@ajay0641/tfs-product-slider/render.js';
import ProductSliderContainer from '@ajay0641/tfs-product-slider/containers/ProductSliderContainer.js';
import {
  initialize,
  getProductSlider,
  setEndpoint,
  setFetchGraphQlHeaders,
} from '@ajay0641/tfs-product-slider/api.js';
```

---

## 6. Drop-in: Menu

| Field | Value |
|-------|--------|
| Path | `menu/` |
| Package | `@ajay0641/tfs-menu` **1.0.0** |
| npm | [npmjs.com/package/@ajay0641/tfs-menu](https://www.npmjs.com/package/@ajay0641/tfs-menu) |
| Role | Primary navigation + mega menu (category tree from Catalog Service) |
| Storefront | `blocks/tfs-menu/` — block wired; live category data pending smoke-test |
| Design reference | [thefutonshop.com](https://www.thefutonshop.com/) — white nav, gold underline, full-width mega menu |

### Goals
1. Fetch category navigation from Magento GraphQL (`categories` query).
2. Render top-level nav (uppercase) with hover mega-menu panels (multi-column).
3. **Presentation in drop-in**; storefront block handles init, `parent-id` config, optional CSS overrides.
4. Storybook uses sandbox fixtures (`fetchCategories`) — no live network required for dev.

### Locked decisions

| Topic | Decision |
|-------|----------|
| API | `getMenu(parentId)` (+ alias `menu`) — `categories` query, depth 3, roles `show_in_menu`, `active` |
| Container | `MenuContainer` renders `MenuComponent` |
| Props | `parentId` (default `'2'`), optional `fetchCategories()` for tests/sandbox |
| CSS prefix | `tfsmenu-*` |
| Headers | Store-View + Website (+ Store code in `.elsie.js` schema) |
| Utility bar / logo / search | **Not in drop-in** — lives in EDS `header` block |

### GraphQL (v1)

```graphql
query GetCategories(
  $ids: [String!]!
  $roles: [String!]!
  $depth: Int!
  $startLevel: Int!
) {
  categories(
    ids: $ids
    roles: $roles
    subtree: { depth: $depth, startLevel: $startLevel }
  ) {
    id
    name
    level
    urlPath
    urlKey
    parentId
    children
  }
}
```

### Delivered
- [x] Copied from `acs-menu-dropin`, renamed to `@ajay0641/tfs-menu`
- [x] `MenuComponent` — category tree, loading/error states, TFS mega-menu styling
- [x] `MenuContainer` + `fetchCategories` hook for Storybook/sandbox
- [x] Sandbox fixtures (`src/data/fixtures/sandboxCategories.ts`)
- [x] Publish scripts (`prepare-publish.js`, `pack:dropin`, `publish:dropin`)
- [x] Unit tests (100% coverage on core modules)
- [x] Published `@ajay0641/tfs-menu@1.0.0` to npm
- [x] Storefront block `thefutonshop-eds/blocks/tfs-menu/`
- [x] Initializer `scripts/initializers/menu.js`
- [x] Import map entry in `head.html`

### Publish commands (from `menu/`)

```bash
cd menu
npm run publish:dropin
# verify:
npm view @ajay0641/tfs-menu version
```

Local pack (no registry):

```bash
npm run pack:dropin
# → menu/ajay0641-tfs-menu-1.0.0.tgz
```

### Storefront install

```bash
# in thefutonshop-eds
npm install @ajay0641/tfs-menu@1.0.0
npm run install:dropins
```

> **Note:** Storefront may temporarily use a local `.tgz` (`file:../thefutonshop-dropin/menu/ajay0641-tfs-menu-1.0.0.tgz`) during development. Switch to the npm semver once confirmed.

### Consumer imports

```js
import { render as provider } from '@ajay0641/tfs-menu/render.js';
import MenuContainer from '@ajay0641/tfs-menu/containers/MenuContainer.js';
import {
  initialize,
  getMenu,
  setEndpoint,
  setFetchGraphQlHeaders,
} from '@ajay0641/tfs-menu/api.js';
```

### Authoring (DA)

| Field | Description |
|-------|-------------|
| `parent-id` | Root category ID for the menu tree (default `2`) |

### Post-publish (still open)
- [ ] Switch `thefutonshop-eds` dependency from local `.tgz` to `^1.0.0` from npm (if not already)
- [ ] Smoke-test live Catalog Service categories on storefront (not sandbox)
- [ ] Confirm mega-menu columns match production category depth on [thefutonshop.com](https://www.thefutonshop.com/)

---

## 7. Active work & next actions

| Priority | Action |
|----------|--------|
| **1** | Smoke-test `tfs-menu` block with live GraphQL on storefront |
| 2 | Point `thefutonshop-eds` at `@ajay0641/tfs-menu@^1.0.0` from npm (replace local `.tgz` if present) |
| 3 | Tune storefront block CSS (`blocks/tfs-menu/tfs-menu.css`) if drop-in tokens need overrides |
| 4 | Start next drop-in — add a new section here first |

---

## 8. How to use this file

1. **Start any new drop-in** → add a section (status, goals, open questions).
2. **Per-drop-in code** stays under its own directory (`newsletter/`, `product-slider/`, `menu/`, …).
3. Before each **publish**, update that drop-in’s section: version, checklist, “post-publish” items.
4. After publish succeeds, set status to **Published** in §2 and the drop-in section.
5. After storefront integration, note the EDS block path and any open smoke-test items.
