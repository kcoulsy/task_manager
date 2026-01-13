<script setup lang="ts">
import { ref } from "vue";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useTaskHelpers } from "~/composables/useTaskHelpers";
import { useUpdateTask } from "~/composables/useUpdateTask";
import type { TaskStatus } from "~~/generated/prisma/enums";

const props = defineProps<{
  status: TaskStatus;
  projectId: string;
  taskId: string;
}>();

const { getStatusColor, getStatusCircleColor, TASK_STATUS_LABELS } = useTaskHelpers();
const { updateTask, isPending: isUpdating } = useUpdateTask(props.projectId, props.taskId);
const selectOpen = ref(false);

const handleChange = async (newStatus: unknown) => {
  const status = newStatus as TaskStatus;
  if (!status || status === props.status) {
    return;
  }
  await updateTask({ status });
};
</script>

<template>
  <div>
    <h3 class="font-semibold text-sm text-gray-700 mb-2">Status</h3>
    <Select :model-value="status" :open="selectOpen" @update:open="selectOpen = $event" @update:model-value="handleChange">
      <SelectTrigger
        class="inline-flex items-center gap-2 text-sm px-3 py-1 rounded font-medium cursor-pointer hover:opacity-80 transition-opacity w-auto h-auto border-0 shadow-none p-0"
        :class="getStatusColor(status)"
      >
        <SelectValue placeholder="Select status">
          <template v-if="status">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="getStatusCircleColor(status)"></span>
              {{ TASK_STATUS_LABELS[status] }}
              <span v-if="isUpdating" class="ml-2 text-xs">Saving...</span>
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
  </div>
</template>
