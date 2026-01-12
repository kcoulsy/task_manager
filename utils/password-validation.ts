import * as z from "zod";

export const PASSWORD_VALIDATION_MESSAGE =
  "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character";

export function isValidPassword(password: string): boolean {
  if (!password || password.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

export const passwordRefinement = z.string().refine((password) => isValidPassword(password), {
  message: PASSWORD_VALIDATION_MESSAGE,
});
