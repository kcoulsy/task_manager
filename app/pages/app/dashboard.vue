<script setup lang="ts">
import { authClient } from "../../../utils/auth-client";
const session = authClient.useSession();

definePageMeta({
  middleware: "require-auth",
});
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome back, {{ session.data?.user?.email }}!</h1>
      <p class="text-gray-600">Here's an overview of your tasks and productivity.</p>
    </div>
  </div>
</template>
