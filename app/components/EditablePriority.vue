<script setup lang="ts">
import { ref } from "vue";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useTaskHelpers } from "~/composables/useTaskHelpers";
import { useUpdateTask } from "~/composables/useUpdateTask";
import type { Priority } from "~~/generated/prisma/enums";

const props = defineProps<{
  priority: Priority;
  projectId: string;
  taskId: string;
}>();

const { getPriorityColor, PRIORITY_LABELS } = useTaskHelpers();
const { updateTask, isPending: isUpdating } = useUpdateTask(props.projectId, props.taskId);
const selectOpen = ref(false);

const handleChange = async (newPriority: unknown) => {
  const priority = newPriority as Priority;
  if (!priority || priority === props.priority) {
    return;
  }
  await updateTask({ priority });
};
</script>

<template>
  <div>
    <h3 class="font-semibold text-sm text-gray-700 mb-2">Priority</h3>
    <Select
      :model-value="priority"
      :open="selectOpen"
      @update:open="selectOpen = $event"
      @update:model-value="handleChange"
    >
      <SelectTrigger
        class="inline-flex items-center gap-2 text-sm px-3 py-1 rounded font-medium cursor-pointer hover:opacity-80 transition-opacity w-auto h-auto border-0 shadow-none"
        :class="getPriorityColor(priority)"
      >
        <SelectValue placeholder="Select priority">
          <template v-if="priority">
            {{ PRIORITY_LABELS[priority] }}
            <span v-if="isUpdating" class="ml-2 text-xs">Saving...</span>
          </template>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="(label, value) in PRIORITY_LABELS" :key="value" :value="value">
          {{ label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
