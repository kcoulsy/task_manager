<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { FormItem } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~~/utils/routes";
import { useDialogStore } from "~/stores/dialogStore";
import { toast } from "vue-sonner";

const props = defineProps<{
  onRefresh?: () => void;
}>();

const store = useDialogStore();

const formData = ref({
  name: "",
  description: "",
});

const isSubmitting = ref(false);

watch(
  () => store.isProjectDialogOpen,
  (isOpen) => {
    if (isOpen && store.editingProject) {
      formData.value = {
        name: store.editingProject.name,
        description: store.editingProject.description || "",
      };
    } else if (!isOpen) {
      formData.value = { name: "", description: "" };
    }
  },
);

const isOpen = computed({
  get: () => store.isProjectDialogOpen,
  set: (value: boolean) => {
    if (!value) {
      store.closeProjectDialog();
    }
  },
});

const isEditing = computed(() => store.editingProject !== null);

const handleSubmit = async () => {
  if (!formData.value.name.trim() || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    if (store.editingProject) {
      await $fetch(ROUTES.API.PROJECT(store.editingProject.id), {
        method: "PUT",
        body: formData.value,
      });
      toast.success("Project updated successfully");
    } else {
      await $fetch(ROUTES.API.PROJECTS, {
        method: "POST",
        body: formData.value,
      });
      toast.success("Project created successfully");
    }
    store.closeProjectDialog();
    props.onRefresh?.();
  } catch (error) {
    console.error("Failed to save project:", error);
    toast.error("Failed to save project");
  } finally {
    isSubmitting.value = false;
  }
};

const handleClose = () => {
  store.closeProjectDialog();
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="font-display text-2xl text-editorial-navy">
          {{ isEditing ? "Edit Project" : "Create Project" }}
        </DialogTitle>
        <DialogDescription>
          {{ isEditing ? "Update your project details." : "Create a new project to organize your tasks." }}
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <FormItem>
          <Label class="text-xs font-mono uppercase tracking-wide text-slate-600">Name</Label>
          <Input v-model="formData.name" placeholder="Project name" required :disabled="isSubmitting" />
        </FormItem>
        <FormItem>
          <Label class="text-xs font-mono uppercase tracking-wide text-slate-600">Description</Label>
          <Input v-model="formData.description" placeholder="Project description (optional)" :disabled="isSubmitting" />
        </FormItem>
      </div>
      <DialogFooter>
        <Button variant="outline" :disabled="isSubmitting" @click="handleClose">Cancel</Button>
        <Button
          :disabled="isSubmitting"
          @click="handleSubmit"
          class="bg-editorial-accent hover:bg-editorial-accent/90 text-white"
        >
          {{ isSubmitting ? "Saving..." : isEditing ? "Update" : "Create" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
