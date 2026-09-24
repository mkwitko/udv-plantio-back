import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { describe, expect, it, vi } from "vitest";
import z from "zod";

vi.mock("@/env", () => ({ env: { ENVIRONMENT: "development" } }));

import { errorHandler } from "./error-handler";

describe("errorHandler", () => {
  it("answers 400 (not 500) when the body fails schema validation", async () => {
    const app = fastify().withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);
    app.post("/x", { schema: { body: z.object({ name: z.string() }) } }, () => "ok");

    const res = await app.inject({ method: "POST", url: "/x", payload: {} });
    expect(res.statusCode).toBe(400);
  });
});
