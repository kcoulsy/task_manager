<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "~~/utils/routes";
import type { Project } from "~~/generated/prisma/client";

const props = withDefaults(
  defineProps<{
    open?: boolean;
    project?: Project | null;
    onRefresh?: () => void;
  }>(),
  {
    open: false,
    project: null,
    onRefresh: undefined,
  },
);

const emits = defineEmits<{
  "update:open": [value: boolean];
}>();

const formData = ref({
  name: "",
  description: "",
});

watch(
  () => props.project,
  (project) => {
    if (project) {
      formData.value = {
        name: project.name,
        description: project.description || "",
      };
    } else {
      formData.value = { name: "", description: "" };
    }
  },
  { immediate: true },
);

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      formData.value = { name: "", description: "" };
    } else if (props.project) {
      formData.value = {
        name: props.project.name,
        description: props.project.description || "",
      };
    }
  },
);

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    emits("update:open", value);
  },
});

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    return;
  }

  try {
    if (props.project) {
      await $fetch(ROUTES.API.PROJECT(props.project.id), {
        method: "PUT",
        body: formData.value,
      });
    } else {
      await $fetch(ROUTES.API.PROJECTS, {
        method: "POST",
        body: formData.value,
      });
    }
    isOpen.value = false;
    props.onRefresh?.();
  } catch (error) {
    console.error("Failed to save project:", error);
    alert("Failed to save project");
  }
};

const handleClose = () => {
  isOpen.value = false;
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ project ? "Edit Project" : "Create Project" }}</DialogTitle>
        <DialogDescription>
          {{ project ? "Update your project details." : "Create a new project to organize your tasks." }}
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <FormItem>
          <Label>Name</Label>
          <Input v-model="formData.name" placeholder="Project name" required />
        </FormItem>
        <FormItem>
          <Label>Description</Label>
          <Input v-model="formData.description" placeholder="Project description (optional)" />
        </FormItem>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancel</Button>
        <Button @click="handleSubmit">{{ project ? "Update" : "Create" }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
