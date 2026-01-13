import type { H3Event } from "h3";
import type { ZodSchema } from "zod";

export async function readValidatedBody<T>(event: H3Event, schema: ZodSchema<T>): Promise<T> {
  const body = await readBody(event);
  return schema.parse(body);
}

export async function readValidatedQuery<T>(event: H3Event, schema: ZodSchema<T>): Promise<T> {
  const query = getQuery(event);
  return schema.parse(query);
}
