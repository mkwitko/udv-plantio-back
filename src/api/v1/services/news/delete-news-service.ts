import { NewsModel } from "../../models/news-model";

export async function deleteNewsService({
  userId,
  soft,
}: {
  userId: string;
  soft?: boolean;
}) {
  const newsModel = new NewsModel();
  const news = await newsModel.exclude(userId, soft);
  return { news };
}
