import type z from "zod";
import { FaqModel } from "../../models/faq-model";
import type { updateFaqRequestSchema } from "../../controllers/faq/update-faq";

export async function updateFaqService(
  data: z.infer<typeof updateFaqRequestSchema>
) {
  const faqModel = new FaqModel();
  const faq = await faqModel.update(data);
  return { faq };
}
