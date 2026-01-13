<script setup lang="ts">
import { computed } from "vue";
import * as LucideIcons from "lucide-vue-next";

const props = defineProps<{
  icon: string;
  label: string;
}>();

// Dynamically get the icon component from lucide-vue-next
const IconComponent = computed(() => {
  return (LucideIcons as Record<string, unknown>)[props.icon];
});
</script>

<template>
  <div class="sidebar-field flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
    <component :is="IconComponent" class="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
    <div class="flex-1 min-w-0">
      <div class="text-xs uppercase tracking-wide font-mono text-slate-600 mb-1">
        {{ label }}
      </div>
      <div class="text-sm text-gray-900">
        <slot />
      </div>
    </div>
  </div>
</template>
