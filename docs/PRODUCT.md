# Product scope — working definition

Status: user-approved concept; implementation has not started.

## Identity

The project name is provisional. Ten18 Guitar Tone Platform and the current repository name are working labels, not a final product name. Naming can change during development and testing.

## Audience and role within Ten18

This is an add-on tool on the Ten18 Store website, serving existing clients and future clients. Potential buyers of the Arduino-based controller are also an intended audience, with the device relationship still being explored.

The tone tool is not intended to be sold as a separate product. Its purpose is to support the Ten18 community in using their gear. Do not assume a standalone subscription business, separate product sales, purchase requirements, or mandatory controller ownership. Access rules and the exact store integration remain undecided.

External services such as Tom na Mão are references for learning, not a mandate for competitive positioning or copying their business model.

## Purpose

Help a guitarist approximate a reference guitar tone using equipment they actually own. The system translates a musical reference into actionable, equipment-specific settings. The guitarist applies those settings manually in the initial version.

## Core workflow

1. The user lists their setup: guitar, pedals, modelers, amplifiers, and other relevant equipment.
2. The user identifies a song, guitar part, or guitar line and provides a reference link or file.
3. The system determines a practical approach using the available setup.
4. The system presents the signal chain, effects, control values, and adjustment instructions.
5. The user manually adjusts the equipment and plays the part, aiming for the closest achievable sound.

## Required result

The result must tell the user what to do with their own gear: what to enable, what to bypass, what effect or model to select where supported, and how much to adjust each relevant parameter. Use the actual control names, units, and ranges of the identified equipment when verified.

Include:
- The interpreted target: song, part, or segment.
- The setup used and any assumptions about its configuration.
- Suggested signal order and guitar pickup or control choices where relevant.
- Settings grouped by the user's devices, with clear manual steps.
- Known limitations and what is unlikely to be replicated with the available setup.
- A distinction between verified equipment capabilities and estimated settings.

The goal is the closest practical approximation, not a promise of an identical sound. Do not invent controls, effects, models, parameter ranges, or unsupported device capabilities. If important equipment details are missing, ask for them or clearly state the limited assumption.

## Initial boundary

Manual adjustment is confirmed for the initial version. Future controller integration is now an approved direction: preserve structured settings that can later be transferred from a computer to the screen-equipped controller and translated into supported device commands. Hardware control is a later milestone; see HARDWARE.md. Preset-file export is not yet specified.

A link or file is a reference input. Do not imply that naming a song proves its audio has been retrieved or analyzed. Supported link sources, file formats, clip selection, and the analysis approach remain to be decided.

## Proposed first validation — not yet approved

Start with one fully identified real setup and one reference guitar segment. Check that every suggested control exists on the device, values use its actual scale, instructions can be followed without guesswork, and the user can assess the resulting approximation by playing it.

This validation approach is a proposal, not a commitment to any particular AI provider, analysis technique, framework, or device catalog.

## Decisions still needed

- First equipment models to support and reliable sources for their controls.
- How the user specifies signal order, output routing, and listening setup.
- Supported reference links and files, including selecting a specific passage.
- How references are interpreted and how uncertainty is communicated.
- The first end-to-end acceptance criteria and listening feedback process.
- Application stack, storage, AI services, and hosting.
