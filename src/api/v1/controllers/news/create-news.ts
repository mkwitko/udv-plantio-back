import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createNewsService } from "../../services/news/create-news-service";

export const newsResponse = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional().nullable(),
  createdAt: z.date(),
});

export async function createNews(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/news/create",
    {
      schema: {
        tags: ["News"],
        summary: "Create News",
        description: "Create a new News",
        operationId: "createNews",
        body: createNewsRequestSchema,
        response: {
          201: newsResponse,
        },
      },
    },
    async (request, response) => {
      const { news } = await createNewsService(request.body);
      return response.status(201).send(news);
    }
  );
}

export const createNewsRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  createdAt: z.date().optional(),
});
