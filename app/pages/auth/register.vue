<script setup lang="ts">
import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import * as z from 'zod'
  import { authClient } from '../../../utils/auth-client';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

  const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  _serverError: z.string().optional(),
}))

  const form = useForm({
    validationSchema: formSchema,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const { name, email, password } = values
    try {
      const result = await authClient.signUp.email({
        name: name,
        email: email,
        password: password,
      });

      if (result.error) {
        form.setErrors({
          _serverError: result.error.message || 'Registration failed',
        })
      } else {
        form.setValues({
          email: '',
          password: '',
        })
        await navigateTo('/auth/login');
      }
    } catch (err) {
      form.setErrors({
        _serverError: 'An error occurred during registration',
      })
    } finally {
      form.setValues({
        email: '',
        password: '',
      })
    }
  })

  const error = computed(() => form.errors.value._serverError)
  const { isSubmitting } = form

</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Register</CardTitle>
        <CardDescription class="text-center">
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="error" class="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {{ error }}
        </div>

        <form @submit="onSubmit" class="space-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel for="name">Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  type="text"
                  v-bind="componentField"
                  placeholder="Enter your name"
                  :disabled="isSubmitting"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel for="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  v-bind="componentField"
                  placeholder="Enter your email"
                  :disabled="isSubmitting"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="password" v-slot="{ componentField }">
            <FormItem>
              <FormLabel for="password">Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  v-bind="componentField"
                  placeholder="Enter your password"
                  :disabled="isSubmitting"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? 'Registering...' : 'Register' }}
          </Button>
        </form>

        <div class="mt-4 text-center text-sm">
          <span class="text-muted-foreground">Already have an account? </span>
          <NuxtLink to="/auth/login" class="text-primary hover:underline font-medium">
            Login here
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>