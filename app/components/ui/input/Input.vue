<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { ref, computed } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";
import { cn } from "~/lib/utils";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  type?: string;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const isPassword = computed(() => props.type === "password");
const showPassword = ref(false);

const inputType = computed(() => {
  if (!isPassword.value) {
    return props.type || "text";
  }
  return showPassword.value ? "text" : "password";
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const passwordIconLabel = computed(() => {
  return showPassword.value ? "Hide password" : "Show password";
});
</script>

<template>
  <div class="relative">
    <input
      v-model="modelValue"
      :type="inputType"
      data-slot="input"
      :class="
        cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          isPassword ? 'pl-3 pr-9' : 'px-3',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          props.class,
        )
      "
    />
    <button
      v-if="isPassword"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      @click.stop="togglePasswordVisibility"
      :aria-label="passwordIconLabel"
    >
      <span :key="`icon-${showPassword}`">
        <EyeOff v-if="showPassword" class="h-4 w-4" />
        <Eye v-else class="h-4 w-4" />
      </span>
    </button>
  </div>
</template>
