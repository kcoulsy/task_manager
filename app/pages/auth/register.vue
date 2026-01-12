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
import { isValidPassword, PASSWORD_VALIDATION_MESSAGE } from "~~/utils/password-validation";

definePageMeta({
  middleware: "require-no-auth",
});

configure({
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
});

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .refine(isValidPassword, {
        message: PASSWORD_VALIDATION_MESSAGE,
      }),
    _serverError: z.string().optional(),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  const { name, email, password } = values;
  try {
    const result = await authClient.signUp.email({
      name: name,
      email: email,
      password: password,
    });

    if (result.error) {
      form.setErrors({
        _serverError: result.error.message || "Registration failed",
      });
    } else {
      form.setValues({
        email: "",
        password: "",
      });
      await navigateTo(ROUTES.AUTH.LOGIN);
    }
  } catch {
    form.setErrors({
      _serverError: "An error occurred during registration",
    });
  } finally {
    form.setValues({
      email: "",
      password: "",
    });
  }
});

const error = computed(() => form.errors.value._serverError);
const { isSubmitting } = form;
</script>

<template>
  <div class="flex mt-20 justify-center px-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Register</CardTitle>
        <CardDescription class="text-center"> Create a new account to get started </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="error" class="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {{ error }}
        </div>

        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="name">
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
            {{ isSubmitting ? "Registering..." : "Register" }}
          </Button>
        </form>

        <div class="mt-4 text-center text-sm">
          <span class="text-muted-foreground">Already have an account? </span>
          <NuxtLink to="/auth/login" class="text-primary hover:underline font-medium"> Login here </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
