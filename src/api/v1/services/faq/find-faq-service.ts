import { FaqModel } from "../../models/faq-model";

export async function findFaqService() {
  const faqModel = new FaqModel();
  const faq = await faqModel.findAll();
  return { faq };
}
