import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { faqResponse } from "./create-faq";
import { updateFaqService } from "../../services/faq/update-faq-service";

export async function updateFaq(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      "/faq/update",
      {
        schema: {
          tags: ["faq"],
          summary: "Update faq",
          description: "Update a new faq",
          operationId: "updatefaq",
          body: updateFaqRequestSchema,
          response: {
            201: faqResponse,
          },
        },
      },
      async (request, response) => {
        const { faq } = await updateFaqService(request.body);
        return response.status(201).send(faq);
      }
    );
}

export const updateFaqRequestSchema = z.object({
  id: z.string(),
  category: z.string(),
  type: z.string(),
  question: z.string(),
  answer: z.string(),
});
