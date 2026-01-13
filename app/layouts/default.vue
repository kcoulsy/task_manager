<script setup lang="ts">
import { authClient } from "~~/utils/auth-client";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~~/utils/routes";
import { Toaster } from "vue-sonner";

const session = authClient.useSession();

const handleLogout = async () => {
  await authClient.signOut();
  await navigateTo(ROUTES.HOME);
};

const logoLink = computed(() => {
  return session.value?.data?.user?.id ? ROUTES.APP.DASHBOARD : ROUTES.HOME;
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="shrink-0 flex items-center">
              <NuxtLink :to="logoLink">
                <span class="ml-2 text-xl font-semibold text-gray-900">Task Manager</span>
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="!session.data?.user?.id">
              <NuxtLink to="/auth/login">
                <Button variant="outline"> Login </Button>
              </NuxtLink>
              <NuxtLink to="/auth/register">
                <Button> Register </Button>
              </NuxtLink>
            </template>

            <template v-else>
              <span class="text-gray-700 text-sm"> Welcome, {{ session.data?.user?.email }} </span>
              <Button variant="outline" @click="handleLogout"> Logout </Button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
    <Toaster position="bottom-left" />
  </div>
</template>
