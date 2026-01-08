<script setup lang="ts">
import { authClient } from "../../utils/auth-client";
import { Button } from "@/components/ui/button";
const session = authClient.useSession();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- App Logo -->
            <div class="shrink-0 flex items-center">
              <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">TM</span>
              </div>
              <span class="ml-2 text-xl font-semibold text-gray-900">Task Manager</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-4">
            <template v-if="!session.data">
              <!-- Not authenticated -->
              <NuxtLink to="/auth/login">
                <Button variant="outline">
                  Login
                </Button>
              </NuxtLink>
              <NuxtLink to="/auth/register">
                <Button>
                  Register
                </Button>
              </NuxtLink>
            </template>

            <template v-else>
              <!-- Authenticated -->
              <span class="text-gray-700 text-sm"> Welcome, {{ session.data.user?.email }} </span>
              <Button variant="outline" @click="authClient.signOut()">
                Logout
              </Button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
