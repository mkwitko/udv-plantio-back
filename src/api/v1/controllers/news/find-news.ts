import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { newsResponse } from "./create-news";
import { findNewsService } from "../../services/news/find-news-service";

export async function findNews(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/news/find/all",
      {
        schema: {
          tags: ["New"],
          summary: "Find All News",
          description: "Find all News",
          operationId: "findAllNews",
          response: {
            201: z.array(newsResponse),
          },
        },
      },
      async (_, response) => {
        const { news } = await findNewsService();
        return response.status(201).send(news);
      }
    );
}
