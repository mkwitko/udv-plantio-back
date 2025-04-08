import { createNews } from "@/api/v1/controllers/news/create-news";
import { deleteNews } from "@/api/v1/controllers/news/delete-news";
import { findNews } from "@/api/v1/controllers/news/find-news";
import { findNewsById } from "@/api/v1/controllers/news/find-news-by-id";
import { updateNews } from "@/api/v1/controllers/news/update-news";
import type { FastifyInstance } from "fastify";

export async function newsRoute(app: FastifyInstance) {
  app.register(createNews);
  app.register(deleteNews);
  app.register(findNews);
  app.register(findNewsById);
  app.register(updateNews);
}
