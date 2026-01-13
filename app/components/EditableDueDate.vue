<script setup lang="ts">
import { computed } from "vue";
import type { DateValue } from "reka-ui";
import type { CalendarDate } from "@internationalized/date";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useTaskHelpers } from "~/composables/useTaskHelpers";
import { useUpdateTask } from "~/composables/useUpdateTask";
import { dateValueToString, stringToDateValue } from "~~/utils/date-helpers";

const props = defineProps<{
  dueDate: string | Date | null | undefined;
  projectId: string;
  taskId: string;
}>();

const { formatDate } = useTaskHelpers();
const { updateTask, isPending: isUpdating } = useUpdateTask(props.projectId, props.taskId);

const formatDetailDate = (date: string | Date | null | undefined) => {
  return (
    formatDate(date, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) || "Not set"
  );
};

const dueDateModel = computed<DateValue | undefined>({
  get: (): DateValue | undefined => {
    if (!props.dueDate) return undefined;
    const dateString =
      props.dueDate instanceof Date
        ? props.dueDate.toISOString().split("T")[0]
        : new Date(props.dueDate).toISOString().split("T")[0];
    return stringToDateValue(dateString) as DateValue | undefined;
  },
  set: async (value: DateValue | undefined) => {
    const dateString = dateValueToString((value as CalendarDate) || null);
    const currentDateString = props.dueDate
      ? props.dueDate instanceof Date
        ? props.dueDate.toISOString().split("T")[0]
        : new Date(props.dueDate).toISOString().split("T")[0]
      : null;

    if (dateString !== currentDateString) {
      await updateTask({ dueDate: dateString ? new Date(dateString) : null });
    }
  },
});
</script>

<template>
  <div>
    <h3 class="font-semibold text-sm text-gray-700 mb-2">Due Date</h3>
    <Popover v-slot="{ close }">
      <PopoverTrigger as-child>
        <Button
          variant="ghost"
          class="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors h-auto p-0 font-normal border-0 shadow-none hover:bg-transparent"
        >
          {{ formatDetailDate(dueDate) }}
          <span v-if="isUpdating" class="ml-2 text-xs text-gray-500">Saving...</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar
          v-model="dueDateModel"
          :default-placeholder="today(getLocalTimeZone())"
          layout="month-and-year"
          initial-focus
          @update:model-value="close"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
