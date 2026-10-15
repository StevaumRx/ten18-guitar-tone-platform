# Roadmap

## Foundation created locally
- Local source repository and development server scaffold.
- HTTP tests and GitHub CI configuration; local HTTP execution is blocked by session port restrictions.
- Shared instructions for Codex and Claude Code, plus contributor guidance.
- Private GitHub repository created; source upload and remote CI verification remain blocked by authentication/access.

## Product direction confirmed
- Ten18 Store add-on for existing and future clients; potentially also controller buyers.
- No separate sale of the tone tool is intended; access rules and store integration remain undecided.
- Provisional name; branding may change during development.
- User supplies their guitar setup and a song, part, or line reference via link or file.
- System recommends practical parameters and effects for that user's equipment.
- User manually applies the settings to approximate the reference tone.

See PRODUCT.md for the scope, output requirements, boundaries, and open questions.

## Next decisions
- Choose the first supported setup and reference segment for validation.
- Define equipment metadata and reference input requirements.
- Agree on MVP acceptance criteria and a listening feedback process.
- Choose frontend/backend stack, storage, analysis approach, and AI services.
- GitHub Pages publishes the static browser interface from `public/` when its workflow is enabled in repository settings.

## Collaboration setup pending
- Restore GitHub access and upload the local commits without losing either history.
- Verify GitHub Actions after upload.
- Confirm Vini's GitHub username and invite him.

No tone-recommendation features or third-party integrations are implemented yet.

## Future hardware milestone
- Collect prototype specifications and verify supported device protocols.
- Define structured tone recipes and device capability mappings before implementing exports.
- Design and test computer-to-controller transfer, offline recipe use, and supported downstream control.
- See HARDWARE.md; hardware integration is not implemented.
