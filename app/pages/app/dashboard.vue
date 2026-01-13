<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-vue-next";
import ProjectsList from "@/components/ProjectsList.vue";
import ProjectFormDialog from "@/components/ProjectFormDialog.vue";
import { ROUTES } from "~~/utils/routes";
import { useDialogStore } from "@/stores/dialogStore";
import type { Project } from "~~/generated/prisma/client";

definePageMeta({
  middleware: "require-auth",
});

// Must call composables BEFORE any await statements
const dialogStore = useDialogStore();

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
  dialogStore.openCreateProjectDialog();
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
      :on-refresh="refreshProjects"
      :on-create="openCreateDialog"
    />

    <ClientOnly>
      <ProjectFormDialog :on-refresh="refreshProjects" />
    </ClientOnly>
  </div>
</template>
