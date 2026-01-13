<script setup lang="ts">
import ProjectCard from "~/components/ProjectCard.vue";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-vue-next";
import type { Project } from "~~/generated/prisma/client";

const props = defineProps<{
  projects: Project[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onCreate?: () => void;
}>();
</script>

<template>
  <div v-if="isLoading" class="text-center py-12">
    <p class="text-editorial-slate">Loading projects...</p>
  </div>

  <div v-else-if="projects.length === 0" class="text-center py-12">
    <p class="text-editorial-slate mb-4">No projects yet. Create your first project to get started!</p>
    <Button class="bg-editorial-accent hover:bg-editorial-accent/90 text-white" @click="props.onCreate?.()">
      <Plus class="h-4 w-4 mr-2" />
      Create Project
    </Button>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <ProjectCard v-for="project in projects" :key="project.id" :project="project" :on-refresh="onRefresh" />
  </div>
</template>
