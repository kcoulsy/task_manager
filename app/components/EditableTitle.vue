<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Check, X } from "lucide-vue-next";
import { CardTitle } from "~/components/ui/card";
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
  <div v-if="!editing" class="flex items-center gap-2 group">
    <CardTitle class="text-2xl cursor-pointer hover:text-gray-700 transition-colors" @click="startEditing">
      {{ title }}
    </CardTitle>
    <span v-if="isUpdating" class="text-sm text-gray-500">Saving...</span>
  </div>
  <div v-else class="flex items-center gap-2">
    <Input
      id="title-input"
      v-model="editValue"
      class="text-2xl font-semibold"
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
