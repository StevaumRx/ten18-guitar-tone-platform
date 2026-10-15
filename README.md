# Ten18 — Guitar Tone Platform

Development home for the Ten18 Guitar Tone Platform. This repository starts with a working local development environment and automated checks. This is an add-on tool for the Ten18 Store website, supporting existing and future clients, with future controller integration. It is not intended as a separately sold product. The name is provisional. The product will turn a reference song or guitar part into manual settings for the user’s own equipment. See [the product scope](docs/PRODUCT.md). The application stack remains to be decided.

## Run locally

Use Node.js 24 or newer. No external packages are required for this initial scaffold.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Use `PORT=3001 npm run dev` to change the port. Stop with Ctrl+C.

## Verify changes

```sh
npm run check
npm test
```

GitHub Actions runs these checks on pushes and pull requests. The initial tests cover HTTP routing, missing pages, and unsupported methods. These are infrastructure tests, not product acceptance tests.

## Structure

| Folder | Purpose |
| --- | --- |
| `src/` | Application source |
| `public/` | Browser files and static assets |
| `tests/` | Automated tests |
| `scripts/` | Development tooling |
| `docs/` | Scope, decisions, and working process |
| `experiments/` | Isolated prototypes with notes |
| `assets/` | Original design assets; no licensed third-party audio |
| `.github/` | CI and issue/PR templates |

## Working process

Start a feature branch (`git switch -c feature/short-name`), make a focused change, run the checks, commit, and push. Open a pull request into `main`. Use experiments for uncertain ideas and move accepted code into `src/` with relevant tests.

The GitHub repository stores source and runs checks. It does not yet deploy a public application or preview website. See [the roadmap](docs/ROADMAP.md) and [development notes](docs/DEVELOPMENT.md).

## Team and AI collaboration

See [CONTRIBUTING.md](CONTRIBUTING.md) for contributor setup, branches, reviews, and working with Codex and Claude Code. Shared instructions live in AGENTS.md; CLAUDE.md imports them for Claude Code.
