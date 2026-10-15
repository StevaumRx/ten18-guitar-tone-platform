# Contributing to Ten18

Estevão and Vini collaborate through the same private GitHub repository. Each person uses their own GitHub account and local checkout. Codex and Claude Code can both work on this source tree.

## First setup

After the repository files have been uploaded and your GitHub invitation is accepted:

```sh
git clone https://github.com/StevaumRx/ten18-guitar-tone-platform.git
cd ten18-guitar-tone-platform
npm ci
npm run dev
```

Use Node.js 24 or newer. Open http://127.0.0.1:3000.

## One branch per task

Start from an up-to-date main branch in a clean checkout:

```sh
git switch main
git pull --ff-only
git switch -c feature/short-description
```

Agree who owns the task before editing. Use GitHub issues for the goal and acceptance criteria. Keep one person or tool session responsible for a given checkout at a time. For concurrent Codex and Claude work, use separate clones or Git worktrees with different branches. Branches alone do not isolate two tools editing the same folder.

Before committing, inspect `git status` and `git diff`, run `npm run check` and `npm test`, then stage only the intended files:

```sh
git add path/to/changed-file
git commit -m "Describe the change"
git push -u origin HEAD
```

Open a pull request into main. Ask the other contributor to review it, resolve conflicts, and confirm CI passes before merging. This is a team convention; server-side branch protection is not configured yet.

## Codex and Claude Code

Codex uses AGENTS.md. CLAUDE.md imports those shared instructions and this guide. Start Claude Code from the repository root using your own installed and authenticated Claude Code client. Check its loaded context with `/context`.

Assign a bounded task: goal, files or area, acceptance criteria, and expected checks. When changing tools, finish or clearly hand off the current work first. An AI chat history is not automatically shared with another tool or contributor.

For each handoff, include:
- The branch and latest commit.
- What changed and what remains.
- Tests run and their results, including blocked checks.
- Decisions or unresolved questions.

Record durable decisions in docs/DECISIONS.md and update the roadmap when scope changes. A commit or PR description is the normal place for a task handoff.

## Access and secrets

The owner invites collaborators through GitHub Settings → Collaborators after verifying their GitHub usernames. Contributors need permission to push branches and open pull requests. Each contributor uses their own GitHub and AI credentials. Repository access does not supply a Claude subscription, API credits, or deployment access.

Keep local tool settings and credentials out of Git. Share required variable names in .env.example, with real values delivered separately when needed.
