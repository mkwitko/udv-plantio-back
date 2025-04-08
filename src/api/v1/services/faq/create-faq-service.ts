import type z from "zod";
import { FaqModel } from "../../models/faq-model";
import type { createfaqRequestSchema } from "../../controllers/faq/create-faq";

export async function createFaqService(
  data: z.infer<typeof createfaqRequestSchema>
) {
  const faqModel = new FaqModel();
  const faq = await faqModel.create({
    ...data,
  });
  return { faq };
}
