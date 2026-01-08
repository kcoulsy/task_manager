<script setup lang="ts">
import { authClient } from "../utils/auth-client";
const session = authClient.useSession();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />

    <div>
      <pre>{{ session.data }}</pre>
      <button v-if="session.data" @click="authClient.signOut()">Sign out</button>
    </div>
  </div>
</template>
