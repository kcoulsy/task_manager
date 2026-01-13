<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-vue-next";
import ProjectsList from "~/components/ProjectsList.vue";
import ProjectFormDialog from "~/components/ProjectFormDialog.vue";
import { ROUTES } from "~~/utils/routes";
import { useDialogStore } from "~/stores/dialogStore";
import type { Project } from "~~/generated/prisma/client";

definePageMeta({
  middleware: "require-auth",
});

useHead({
  title: "Dashboard - Task Manager",
  meta: [
    {
      name: "description",
      content: "Manage your projects and tasks from your dashboard.",
    },
  ],
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
  <div class="min-h-screen bg-gradient-to-br from-indigo-50/30 via-slate-50 to-blue-50/20">
    <div class="max-w-[1400px] mx-auto pb-8 px-6 space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-display font-bold tracking-tight text-editorial-navy mb-2">
            Welcome back, {{ session?.user?.email }}!
          </h1>
          <p class="text-editorial-slate">Manage your projects and tasks.</p>
        </div>
        <Button class="bg-editorial-accent hover:bg-editorial-accent/90 text-white" @click="openCreateDialog">
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
  </div>
</template>
