import type z from "zod";
import { NewsModel } from "../../models/news-model";
import type { createNewsRequestSchema } from "../../controllers/news/create-news";

export async function createNewsService(
  data: z.infer<typeof createNewsRequestSchema>
) {
  const newsModel = new NewsModel();
  const news = await newsModel.create({
    ...data,
  });
  return { news };
}
