import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createFaqService } from "../../services/faq/create-faq-service";

export const faqResponse = z.object({
  id: z.string(),
  category: z.string(),
  type: z.string(),
  question: z.string(),
  answer: z.string(),
  createdAt: z.date(),
});

export async function createFaq(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/faq/create",
    {
      schema: {
        tags: ["faq"],
        summary: "Create faq",
        description: "Create a new faq",
        operationId: "createfaq",
        body: createfaqRequestSchema,
        response: {
          201: faqResponse,
        },
      },
    },
    async (request, response) => {
      const { faq } = await createFaqService(request.body);
      return response.status(201).send(faq);
    }
  );
}

export const createfaqRequestSchema = z.object({
  category: z.string(),
  type: z.string(),
  question: z.string(),
  answer: z.string(),
});
