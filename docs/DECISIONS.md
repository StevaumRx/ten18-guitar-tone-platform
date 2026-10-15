# Decisions

## 2026-10-15 — Single-source equipment catalog

RockBoard is the sole source for selectable equipment. The downloaded snapshot has 13,680 records across 1,673 brands, compared with 8,552 normalized Pedal Playground entries and 7,823 Pedalboard Planner entries. It includes image references throughout and categories on 12,971 source records. This makes it the most complete of the three retrieved snapshots for our card picker; this does not assert that it is the largest database anywhere or an openly licensed repository.

The importer collapses only case, diacritic and whitespace differences within RockBoard (13,658 selectable entries). Punctuation is retained because Buffer, Buffer+ and Buffer++ are different models. Editions and versions remain distinct. Search ignores spacing, so MercuryX finds Mercury X. Manufacturer-verified controls, ports and MIDI profiles remain unknown.

Other source snapshots are retained solely as development archives and for migrating existing saved rigs. They do not populate the picker. Old catalog references map to a RockBoard identity only when unambiguous. Unmatched or ambiguous identities remain usable in existing saved rigs, with their labels retained, but cannot be selected as new catalog cards. Instance IDs and wiring are preserved.

Regenerate with `npm run build:catalog`. RockBoard snapshot identity, image paths, dimensions and source IDs are preserved. Image paths are source references, not yet verified downloadable URLs. Public deployment still needs the previously documented data/image reuse review; switching sources does not establish reuse rights.

## 2026-10-15 — GitHub Pages deploys the static application from `public/`

The rig builder is a static browser application, including its generated equipment catalog. GitHub Pages uses a GitHub Actions workflow to upload only `public/`, rather than serving the repository root (which displays project documentation). Enabling this deployment makes the browser-delivered catalog data publicly accessible at the Pages URL.

## 2026-10-15 — Local rig-builder representation

The first rig builder uses browser-local storage only. Its versioned document keeps catalog references as user-specific instances, a derived linear audio connection list, a listening-output choice, and reserved extension arrays for later ports, branches, modeler blocks, and control connections. Catalog definitions stay in application code and do not include device controls, protocols, or verified capability claims. Physical card order represents the player’s wiring; it does not remotely rewire equipment. Tone recipes remain outside this configuration.

## 2026-10-15 — Repository foundation
Use a single repository for application code, tests, experiments, and documentation. Keep the initial tooling dependency-free with Node.js so it runs immediately. This is a starting environment; it does not commit the product to a final frontend or backend framework.

Keep the remote repository private during early development.

## 2026-10-15 — Core product direction
The name remains provisional. Users provide their equipment and a song, guitar part, or line through a reference link or file. The system recommends equipment-specific parameters and effects to approximate that tone. Users apply the settings manually in the first version. Exact tone matching is not guaranteed. Providers, supported gear, reference processing, and the final application stack remain undecided. See PRODUCT.md.

## 2026-10-15 — Future standalone controller integration
Preserve structured tone recipes so a computer can later configure the user's screen-equipped controller prototype. It should control TONEX and other connected devices where supported, and operate without the computer during play. Exact board, TONEX model, USB/Bluetooth topology, and protocols remain to be verified. Manual adjustment remains the first milestone. See HARDWARE.md for proposed design requirements.

## 2026-10-15 — Ten18 Store audience and purpose
The platform is a Ten18 Store website add-on supporting existing clients and future clients, potentially including buyers of the Arduino-based controller. The tone tool is not intended to be sold separately. Do not assume subscriptions, paid access, a purchase requirement, or device ownership requirements. Store integration and access rules remain to be defined. External products are learning references.
