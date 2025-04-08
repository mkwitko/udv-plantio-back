import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { findFaqByIdService } from "../../services/faq/find-faq-by-id-service";
import { faqResponse } from "./create-faq";

export async function findFaqById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/faq/find/id",
      {
        schema: {
          tags: ["Faq"],
          summary: "Find Faq by ID",
          description: "Find a Faq by ID",
          operationId: "findFaqById",
          querystring: z.object({
            id: z.string().cuid(),
          }),
          response: {
            201: faqResponse,
          },
        },
      },
      async (request, response) => {
        const { faq } = await findFaqByIdService(request.query);
        return response.status(201).send(faq);
      }
    );
}
