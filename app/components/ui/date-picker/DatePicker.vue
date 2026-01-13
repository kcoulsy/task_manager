<script setup lang="ts">
import type { DateValue } from "reka-ui";
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";

import { CalendarIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

const props = defineProps<{
  modelValue?: DateValue | null;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: DateValue | null];
}>();

const defaultPlaceholder = today(getLocalTimeZone());

const date = computed<DateValue | undefined>({
  get: () => props.modelValue ?? undefined,
  set: (value: DateValue | undefined) => {
    emit("update:modelValue", value ?? null);
  },
});

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});
</script>

<template>
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :disabled="props.disabled"
        :class="cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')"
      >
        <CalendarIcon />
        {{ date ? df.format(date.toDate(getLocalTimeZone())) : "Pick a date" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        v-model="date"
        :default-placeholder="defaultPlaceholder"
        layout="month-and-year"
        initial-focus
        @update:model-value="close"
      />
    </PopoverContent>
  </Popover>
</template>
