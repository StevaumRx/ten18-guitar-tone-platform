# Next implementation: rig builder

## Approved direction

Build a Ten18 Store support tool for existing and future clients, potentially controller buyers. The name is provisional. Read PRODUCT.md, HARDWARE.md, README.md, AGENTS.md, and CONTRIBUTING.md.

## First working feature

A searchable equipment catalog with cards the user adds and arranges into their real audio signal chain. The website derives the rig from selected device identities and their connections; users should not have to re-enter catalog specifications.

Acceptance criteria:
- Search/filter a small starter catalog; select a device to add a card.
- Add multiple instances of the same model, each with a unique instance ID.
- Reorder cards by drag and drop with accessible move-left/right alternatives.
- Remove a card and choose the listening output.
- Save and restore a rig locally, with a versioned JSON representation and input validation.
- Keep device definitions separate from user instances and connections.
- Treat card order as actual physical wiring, not remote rewiring.
- Mark catalog capabilities as unverified unless backed by a source. Do not fabricate device control mappings.
- Keep tone recipes separate from physical rig configuration. Preserve extension points for ports, branches, modeler blocks, and control connections without implementing them all now.
- Use the existing Node scaffold unless a framework change has a clear reason. Create a polished responsive interface using Ten18 black and orange as the initial direction.
- Test catalog selection, duplicate identities, reorder/remove behavior, and saved data validation with meaningful checks.

Out of this milestone: tone-generation AI, audio analysis, Shopify integration, real hardware commands, authentication, and deployment. Do not represent these as implemented.

## Existing state

Source and scope are committed locally. GitHub repository exists at https://github.com/StevaumRx/ten18-guitar-tone-platform but currently has its own initial README commit; local source upload is pending. Preserve both histories when syncing. CLI credentials previously failed, the connector could not access this new repo, and local HTTP tests were blocked by session port restrictions. Recheck current capabilities instead of assuming those blockers persist.

Vini's invitation awaits his GitHub username. CLAUDE.md imports shared instructions for Claude Code.
