# Contributing to ASIET MCA

Thank you for your interest in contributing to the ASIET MCA platform! This is an open source project by the Department of Computer Applications at Adi Shankara Institute of Engineering & Technology, Kalady.

## Getting Started

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/asiet-mca.github.io
cd asiet-mca.github.io

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Create a branch for your changes
git checkout -b feat/your-feature
```

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.9 | Static typing |
| Vite | 7 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router | 7 | Client-side routing |
| TanStack React Query | 5 | Data fetching & caching |
| Phosphor Icons | — | Icon library (duotone weight) |
| Motion | 12 | Animations |
| GitHub API | — | Dynamic file content |

## Project Structure

```
src/
├── pages/          # Route pages (Home, Explorer, Admin, Entrance, Contribute, OpenSource)
├── components/     # Reusable UI (Sidebar, FileGrid, PathBar, FileIcon, FolderTree)
├── hooks/          # Custom hooks (useGitHubExplorer)
├── services/       # API services (github.ts)
├── lib/            # Utilities (crypto.ts, utils.ts)
├── data/           # File system types & structure
├── assets/         # Static assets
└── index.css       # Tailwind theme, CSS variables, animations
```

## Branch Naming Convention

Format: `type/short-description`

| Prefix | Use for | Example |
|---|---|---|
| `feat/` | New features | `feat/dark-mode` |
| `fix/` | Bug fixes | `fix/mobile-sidebar-overlap` |
| `docs/` | Documentation | `docs/update-syllabus` |
| `style/` | UI/styling changes | `style/faculty-card-hover` |
| `refactor/` | Code refactoring | `refactor/extract-footer` |
| `perf/` | Performance | `perf/lazy-load-images` |
| `chore/` | Build, deps, config | `chore/update-vite` |

## Commit Message Convention

Format: `type: short description`

```
feat: add search functionality to file explorer
fix: correct LBS exam pattern data
style: improve mobile nav spacing
docs: update entrance exam syllabus
refactor: extract shared footer component
perf: lazy load gallery images
chore: update dependencies
```

**Rules:**
- Use lowercase
- No period at the end
- Keep under 72 characters
- Use imperative mood ("add" not "added")

## Pull Request Process

1. Create a branch from `main` following the naming convention
2. Make your changes with clear, atomic commits
3. Test locally — run `npm run dev` and verify `npm run build` succeeds
4. Push to your fork and open a PR against `main`
5. Describe **what** you changed and **why** in the PR description
6. A maintainer will review and merge — 1 approval required

## Design System

The platform uses a consistent design system. Please match it when making UI changes.

**Colors** (defined in `src/index.css`):
- Accent: `#0C4A6E` (dark sky blue), Light: `#0369A1`, Muted: `#E0F2FE`
- Background: `#F8F8F8`, Surface: `#FFFFFF`
- Text: Primary `#1C2024`, Secondary `#60646C`, Tertiary `#8B8D98`

**Typography:**
- Display/headings: `Newsreader` (serif)
- Body: `DM Sans` (sans-serif)
- Code/mono: `JetBrains Mono`

**Patterns:**
- Sections alternate between `bg-surface` and `bg-bg` with `border-b border-border`
- Section headers: uppercase, `text-[11px]`, tracking-wide, with a Phosphor duotone icon prefix
- Max content width: `max-w-5xl mx-auto px-4 sm:px-6`
- Mobile-first responsive (breakpoint at `sm:` / 640px)
- Animations: use `motion/react` for scroll reveals and interactions

## Contributing Study Materials

You don't need to write code to contribute! You can share:
- Class notes (PDF, DOCX)
- Question papers
- Assignments & lab records
- LBS entrance exam materials
- Study guides & formula sheets

**Option 1:** Use the [contribution form](https://asiet-mca.github.io/contribute) on the website.

**Option 2:** Add files directly via PR:
1. Place materials in `public/materials/entrance/` (for entrance prep) or coordinate with maintainers for semester materials
2. Use clean filenames: `subject-name-topic.pdf` (lowercase, hyphens, no spaces)
3. Open a PR with a description of what you're adding

## What NOT to Do

- Don't commit `.env` files or any secrets/tokens
- Don't push directly to `main` — always open a PR
- Don't modify the `materials/` directory structure without discussion
- Don't add new npm dependencies without discussing in an issue first
- Don't include copyrighted textbook scans

## Need Help?

- Browse [open issues](https://github.com/asiet-mca/asiet-mca.github.io/issues) — look for `good first issue` labels
- Check the [open source guide](https://asiet-mca.github.io/open-source) on the website
- Open an issue if you have questions or ideas
