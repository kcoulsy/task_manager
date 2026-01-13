<template>
  <div class="task-detail-layout min-h-screen bg-gradient-to-br from-indigo-50/30 via-slate-50 to-blue-50/20">
    <div class="max-w-[1400px] mx-auto py-8">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div class="task-main-column">
          <slot name="main" />
        </div>

        <div class="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
          <slot name="sidebar" />
        </div>
      </div>
    </div>
  </div>
</template>
