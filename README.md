# ASIET MCA Course Materials Repository

A web-based file explorer and course materials repository for the **Master of Computer Applications (MCA)** program at **Adi Shankara Institute of Engineering & Technology (ASIET)**, Kalady, India.

**Live site:** [asiet-mca.github.io](https://asiet-mca.github.io)

## Features

- **File Explorer** — Browse course materials (notes, assignments, question papers, lab records) across all 4 semesters with grid/list views, breadcrumb navigation, and a collapsible folder tree sidebar
- **Department Home Page** — Landing page with faculty profiles, research areas, recent activities, achievements, and department gallery
- **Mobile Responsive** — Fully responsive design with mobile sidebar overlay, scrollable breadcrumbs, and adaptive grid layouts
- **SEO Optimized** — Open Graph tags, structured data, sitemap, and robots.txt

## Tech Stack

- **React 19** with React Router 7
- **Tailwind CSS 4** for styling
- **Vite 7** for builds and dev server
- **Phosphor Icons** + **Lucide React** for iconography

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── pages/          # Home and Explorer pages
├── components/     # FileGrid, Sidebar, FolderTree, PathBar, FileIcon
├── data/           # Course material file system structure
└── index.css       # Tailwind config and custom theme
```

## License

This project is maintained by the ASIET MCA department.
