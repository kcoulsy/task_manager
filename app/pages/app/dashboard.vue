<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-vue-next";
import ProjectsList from "@/components/ProjectsList.vue";
import ProjectFormDialog from "@/components/ProjectFormDialog.vue";
import { ROUTES } from "~~/utils/routes";
import type { Project } from "~~/generated/prisma/client";

const isDialogOpen = ref(false);
const editingProject = ref<Project | null>(null);

definePageMeta({
  middleware: "require-auth",
});

const { data: session } = await useFetch("/api/session", {
  server: true,
});

const {
  data: projects,
  refresh: refreshProjects,
  pending: isLoading,
} = await useFetch<Project[]>(ROUTES.API.PROJECTS, {
  server: true,
});

const openCreateDialog = () => {
  editingProject.value = null;
  isDialogOpen.value = true;
};

const openEditDialog = (project: Project) => {
  editingProject.value = project;
  isDialogOpen.value = true;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome back, {{ session?.user?.email }}!</h1>
        <p class="text-gray-600">Manage your projects and tasks.</p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="h-4 w-4 mr-2" />
        New Project
      </Button>
    </div>

    <ProjectsList
      :projects="projects || []"
      :is-loading="isLoading"
      :on-edit="openEditDialog"
      :on-refresh="refreshProjects"
      :on-create="openCreateDialog"
    />

    <ProjectFormDialog v-model:open="isDialogOpen" :project="editingProject" :on-refresh="refreshProjects" />
  </div>
</template>
