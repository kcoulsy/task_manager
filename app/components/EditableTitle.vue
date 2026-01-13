<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Check, X } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useUpdateTask } from "~/composables/useUpdateTask";

const props = defineProps<{
  title: string;
  projectId: string;
  taskId: string;
}>();

const { updateTask, isPending: isUpdating } = useUpdateTask(props.projectId, props.taskId);

const editing = ref(false);
const editValue = ref("");
const originalValue = ref("");

const startEditing = () => {
  originalValue.value = props.title;
  editValue.value = props.title;
  editing.value = true;
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>("#title-input");
    input?.focus();
    input?.select();
  });
};

const save = async () => {
  if (!editValue.value.trim()) {
    cancel();
    return;
  }
  if (editValue.value.trim() === originalValue.value) {
    editing.value = false;
    return;
  }
  await updateTask({ title: editValue.value.trim() });
  editing.value = false;
};

const cancel = () => {
  editValue.value = originalValue.value;
  editing.value = false;
};
</script>

<template>
  <div v-if="!editing" class="flex items-center gap-3 group">
    <h1
      class="text-4xl md:text-5xl font-display font-bold tracking-tight text-editorial-navy cursor-pointer hover:scale-[1.01] transition-transform"
      @click="startEditing"
    >
      {{ title }}
    </h1>
    <span v-if="isUpdating" class="text-sm text-slate-500">Saving...</span>
  </div>
  <div v-else class="flex items-center gap-2">
    <Input
      id="title-input"
      v-model="editValue"
      class="text-4xl md:text-5xl font-display font-bold tracking-tight"
      @blur="save"
      @keydown.enter="save"
      @keydown.esc="cancel"
    />
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="save">
      <Check class="h-4 w-4 text-green-600" />
    </Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="cancel">
      <X class="h-4 w-4 text-red-600" />
    </Button>
  </div>
</template>
