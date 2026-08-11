"use client";

import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type ProjectStatus,
  type SavedProject,
} from "../lib/projectStorage";

export default function ProjectManager() {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [projectName, setProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] =
    useState<string | null>(null);

  function refreshProjects() {
    setProjects(getProjects());
  }

  useEffect(() => {
    refreshProjects();
  }, []);

  function handleCreateProject() {
    const name = projectName.trim();

    if (!name) {
      return;
    }

    const project = createProject(name);

    setProjectName("");
    setSelectedProjectId(project.id);
    refreshProjects();
  }

  function handleDeleteProject(id: string) {
    deleteProject(id);

    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }

    refreshProjects();
  }

  function handleStatusChange(
    project: SavedProject,
    status: ProjectStatus
  ) {
    updateProject({
      ...project,
      status,
      updatedAt: new Date().toISOString(),
    });

    refreshProjects();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-KE",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  const selectedProject = projects.find(
    (project) =>
      project.id === selectedProjectId
  );

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Milestone 7
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Project Manager
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage your YouBuild
            construction projects.
          </p>
        </div>

        <div className="rounded-xl bg-green-50 px-4 py-3 text-center">
          <p className="text-xs text-green-700">
            Saved projects
          </p>

          <p className="text-2xl font-bold text-green-800">
            {projects.length}
          </p>
        </div>
      </div>

      {/* CREATE PROJECT */}

      <div className="mt-6 rounded-2xl bg-gray-50 p-5">
        <h3 className="font-semibold">
          Create a new project
        </h3>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={projectName}
            onChange={(event) =>
              setProjectName(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCreateProject();
              }
            }}
            placeholder="e.g. My 3 Bedroom House"
            className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
          />

          <button
            onClick={handleCreateProject}
            disabled={!projectName.trim()}
            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Create Project
          </button>
        </div>
      </div>

      {/* PROJECT LIST */}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Your projects
          </h3>

          <button
            onClick={refreshProjects}
            className="text-xs font-semibold text-green-600 hover:text-green-700"
          >
            Refresh
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed p-8 text-center">
            <p className="font-semibold text-gray-700">
              No projects yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Create your first project above.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {projects.map((project) => {
              const selected =
                project.id ===
                selectedProjectId;

              return (
                <div
                  key={project.id}
                  className={`rounded-2xl border p-4 transition ${
                    selected
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() =>
                        setSelectedProjectId(
                          project.id
                        )
                      }
                      className="text-left"
                    >
                      <p className="font-semibold">
                        {project.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Created{" "}
                        {formatDate(
                          project.createdAt
                        )}
                        {" · "}
                        Updated{" "}
                        {formatDate(
                          project.updatedAt
                        )}
                      </p>
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={project.status}
                        onChange={(event) =>
                          handleStatusChange(
                            project,
                            event.target
                              .value as ProjectStatus
                          )
                        }
                        className="rounded-lg border px-3 py-2 text-xs font-medium"
                      >
                        <option value="Draft">
                          Draft
                        </option>

                        <option value="Planning">
                          Planning
                        </option>

                        <option value="Ready">
                          Ready
                        </option>

                        <option value="Completed">
                          Completed
                        </option>
                      </select>

                      <button
                        onClick={() =>
                          handleDeleteProject(
                            project.id
                          )
                        }
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SELECTED PROJECT */}

      {selectedProject && (
        <div className="mt-6 rounded-2xl border-2 border-green-200 bg-green-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
            Selected project
          </p>

          <h3 className="mt-1 text-xl font-bold text-green-900">
            {selectedProject.name}
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-500">
                Status
              </p>

              <p className="mt-1 font-semibold">
                {selectedProject.status}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-500">
                Created
              </p>

              <p className="mt-1 font-semibold">
                {formatDate(
                  selectedProject.createdAt
                )}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-500">
                Last updated
              </p>

              <p className="mt-1 font-semibold">
                {formatDate(
                  selectedProject.updatedAt
                )}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-green-800">
            Project data is currently saved
            locally in this browser. Later,
            Milestone 7 can be connected to
            accounts and cloud storage.
          </p>
        </div>
      )}
    </section>
  );
}