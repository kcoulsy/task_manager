<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { DateValue } from "reka-ui";
import type { CalendarDate } from "@internationalized/date";
import type { WritableComputedRef } from "vue";
import { dateValueToString, stringToDateValue } from "~~/utils/date-helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { FormItem } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import DatePicker from "~/components/ui/date-picker/DatePicker.vue";
import { ROUTES } from "~~/utils/routes";
import { useDialogStore } from "~/stores/dialogStore";
import { useTaskHelpers } from "~/composables/useTaskHelpers";
import { toast } from "vue-sonner";
import type { TaskStatus, Priority } from "~~/generated/prisma/enums";

const props = defineProps<{
  onRefresh?: () => void;
}>();

const store = useDialogStore();
const { formatDateForInput, TASK_STATUS, PRIORITY, TASK_STATUS_LABELS, PRIORITY_LABELS, getStatusCircleColor } =
  useTaskHelpers();

type FormData = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: CalendarDate | null;
};

const getDefaultFormData = (): FormData => ({
  title: "",
  description: "",
  status: TASK_STATUS.TODO as TaskStatus,
  priority: PRIORITY.MEDIUM as Priority,
  dueDate: null,
});

const formData = ref<FormData>(getDefaultFormData());
const isSubmitting = ref(false);

watch(
  () => store.isTaskDialogOpen,
  (isOpen) => {
    if (isOpen && store.editingTask) {
      const dueDateString = formatDateForInput(store.editingTask.dueDate);
      formData.value = {
        title: store.editingTask.title,
        description: store.editingTask.description ?? "",
        status: store.editingTask.status,
        priority: store.editingTask.priority,
        dueDate: stringToDateValue(dueDateString) as CalendarDate | null,
      };
    } else if (!isOpen) {
      formData.value = getDefaultFormData();
    }
  },
);

const isOpen = computed({
  get: () => store.isTaskDialogOpen,
  set: (value: boolean) => {
    if (!value) {
      store.closeTaskDialog();
    }
  },
});

const isEditing = computed(() => store.editingTask !== null);

const dueDateModel: WritableComputedRef<DateValue | null> = computed({
  get: (): DateValue | null => {
    return formData.value.dueDate as unknown as DateValue | null;
  },
  set: (value: DateValue | null | undefined) => {
    if (value === null || value === undefined) {
      formData.value.dueDate = null;
    } else {
      formData.value.dueDate = value as CalendarDate;
    }
  },
});

const handleSubmit = async () => {
  if (!formData.value.title.trim() || isSubmitting.value || !store.taskDialogProjectId) {
    return;
  }

  isSubmitting.value = true;

  try {
    if (store.editingTask) {
      await $fetch(ROUTES.API.TASK(store.taskDialogProjectId, store.editingTask.id), {
        method: "PUT",
        body: {
          title: formData.value.title,
          description: formData.value.description || null,
          status: formData.value.status,
          priority: formData.value.priority,
          dueDate: dateValueToString(formData.value.dueDate as CalendarDate | null),
        },
      });
      toast.success("Task updated successfully");
    } else {
      await $fetch(ROUTES.API.PROJECT_TASKS(store.taskDialogProjectId), {
        method: "POST",
        body: {
          title: formData.value.title,
          description: formData.value.description || null,
          status: formData.value.status,
          priority: formData.value.priority,
          dueDate: dateValueToString(formData.value.dueDate as CalendarDate | null),
        },
      });
      toast.success("Task created successfully");
    }
    store.closeTaskDialog();
    props.onRefresh?.();
  } catch (error) {
    console.error("Failed to save task:", error);
    toast.error(store.editingTask ? "Failed to update task" : "Failed to create task");
  } finally {
    isSubmitting.value = false;
  }
};

const handleClose = () => {
  store.closeTaskDialog();
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ isEditing ? "Edit Task" : "Create Task" }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? "Update your task details." : "Add a new task to this project." }}
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <FormItem>
          <Label>Title</Label>
          <Input v-model="formData.title" placeholder="Task title" required :disabled="isSubmitting" />
        </FormItem>
        <FormItem>
          <Label>Description</Label>
          <Input v-model="formData.description" placeholder="Task description (optional)" :disabled="isSubmitting" />
        </FormItem>
        <FormItem>
          <Label>Status</Label>
          <Select v-model="formData.status" :disabled="isSubmitting">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select status">
                <template v-if="formData.status">
                  <span class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" :class="getStatusCircleColor(formData.status)"></span>
                    {{ TASK_STATUS_LABELS[formData.status] }}
                  </span>
                </template>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="(label, value) in TASK_STATUS_LABELS" :key="value" :value="value">
                <span class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :class="getStatusCircleColor(value)"></span>
                  {{ label }}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
        <FormItem>
          <Label>Priority</Label>
          <Select v-model="formData.priority" :disabled="isSubmitting">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="(label, value) in PRIORITY_LABELS" :key="value" :value="value">
                {{ label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
        <FormItem>
          <Label>Due Date</Label>
          <DatePicker v-model="dueDateModel" :disabled="isSubmitting" />
        </FormItem>
      </div>
      <DialogFooter>
        <Button variant="outline" :disabled="isSubmitting" @click="handleClose">Cancel</Button>
        <Button :disabled="isSubmitting" @click="handleSubmit">
          {{ isSubmitting ? "Saving..." : isEditing ? "Update" : "Create" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
