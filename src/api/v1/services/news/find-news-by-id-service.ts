import { NewsModel } from "../../models/news-model";

export async function findNewsByIdService({ id }: { id: string }) {
  const newsModel = new NewsModel();
  const news = await newsModel.findById(id);
  return { news };
}
