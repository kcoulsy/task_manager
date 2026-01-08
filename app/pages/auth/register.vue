<script setup lang="ts">
  import { authClient } from '../../../utils/auth-client';

  const email = ref('');
  const password = ref('');
  const name = ref('');
  const isLoading = ref(false);
  const error = ref('');
  const success = ref(false);

  async function register() {
    if (!name.value || !email.value || !password.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    isLoading.value = true;
    error.value = '';

    try {
      const result = await authClient.signUp.email({
        name: name.value,
        email: email.value,
        password: password.value,
      });

      if (result.error) {
        error.value = result.error.message || 'Registration failed';
      } else {
        success.value = true;
        await navigateTo('/auth/login');
      }
    } catch (err) {
      error.value = 'An error occurred during registration';
      console.error('Registration error:', err);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <div class="register-container">
    <h1>Register</h1>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="success" class="success-message">
      Registration successful! Redirecting to login...
    </div>

    <form @submit.prevent="register" v-else>
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          v-model="name"
          placeholder="Enter your name"
          :disabled="isLoading"
          required
        />
      </div>

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
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.register-container {
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

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
}
</style>