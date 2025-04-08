import { prisma } from "prisma/db";
import type z from "zod";
import type { updateNewsRequestSchema } from "../controllers/news/update-news";
import type { createNewsRequestSchema } from "../controllers/news/create-news";

export class NewsModel {
  async create(data: z.infer<typeof createNewsRequestSchema>) {
    const news = await prisma.news.create({
      data,
    });
    return news;
  }

  async findById(id: string) {
    const news = await prisma.news.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
    });

    return news;
  }

  async findAll() {
    const newss = await prisma.news.findMany({
      where: {
        isDeleted: false,
      },
    });

    return newss;
  }

  async update(data: z.infer<typeof updateNewsRequestSchema>) {
    const news = await prisma.news.update({
      data,
      where: {
        id: data.id as string,
      },
    });
    return news;
  }

  async exclude(id: string, soft = false) {
    if (soft) {
      const news = await prisma.news.update({
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
        where: {
          id,
        },
      });
      return news;
    }

    const news = await prisma.news.delete({
      where: {
        id,
      },
    });
    return news;
  }
}
