import { defineStore } from "pinia";
import type { Project, Task } from "~~/generated/prisma/client";

export const useDialogStore = defineStore("dialog", {
  state: () => ({
    isProjectDialogOpen: false,
    editingProject: null as Project | null,
    isTaskDialogOpen: false,
    editingTask: null as Task | null,
    taskDialogProjectId: null as string | null,
  }),

  actions: {
    openCreateProjectDialog() {
      this.editingProject = null;
      this.isProjectDialogOpen = true;
    },
    openEditProjectDialog(project: Project) {
      this.editingProject = project;
      this.isProjectDialogOpen = true;
    },
    closeProjectDialog() {
      this.isProjectDialogOpen = false;
      this.editingProject = null;
    },
    openCreateTaskDialog(projectId: string) {
      this.editingTask = null;
      this.taskDialogProjectId = projectId;
      this.isTaskDialogOpen = true;
    },
    openEditTaskDialog(task: Task) {
      this.editingTask = task;
      this.taskDialogProjectId = task.projectId;
      this.isTaskDialogOpen = true;
    },
    closeTaskDialog() {
      this.isTaskDialogOpen = false;
      this.editingTask = null;
      this.taskDialogProjectId = null;
    },
  },
});
