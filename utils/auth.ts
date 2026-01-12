import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { prisma } from "./db";
import { isValidPassword, PASSWORD_VALIDATION_MESSAGE } from "./password-validation";
import { ROUTES } from "./routes";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== ROUTES.AUTH.REGISTER) {
        return;
      }

      const password = ctx.body?.password;
      if (!isValidPassword(password)) {
        throw new APIError("BAD_REQUEST", {
          message: PASSWORD_VALIDATION_MESSAGE,
        });
      }
    }),
  },
});
