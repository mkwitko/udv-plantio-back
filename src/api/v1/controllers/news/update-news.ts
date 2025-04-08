import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { newsResponse } from "./create-news";
import { updateNewsService } from "../../services/news/update-news-service";

export async function updateNews(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      "/news/update",
      {
        schema: {
          tags: ["News"],
          summary: "Update News",
          description: "Update a new News",
          operationId: "updateNews",
          body: updateNewsRequestSchema,
          response: {
            201: newsResponse,
          },
        },
      },
      async (request, response) => {
        const { news } = await updateNewsService(request.body);
        return response.status(201).send(news);
      }
    );
}

export const updateNewsRequestSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  createdAt: z.date().optional(),
});
