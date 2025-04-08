import { prisma } from "prisma/db";
import type z from "zod";
import type { createfaqRequestSchema } from "../controllers/faq/create-faq";
import type { updateFaqRequestSchema } from "../controllers/faq/update-faq";

export class FaqModel {
  async create(data: z.infer<typeof createfaqRequestSchema>) {
    const faq = await prisma.faq.create({
      data,
    });
    return faq;
  }

  async findById(id: string) {
    const faq = await prisma.faq.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
    });

    return faq;
  }

  async findAll() {
    const faqs = await prisma.faq.findMany({
      where: {
        isDeleted: false,
      },
    });

    return faqs;
  }

  async update(data: z.infer<typeof updateFaqRequestSchema>) {
    const faq = await prisma.faq.update({
      data,
      where: {
        id: data.id as string,
      },
    });
    return faq;
  }

  async exclude(id: string, soft = false) {
    if (soft) {
      const faq = await prisma.faq.update({
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
        where: {
          id,
        },
      });
      return faq;
    }

    const faq = await prisma.faq.delete({
      where: {
        id,
      },
    });
    return faq;
  }
}
