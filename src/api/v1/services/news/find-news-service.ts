import { NewsModel } from "../../models/news-model";

export async function findNewsService() {
  const newsModel = new NewsModel();
  const news = await newsModel.findAll();
  return { news };
}
