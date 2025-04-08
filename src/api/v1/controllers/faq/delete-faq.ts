import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { deleteFaqService } from "../../services/faq/delete-faq-service";

export async function deleteFaq(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .delete(
      "/faq/delete",
      {
        schema: {
          tags: ["faq"],
          summary: "Delete faq",
          description: "Delete a faq",
          operationId: "deleteFaq",
          body: z.object({
            id: z.string().cuid(),
            soft: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              id: z.string().cuid(),
            }),
          },
        },
      },
      async (request, response) => {
        const { faq } = await deleteFaqService({
          userId: request.body.id,
          soft: request.body.soft,
        });
        return response.status(201).send({
          id: faq.id,
        });
      }
    );
}
