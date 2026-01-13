<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~~/utils/routes";

defineProps<{
  projectName: string;
  projectId: string;
  taskTitle: string;
}>();
</script>

<template>
  <header class="task-header sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
    <div class="max-w-[1400px] mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            @click="navigateTo(ROUTES.APP.PROJECT(projectId))"
            class="text-slate-600 hover:text-editorial-navy transition-colors"
          >
            {{ projectName }}
          </Button>
          <ChevronRight class="w-4 h-4 text-slate-400" />
          <span class="text-editorial-navy font-medium truncate max-w-xs">
            {{ taskTitle }}
          </span>
        </nav>

        <div class="flex items-center gap-2">
          <!-- Future: Share, Watch, More menu -->
        </div>
      </div>
    </div>
  </header>
</template>
