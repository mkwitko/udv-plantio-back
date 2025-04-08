import { createFaq } from "@/api/v1/controllers/faq/create-faq";
import { deleteFaq } from "@/api/v1/controllers/faq/delete-faq";
import { findFaqs } from "@/api/v1/controllers/faq/find-faq";
import { findFaqById } from "@/api/v1/controllers/faq/find-faq-by-id";
import { updateFaq } from "@/api/v1/controllers/faq/update-faq";
import type { FastifyInstance } from "fastify";

export async function faqRoute(app: FastifyInstance) {
  app.register(createFaq);
  app.register(deleteFaq);
  app.register(findFaqs);
  app.register(findFaqById);
  app.register(updateFaq);
}
