# thefutonshop-dropin — Monorepo Requirements

**Repo:** `thefutonshop-dropin`  
**Type:** Multi-drop-in monorepo (one directory per drop-in)  
**Storefront consumer:** `thefutonshop-eds`  
**Docs reference:** [Creating Drop-In Components](https://experienceleague.adobe.com/developer/commerce/storefront/dropins/all/creating/)  
**Last updated:** 2026-08-11

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
├── product-slider/    # ✅ Ready to publish → storefront next
├── megamenu/          # ⬜ Planned (not started)
├── scratch/           # Shared workflow docs (this file, etc.)
└── …
```

| Directory | npm package | Version | Status |
|-----------|-------------|---------|--------|
| `newsletter/` | `@ajay0641/tfs-newsletter` | 1.0.3+ | Published & working in `thefutonshop-eds` |
| `product-slider/` | `@ajay0641/tfs-product-slider` | **1.0.0** | **Ready to publish** (impl + tests complete) |
| `megamenu/` | TBD | — | Planned |

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
| Package | `@ajay0641/tfs-newsletter` (e.g. 1.0.3+) |
| Role | Newsletter email subscription form |
| Storefront | Installed in `thefutonshop-eds` — **working** |

### Notes
- Reference for publish scripts, sandbox, initialize/headers, container + component split.
- New drop-ins follow the same pack/publish flow unless intentionally different.

---

## 5. Drop-in: Product Slider

| Field | Value |
|-------|--------|
| Path | `product-slider/` |
| Package | `@ajay0641/tfs-product-slider` |
| Version to publish | **1.0.0** |
| Role | **Global** product slider for any storefront section |
| Status | **Ready to publish** |

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

### GraphQL (published v1)

```graphql
query ProductSlider(
  $phrase: String!
  $pageSize: Int!
  $currentPage: Int!
  $filter: [SearchClauseInput!]
) {
  productSearch(
    phrase: $phrase
    page_size: $pageSize
    current_page: $currentPage
    filter: $filter
  ) {
    total_count
    items {
      productView {
        sku
        name
        url
        urlKey
        inStock
        addToCartAllowed
        images { url label roles }
        attributes { name label value roles }
        ... on SimpleProductView {
          price {
            regular { amount { value currency } }
            final { amount { value currency } }
          }
        }
        ... on ComplexProductView {
          priceRange {
            minimum {
              regular { amount { value currency } }
              final { amount { value currency } }
            }
            maximum {
              regular { amount { value currency } }
              final { amount { value currency } }
            }
          }
        }
      }
    }
  }
}
```

### Delivered (ready for 1.0.0 publish)
- [x] `getProductSlider` + Magento headers via `initialize`  
- [x] Product card (TFS-style) + horizontal slider  
- [x] Simple + Complex product price mapping  
- [x] Click only on image & name (`onProductImageClick` / `onProductNameClick` / shared `onProductClick`)  
- [x] Events: `product-slider/data`, `product-slider/error`, `product-slider/product-click` `{ product, target }`  
- [x] Config props + optional `fetchProducts`  
- [x] Sandbox `examples/html-host`  
- [x] Publish scripts (same as newsletter)  
- [x] Unit tests + production build  

### Publish checklist — `@ajay0641/tfs-product-slider@1.0.0`

**Pre-publish**
- [x] Package `name` / `version` set in `product-slider/package.json`  
- [x] `scripts/prepare-publish.js` present  
- [x] `npm run test` passes (with coverage)  
- [x] `npm run build` succeeds  
- [ ] Logged into npm (`npm whoami`) as publisher for `@ajay0641` scope  
- [ ] Registry/access: public scoped package (`--access public`)  

**Publish commands** (from package dir)

```bash
cd product-slider

# Optional: local .tgz for storefront install without npm
npm run pack:dropin
# → product-slider/ajay0641-tfs-product-slider-1.0.0.tgz

# Publish to npm
npm run publish:dropin
```

**What consumers import** (after publish)

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

**Storefront install (after publish)**

```bash
# in thefutonshop-eds
npm install @ajay0641/tfs-product-slider@1.0.0
```

Or local pack without registry:

```bash
npm install /path/to/product-slider/ajay0641-tfs-product-slider-1.0.0.tgz
```

### Post-publish (still open)
- [ ] Confirm package on npm (`npm view @ajay0641/tfs-product-slider`)  
- [ ] EDS block in `thefutonshop-eds` (init + `ProductSliderContainer`)  
- [ ] Smoke-test live GraphQL + click handlers on storefront  

### Product-slider phase markers
- Phase 1–3: Complete ✅  
- Phase 4: Implementation Complete ✅  
- Phase 4.5: Ready for publish smoke / storefront wire-up  
- **Next:** Publish **1.0.0**, then integrate in storefront  

---

## 6. Drop-in: Megamenu (planned)

| Field | Value |
|-------|--------|
| Path | `megamenu/` (not created yet) |
| Package | TBD (likely `@ajay0641/tfs-megamenu`) |
| Role | Navigation megamenu for storefront header |
| Status | Not started — fill requirements when kicked off |

---

## 7. Active work & next actions

| Priority | Action |
|----------|--------|
| **1** | **Publish** `@ajay0641/tfs-product-slider@1.0.0` (`npm run publish:dropin` in `product-slider/`) |
| 2 | Mark published in this file + verify `npm view` |
| 3 | Integrate product slider block in `thefutonshop-eds` |
| 4 | Start `megamenu` (or next drop-in) — add section here first |

---

## 8. How to use this file

1. **Start any new drop-in** → add a section (status, goals, open questions).  
2. **Per-drop-in code** stays under its own directory (`newsletter/`, `product-slider/`, …).  
3. **`scratch/`** holds monorepo workflow docs only — not drop-in source.  
4. Before each **publish**, update that drop-in’s section: version, checklist, “post-publish” items.  
5. After publish succeeds, set status to **Published** in §2 and §5.
