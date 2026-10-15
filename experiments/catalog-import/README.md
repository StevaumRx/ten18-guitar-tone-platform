# Downloaded pedal catalogs — Ten18 development handoff

Retrieved 2026-10-15. These are actual downloaded catalog records, not manually invented starter cards. They are staged outside the live app because another Codex session is implementing the rig builder.

## Active catalog decision

The application now uses **RockBoard only** for selectable cards: 13,680 source records produce 13,658 entries after conservative deduplication. Run `npm run build:catalog` to rebuild the app catalog. Pedal Playground and Pedalboard Planner remain archives used only to preserve old saved-rig references; they are not merged into search results. See `docs/DECISIONS.md` for the comparison and migration behavior.

## Files

| Source | Raw records | Normalized records | Brands |
| --- | ---: | ---: | ---: |
| Pedal Playground | 8,557 | 8,552 | 779 |
| Pedalboard Planner | 7,823 | 7,823 | 520 |
| RockBoard public search | 13,680 | 13,680 | 1,673 |

There are 30,060 source records, including overlap across websites, visual variants, and accessories. Do not call these 30,060 unique pedal models. Five repeated Pedal Playground identities are collapsed in its normalized file; source row references and the raw snapshot preserve them. Cross-source deduplication has not been performed.

Each source has a `.raw.json` snapshot and `.catalog.json` normalized version. `summary.json` has counts. Pedalboard Planner additionally has manufacturer names, category definitions, and board records. `brands.json` is the Pedal Playground brand list.

`sample-images/` contains 80 actual downloaded PNG images selected from names matching TONEX, Mercury, HX Stomp, Morning Glory, Benson, MC6, Canvas, Pantheon, Cali76, Microcosm, Chroma, H90, or volume. The manifest records download results. This is an image sample, not all catalog images. The complete Pedal Playground normalized catalog includes source image URLs for all entries.

## Source endpoints

- Pedal Playground: https://pedalplayground.com/public/data/pedals.json
- Pedal Playground image base, observed in its app script: https://pedalplayground.com/public/images/pedals/
- Pedalboard Planner: https://pedalboardplanner.com/app/api/index_new.php?ob=pedal
- Planner manufacturer names: https://pedalboardplanner.com/app/api/index_new.php?ob=vendor
- Planner categories: https://pedalboardplanner.com/app/api/index_new.php?ob=type
- Planner boards: https://pedalboardplanner.com/app/api/index_new.php?ob=board
- RockBoard: public GraphQL endpoint https://api.rockboard.de/next-public, using the SearchPedals query published in its frontend JavaScript. Retrieved 500 records per page with limit/offset until all 13,680 reported records were collected. Verified 13,680 unique source IDs.

RockBoard fields retrieved: source ID, model, manufacturer ID/name, categories, image and thumbnail paths, public flag, width, depth. Original dimensions are retained without asserting units until verified. Pedalboard Planner retains source footprint dimensions in inches. Pedal Playground's normalized footprint is converted from documented inches to mm; its original Height field is the top-view depth, not enclosure vertical height.

## Use in the rig builder

1. Read the current app schema before importing; no app code was changed by this retrieval.
2. Choose source precedence and deduplicate exact brand/model/version matches. Keep color variants and conflicting specifications explicit. Do not fuzzy-merge distinct editions silently.
3. Resolve and verify image URLs; keep a placeholder when an asset is unavailable. Do not assume every image path is valid.
4. Map catalog entries to equipment definitions, and give every user-added card a distinct instance ID.
5. Keep controls, audio ports, and MIDI profiles unknown unless verified from appropriate device documentation. These catalogs primarily provide identity, images, physical dimensions, and some categories, not complete tone-control data.
6. Keep source provenance. The upstream GitHub repository did not declare a license in its metadata; public access is not a verified redistribution license for all data or photographs. These are research/staging snapshots; reuse rights need review before public deployment.

Run `python3 experiments/catalog-import/normalize.py` from the repository root to regenerate the normalized data and validate unique IDs/nonempty names. It does not change the live app or contact remote services.
