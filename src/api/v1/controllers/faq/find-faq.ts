import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { faqResponse } from "./create-faq";
import { findFaqService } from "../../services/faq/find-faq-service";

export async function findFaqs(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/faq/find/all",
      {
        schema: {
          tags: ["Faq"],
          summary: "Find All Faqs",
          description: "Find all Faqs",
          operationId: "findAllFaqs",
          response: {
            201: z.array(faqResponse),
          },
        },
      },
      async (_, response) => {
        const { faq } = await findFaqService();
        return response.status(201).send(faq);
      }
    );
}
