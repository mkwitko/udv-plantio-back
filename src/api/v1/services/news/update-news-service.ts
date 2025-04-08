import type z from "zod";
import { NewsModel } from "../../models/news-model";
import type { updateNewsRequestSchema } from "../../controllers/news/update-news";

export async function updateNewsService(
  data: z.infer<typeof updateNewsRequestSchema>
) {
  const newsModel = new NewsModel();
  const news = await newsModel.update(data);
  return { news };
}
