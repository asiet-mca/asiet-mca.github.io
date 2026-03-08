export interface FileSystemNode {
  id: string;
  name: string;
  type: "folder" | "file";
  path: string;
  children?: FileSystemNode[];
  fileType?: string;
  size?: string;
  modified?: string;
}

export interface Breadcrumb {
  name: string;
  path: string;
}

const materialTypes = ["Notes", "Assignments", "Question Papers", "Lab Records"];

const semesters = [
  {
    name: "Semester 1",
    subjects: [
      "Discrete Mathematics",
      "Computer Organization & Architecture",
      "Data Structures Using C",
      "Programming in Python",
      "Professional Communication",
    ],
  },
  {
    name: "Semester 2",
    subjects: [
      "Operating Systems",
      "Database Management Systems",
      "Object Oriented Programming Using Java",
      "Computer Networks",
      "Optimization Techniques",
    ],
  },
  {
    name: "Semester 3",
    subjects: [
      "Machine Learning",
      "Web Technologies",
      "Software Engineering",
      "Data Mining & Warehousing",
      "Cloud Computing",
    ],
  },
  {
    name: "Semester 4",
    subjects: [
      "Artificial Intelligence",
      "Distributed Systems",
      "Cyber Security",
      "Project & Viva Voce",
      "Seminar",
    ],
  },
];

// Build a flat file system tree
// Each node: { id, name, type: 'folder'|'file', children: [], path: string }

let idCounter = 0;
function nextId(): string {
  return `node-${++idCounter}`;
}

function buildFileSystem(): FileSystemNode {
  const root: FileSystemNode = {
    id: nextId(),
    name: "ASIET MCA",
    type: "folder",
    path: "/",
    children: [],
  };

  for (const sem of semesters) {
    const semNode: FileSystemNode = {
      id: nextId(),
      name: sem.name,
      type: "folder",
      path: `/${sem.name}`,
      children: [],
    };

    for (const subject of sem.subjects) {
      const subNode: FileSystemNode = {
        id: nextId(),
        name: subject,
        type: "folder",
        path: `/${sem.name}/${subject}`,
        children: [],
      };

      for (const mat of materialTypes) {
        const matNode: FileSystemNode = {
          id: nextId(),
          name: mat,
          type: "folder",
          path: `/${sem.name}/${subject}/${mat}`,
          children: [
            // Sample placeholder files
            {
              id: nextId(),
              name: `${mat.replace(/s$/, "")} - Unit 1.pdf`,
              type: "file",
              fileType: "pdf",
              size: "2.4 MB",
              modified: "2025-08-15",
              path: `/${sem.name}/${subject}/${mat}/${mat.replace(/s$/, "")} - Unit 1.pdf`,
            },
            {
              id: nextId(),
              name: `${mat.replace(/s$/, "")} - Unit 2.pdf`,
              type: "file",
              fileType: "pdf",
              size: "1.8 MB",
              modified: "2025-09-02",
              path: `/${sem.name}/${subject}/${mat}/${mat.replace(/s$/, "")} - Unit 2.pdf`,
            },
          ],
        };
        subNode.children!.push(matNode);
      }

      semNode.children!.push(subNode);
    }

    root.children!.push(semNode);
  }

  return root;
}

export const fileSystem = buildFileSystem();

// Utility: find node by path
export function findNodeByPath(path: string): FileSystemNode | null {
  if (path === "/") return fileSystem;

  const parts = path.split("/").filter(Boolean);
  let current: FileSystemNode = fileSystem;

  for (const part of parts) {
    if (!current.children) return null;
    const child = current.children.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }

  return current;
}

// Utility: get breadcrumb segments from path
export function getBreadcrumbs(path: string): Breadcrumb[] {
  if (path === "/") return [{ name: "ASIET MCA", path: "/" }];

  const parts = path.split("/").filter(Boolean);
  const crumbs: Breadcrumb[] = [{ name: "ASIET MCA", path: "/" }];
  let currentPath = "";

  for (const part of parts) {
    currentPath += `/${part}`;
    crumbs.push({ name: part, path: currentPath });
  }

  return crumbs;
}

// Utility: get all folder paths for the sidebar tree
export function getFolderTree(): FileSystemNode {
  return fileSystem;
}
