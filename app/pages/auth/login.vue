<script setup lang="ts">
import { useForm, configure } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { authClient } from "../../../utils/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ROUTES } from "~~/utils/routes";

definePageMeta({
  middleware: "require-no-auth",
});

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(1),
    _serverError: z.string().optional(),
  }),
);

configure({
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
});

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  const { email, password } = values;
  try {
    const result = await authClient.signIn.email({
      email: email,
      password: password,
    });

    if (result.error) {
      form.setErrors({
        _serverError: result.error.message || "Login failed",
      });
    } else {
      await navigateTo(ROUTES.APP.DASHBOARD);
    }
  } catch (err) {
    form.setErrors({
      _serverError: "An error occurred during login",
    });
    console.error("Login error:", err);
  }
});

const error = computed(() => form.errors.value._serverError);
const { isSubmitting } = form;
</script>

<template>
  <div class="flex mt-20 justify-center px-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription class="text-center"> Enter your credentials to access your account </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="error" class="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {{ error }}
        </div>

        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email">
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

          <FormField v-slot="{ componentField }" name="password">
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
            {{ isSubmitting ? "Logging in..." : "Login" }}
          </Button>
        </form>

        <div class="mt-4 text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <NuxtLink to="/auth/register" class="text-primary hover:underline font-medium"> Register here </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
