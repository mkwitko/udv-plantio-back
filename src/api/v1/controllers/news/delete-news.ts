import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { deleteNewsService } from "../../services/news/delete-news-service";

export async function deleteNews(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .delete(
      "/news/delete",
      {
        schema: {
          tags: ["News"],
          summary: "Delete News",
          description: "Delete a News",
          operationId: "deleteNews",
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
        const { news } = await deleteNewsService({
          userId: request.body.id,
          soft: request.body.soft,
        });
        return response.status(201).send({
          id: news.id,
        });
      }
    );
}
