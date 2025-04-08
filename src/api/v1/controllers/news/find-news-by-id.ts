import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { newsResponse } from "./create-news";
import { findNewsByIdService } from "../../services/news/find-news-by-id-service";

export async function findNewsById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/news/find/id",
      {
        schema: {
          tags: ["News"],
          summary: "Find News by ID",
          description: "Find a News by ID",
          operationId: "findNewsById",
          querystring: z.object({
            id: z.string(),
          }),
          response: {
            201: newsResponse,
          },
        },
      },
      async (request, response) => {
        const { news } = await findNewsByIdService(request.query);
        return response.status(201).send(news);
      }
    );
}
