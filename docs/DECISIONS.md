# Decisions

## 2026-10-15 — Repository foundation
Use a single repository for application code, tests, experiments, and documentation. Keep the initial tooling dependency-free with Node.js so it runs immediately. This is a starting environment; it does not commit the product to a final frontend or backend framework.

Keep the remote repository private during early development.

## 2026-10-15 — Core product direction
The name remains provisional. Users provide their equipment and a song, guitar part, or line through a reference link or file. The system recommends equipment-specific parameters and effects to approximate that tone. Users apply the settings manually in the first version. Exact tone matching is not guaranteed. Providers, supported gear, reference processing, and the final application stack remain undecided. See PRODUCT.md.

## 2026-10-15 — Future standalone controller integration
Preserve structured tone recipes so a computer can later configure the user's screen-equipped controller prototype. It should control TONEX and other connected devices where supported, and operate without the computer during play. Exact board, TONEX model, USB/Bluetooth topology, and protocols remain to be verified. Manual adjustment remains the first milestone. See HARDWARE.md for proposed design requirements.
