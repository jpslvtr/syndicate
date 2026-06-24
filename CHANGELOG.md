# Change Log

## 2026-06-24 15:43 EDT — dependency security updates

- Updated client and Cloud Functions dependencies to clear known advisories (root 54→2, functions 41→0)
- Removed unused server-only deps from the client `package.json` (`firebase-admin`, `firebase-functions`, `nodemailer`)
- Removed unused `firebase-admin` / `firebase-functions-test` from functions; bumped `nodemailer` and `firebase-functions` (gen-1 API kept via `firebase-functions/v1`)
- Bumped client to Vite 8 and pinned a patched `undici`; build verified
- Remaining 2 advisories are in `react-quill`/`quill`, which can't be upgraded without breaking the editor

## 2026-06-24 15:19 EDT — repo hygiene

- Moved email credentials to `functions/.env` (out of source control)
- Moved Firebase web config to `VITE_FIREBASE_*` env vars; added `.env.example` and `functions/.env.example`
- Stopped tracking `node_modules/` and all `.DS_Store` files (kept on disk)
- Deleted stray `src/repopack-output.txt` dump and empty `.editorconfig`
- Expanded `.gitignore` (`.DS_Store`, `.vite/`, `dist/`, tooling dumps, `CLAUDE.md`)
- Rewrote README into a concise setup-focused version

## [2.1.0] 2023-11-14
- Upgrade to Material Tailwind `v2`

## [2.0.1] 2023-03-29

- Add nepcha scripts

## [2.0.0] 2022-11-02

- Update the entire structure
- Migration to vite
- Migration to React 18
- Migration to React Router DOM 6
- Migration to @material-tailwind/react latest version
- Migration from chart.js to apexcharts
- Add global context support

## [1.1.0] 2021-06-10

### New Features

- Add the download button

### Bug Fixing

- Fix the dropdown of admin navbar

## [1.0.0] 2021-06-08

### Original Release

- Started project from [Material Tailwind Dashboard React](https://www.creative-tim.com/product/material-tailwind-dashboard-react?ref=changelog-mtdr)
- Updated all dependencies from [Material Tailwind Dashboard React](https://www.creative-tim.com/product/material-tailwind-dashboard-react?ref=changelog-mtdr) and those dependencies that were not working with the new React v17+ API, were deleted and/or replaced

### Warning

_Warnings might appear while doing a clean npm install - they do not affect the UI or the functionality of the product, and they appear because of NodeJS and not from the product itself._
_This product was designed and developed using NodeJS version 14.16.0 LTS, so please make sure to have a compatible version of NodeJS._
