# ASIET MCA — Course Materials & Entrance Resources

A web platform for the **Master of Computer Applications (MCA)** programme at **Adi Shankara Institute of Engineering & Technology (ASIET)**, Kalady, Kerala.

**Live site:** [asiet-mca.github.io](https://asiet-mca.github.io)

## Features

- **File Explorer** — Browse course materials (notes, assignments, question papers, lab records) across all 4 semesters with grid/list views, breadcrumb navigation, and collapsible folder tree
- **LBS Entrance Exam Resources** — Complete preparation guide for the Kerala LBS MCA entrance exam — syllabus, exam pattern, 35+ downloadable study materials, preparation strategy, and FAQs
- **Department Home Page** — Faculty profiles, research areas, recent activities, achievements, gallery, and LBS entrance exam quick facts
- **Faculty Admin Portal** — Authenticated file upload, folder management, and content organization via GitHub API
- **Contribution System** — Encrypted submission form for students to contribute materials, committed to the repo via GitHub API
- **Mobile Responsive** — Mobile-first design across all pages
- **SEO Optimized** — Per-page meta tags, Open Graph, structured data (FAQ schema, Course schema), 35+ targeted keywords

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| TanStack React Query 5 | Data fetching & caching |
| Motion 12 | Animations |
| Phosphor Icons | Iconography (duotone) |
| GitHub API | Dynamic content & file management |
| AES-256-GCM | Encryption for admin auth & contributions |

## Pages

| Route | Description |
|---|---|
| `/` | Department home page |
| `/explorer` | File explorer for course materials |
| `/entrance` | LBS MCA entrance exam resources |
| `/contribute` | Submit materials (encrypted form) |
| `/open-source` | Developer contribution guide |
| `/admin` | Faculty admin portal |

## Getting Started

```bash
git clone https://github.com/asiet-mca/asiet-mca.github.io
cd asiet-mca.github.io
npm install
npm run dev
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Branch naming and commit conventions
- Pull request process
- Design system reference
- How to contribute study materials

Check the [open issues](https://github.com/asiet-mca/asiet-mca.github.io/issues) for things to work on — look for `good first issue` labels.

## Project Structure

```
src/
├── pages/          # Route pages (Home, Explorer, Admin, Entrance, Contribute, OpenSource)
├── components/     # Reusable UI (Sidebar, FileGrid, PathBar, FileIcon, FolderTree)
├── hooks/          # Custom hooks (useGitHubExplorer)
├── services/       # GitHub API service
├── lib/            # Crypto utilities, helpers
├── data/           # File system types & structure
└── index.css       # Tailwind theme, CSS variables, animations
```

## License

This project is maintained by the ASIET MCA department. Open source contributions are welcome.
