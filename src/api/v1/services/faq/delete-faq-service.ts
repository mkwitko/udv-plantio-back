import { FaqModel } from "../../models/faq-model";

export async function deleteFaqService({
  userId,
  soft,
}: {
  userId: string;
  soft?: boolean;
}) {
  const faqModel = new FaqModel();
  const faq = await faqModel.exclude(userId, soft);
  return { faq };
}
