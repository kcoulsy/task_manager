<script setup lang="ts">
  import { authClient } from '../../../utils/auth-client';

  const email = ref('');
  const password = ref('');
  const isLoading = ref(false);
  const error = ref('');

  async function login() {
    if (!email.value || !password.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    isLoading.value = true;
    error.value = '';

    try {
      const result = await authClient.signIn.email({
        email: email.value,
        password: password.value,
      });

      if (result.error) {
        error.value = result.error.message || 'Login failed';
      } else {
        // Redirect to home page after successful login
        await navigateTo('/');
      }
    } catch (err) {
      error.value = 'An error occurred during login';
      console.error('Login error:', err);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="Enter your email"
          :disabled="isLoading"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="Enter your password"
          :disabled="isLoading"
          required
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <div class="register-link">
      <p>Don't have an account? <NuxtLink to="/auth/register">Register here</NuxtLink></p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>