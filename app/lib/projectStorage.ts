export type ProjectStatus =
  | "Draft"
  | "Planning"
  | "Ready"
  | "Completed";

export type SavedProject = {
  id: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "youbuild_projects";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getProjects(): SavedProject[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveProjects(
  projects: SavedProject[]
): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projects)
  );
}

export function createProject(
  name: string
): SavedProject {
  const now = new Date().toISOString();

  const project: SavedProject = {
    id: crypto.randomUUID(),
    name: name.trim() || "Untitled Project",
    status: "Draft",
    createdAt: now,
    updatedAt: now,
  };

  const projects = getProjects();

  saveProjects([
    project,
    ...projects,
  ]);

  return project;
}

export function updateProject(
  updatedProject: SavedProject
): void {
  const projects = getProjects();

  const updatedProjects = projects.map(
    (project) =>
      project.id === updatedProject.id
        ? {
            ...updatedProject,
            updatedAt: new Date().toISOString(),
          }
        : project
  );

  saveProjects(updatedProjects);
}

export function deleteProject(
  projectId: string
): void {
  const projects = getProjects();

  saveProjects(
    projects.filter(
      (project) => project.id !== projectId
    )
  );
}

export function getProject(
  projectId: string
): SavedProject | null {
  const projects = getProjects();

  return (
    projects.find(
      (project) => project.id === projectId
    ) ?? null
  );
}