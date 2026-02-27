# Plan: Auto-generate file tree from `materials/` folder

## Context
Currently `src/data/fileSystem.js` has a hardcoded file tree with placeholder PDFs. Teachers need to drag-and-drop files into the GitHub repo and have the site auto-rebuild with the new files visible and downloadable. We'll use a build-time Node script that scans a `public/materials/` directory and generates the file system data.

## How it works for teachers
1. Go to the repo on GitHub → navigate to `public/materials/Semester 1/Subject Name/Notes/`
2. Click "Add file" → drag and drop PDFs/docs
3. Commit — GitHub Actions auto-rebuilds and deploys

## Changes

### 1. Create `scripts/generate-fs.js` (new file)
A Node script that:
- Recursively walks `public/materials/` using `fs` and `path`
- Builds the same tree structure used today (`{ id, name, type, path, children, fileType, size, modified }`)
- Gets real file sizes (formatted as KB/MB) and modified dates from `fs.statSync`
- Writes the result to `src/data/fileSystem.generated.js` as an ES module export
- Preserves the existing `findNodeByPath`, `getBreadcrumbs`, and `getFolderTree` utilities

### 2. Seed `public/materials/` folder structure
- Create the semester/subject/material-type folder hierarchy with `.gitkeep` files so the empty folders are committed
- Remove the old placeholder PDF data from `fileSystem.js`

### 3. Update `src/data/fileSystem.js`
- Replace the hardcoded `buildFileSystem()` with an import from the generated file
- Keep `findNodeByPath`, `getBreadcrumbs`, `getFolderTree` unchanged — they just operate on the imported tree

### 4. Update `package.json` build script
- Change `"build": "vite build"` → `"build": "node scripts/generate-fs.js && vite build"`
- Add `"generate-fs": "node scripts/generate-fs.js"` for local dev use

### 5. Update deploy workflow (`.github/workflows/deploy.yml`)
- No change needed — it already runs `npm run build`, which will now include the generate step

### 6. Wire up file downloads
- Currently clicking a file does nothing (only folders navigate). Add a download link so clicking a file opens/downloads it from `public/materials/`
- In `Explorer.jsx` `handleOpenItem`: if `item.type === "file"`, open the file URL (`/materials/...path`) in a new tab

## Files to modify
- `scripts/generate-fs.js` — **new**
- `src/data/fileSystem.js` — rewrite to import generated data
- `package.json` — update build script
- `src/pages/Explorer.jsx` — add file download/open behavior
- `public/materials/` — **new** folder structure with `.gitkeep` files

## Verification
1. Run `node scripts/generate-fs.js` — should produce `src/data/fileSystem.generated.js`
2. Run `npm run build` — should succeed
3. Run `npm run dev` — explorer should show the folder structure (empty folders with `.gitkeep` hidden)
4. Drop a test file into `public/materials/Semester 1/.../Notes/`, re-run generate, confirm it appears
