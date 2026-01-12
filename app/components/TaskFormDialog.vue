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
import type { TaskStatus, Priority } from "~~/generated/prisma/enums";
import type { Task } from "~~/generated/prisma/client";

const props = withDefaults(
  defineProps<{
    open?: boolean;
    projectId: string;
    task?: Task | null;
    onRefresh?: () => void;
  }>(),
  {
    open: false,
    task: null,
    onRefresh: undefined,
  },
);

const emits = defineEmits<{
  "update:open": [value: boolean];
}>();

const formData = ref<{
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}>({
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
});

watch(
  () => props.task,
  (task) => {
    if (task) {
      const dueDateStr: string = task.dueDate
        ? (new Date(task.dueDate as string | Date).toISOString().split("T")[0] ?? "")
        : "";
      formData.value = {
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: dueDateStr,
      };
    } else {
      formData.value = {
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
      };
    }
  },
  { immediate: true },
);

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      formData.value = {
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
      };
    } else if (props.task) {
      let dueDateStr = "";
      if (props.task.dueDate) {
        const date = new Date(props.task.dueDate as string | Date);
        const isoString = date.toISOString();
        const datePart = isoString.split("T")[0];
        if (datePart) {
          dueDateStr = datePart;
        }
      }
      formData.value = {
        title: props.task.title,
        description: props.task.description ?? "",
        status: props.task.status,
        priority: props.task.priority,
        dueDate: dueDateStr,
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
  if (!formData.value.title.trim()) {
    return;
  }

  try {
    await $fetch(ROUTES.API.PROJECT_TASKS(props.projectId), {
      method: "POST",
      body: {
        title: formData.value.title,
        description: formData.value.description || null,
        status: formData.value.status,
        priority: formData.value.priority,
        dueDate: formData.value.dueDate || null,
      },
    });
    isOpen.value = false;
    props.onRefresh?.();
  } catch (error) {
    console.error("Failed to create task:", error);
    alert("Failed to create task");
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
        <DialogTitle>Create Task</DialogTitle>
        <DialogDescription> Add a new task to this project. </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <FormItem>
          <Label>Title</Label>
          <Input v-model="formData.title" placeholder="Task title" required />
        </FormItem>
        <FormItem>
          <Label>Description</Label>
          <Input v-model="formData.description" placeholder="Task description (optional)" />
        </FormItem>
        <FormItem>
          <Label>Status</Label>
          <select
            v-model="formData.status"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </FormItem>
        <FormItem>
          <Label>Priority</Label>
          <select
            v-model="formData.priority"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </FormItem>
        <FormItem>
          <Label>Due Date</Label>
          <Input v-model="formData.dueDate" type="date" />
        </FormItem>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancel</Button>
        <Button @click="handleSubmit">Create</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
