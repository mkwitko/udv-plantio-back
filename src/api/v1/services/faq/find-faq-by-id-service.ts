import { FaqModel } from "../../models/faq-model";

export async function findFaqByIdService({ id }: { id: string }) {
  const faqModel = new FaqModel();
  const faq = await faqModel.findById(id);
  return { faq };
}
