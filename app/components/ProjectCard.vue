<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-vue-next";
import { ROUTES } from "~~/utils/routes";
import { useDialogStore } from "@/stores/dialogStore";
import type { Project } from "~~/generated/prisma/client";

const props = defineProps<{
  project: Project;
  onRefresh?: () => void;
}>();

const dialogStore = useDialogStore();

const handleEdit = (event: Event) => {
  event.stopPropagation();
  dialogStore.openEditProjectDialog(props.project);
};

const handleDelete = async (event: Event) => {
  event.stopPropagation();
  if (!confirm(`Are you sure you want to delete "${props.project.name}"?`)) {
    return;
  }

  try {
    await $fetch(ROUTES.API.PROJECT(props.project.id), {
      method: "DELETE",
    });
    props.onRefresh?.();
  } catch (error) {
    console.error("Failed to delete project:", error);
    alert("Failed to delete project");
  }
};

const handleClick = () => {
  navigateTo(ROUTES.APP.PROJECT(props.project.id));
};
</script>

<template>
  <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="handleClick">
    <CardHeader>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <CardTitle>{{ project.name }}</CardTitle>
          <CardDescription v-if="project.description">{{ project.description }}</CardDescription>
        </div>
        <CardAction class="flex gap-2">
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="handleEdit">
            <Pencil class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="h-8 w-8 p-0 text-destructive hover:text-destructive"
            @click="handleDelete"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </CardAction>
      </div>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground">Created {{ new Date(project.createdAt).toLocaleDateString() }}</p>
    </CardContent>
  </Card>
</template>
