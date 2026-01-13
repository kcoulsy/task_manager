<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Check, X } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { useUpdateTask } from "~/composables/useUpdateTask";

const props = defineProps<{
  description: string | null;
  projectId: string;
  taskId: string;
}>();

const { updateTask } = useUpdateTask(props.projectId, props.taskId);

const editing = ref(false);
const editValue = ref("");
const originalValue = ref("");

const startEditing = () => {
  originalValue.value = props.description ?? "";
  editValue.value = props.description ?? "";
  editing.value = true;
  nextTick(() => {
    const textarea = document.querySelector<HTMLTextAreaElement>("#description-textarea");
    textarea?.focus();
  });
};

const save = async () => {
  const newValue = editValue.value.trim() || null;
  if (newValue === (props.description ?? "")) {
    editing.value = false;
    return;
  }
  await updateTask({ description: newValue });
  editing.value = false;
};

const cancel = () => {
  editValue.value = originalValue.value;
  editing.value = false;
};
</script>

<template>
  <div class="description-section">
    <h2 class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Description</h2>
    <div v-if="!editing">
      <p
        v-if="description"
        class="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap cursor-pointer hover:text-gray-900 transition-colors min-h-6"
        @click="startEditing"
      >
        {{ description }}
      </p>
      <p
        v-else
        class="text-lg leading-relaxed text-gray-400 italic cursor-pointer hover:text-gray-600 transition-colors min-h-6"
        @click="startEditing"
      >
        Add a description to provide context for this task...
      </p>
    </div>
    <div v-else class="flex items-start gap-2">
      <textarea
        id="description-textarea"
        v-model="editValue"
        class="flex min-h-32 w-full rounded-md border border-input bg-transparent px-4 py-3 text-lg leading-relaxed shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Add a description to provide context for this task..."
        @blur="save"
        @keydown.esc="cancel"
      />
      <div class="flex flex-col gap-1">
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="save">
          <Check class="h-4 w-4 text-green-600" />
        </Button>
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="cancel">
          <X class="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  </div>
</template>
