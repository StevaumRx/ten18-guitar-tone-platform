# Development

Node.js 24 is the CI baseline. `npm ci` reproduces the dependency state from package-lock.json; there are no external dependencies yet.

`npm run dev` starts a loopback-only development server. The server reloads when its JavaScript changes; refresh the browser after editing public/index.html.

`GET /` serves the development page; `GET /health` returns JSON. Other paths return 404 and unsupported methods return 405. The server intentionally serves only these routes; add explicit routes as the application grows.

Run `npm run check` and `npm test` before pushing. GitHub Actions is configured on main pushes and pull requests. Branch protection and hosted previews are not configured.

Create an experiment in its own experiments/ subfolder and include its goal, run steps, findings, and the decision to keep or discard it. Do not put API keys in browser code. Add configuration names to .env.example as services are introduced; the current server does not load .env files.
