import { ConflictError } from "@/errors/conflict-error";
import { NotFoundError } from "@/errors/not-found-error";
import { prisma } from "@/lib/prisma/prisma";
import type z from "zod";
import type { createPlantRequestSchema } from "../controllers/plants/create-plants";
import type { updatePlantRequestScheam } from "../controllers/plants/update-plants";

const include = {
  type: {
    select: {
      id: true,
      name: true,
    },
  },
  center: {
    select: {
      id: true,
      name: true,
      region: true,
    },
  },
};

export class PlantsModel {
  async create(data: z.infer<typeof createPlantRequestSchema>) {
    // Idempotente: o app reenvia o create quando a resposta se perde (sinal
    // fraco). O upsert pelo id local evita duplicar e aplica o payload mais
    // recente.
    if (data.offlinePreviousId) {
      const upsert = () =>
        prisma.plants.upsert({
          where: { offlinePreviousId: data.offlinePreviousId },
          create: data,
          update: data,
          include,
        });
      let plant: Awaited<ReturnType<typeof upsert>>;
      try {
        plant = await upsert();
      } catch (error) {
        // Dois reenvios simultâneos: quem perde o unique tenta de novo e agora
        // encontra a linha, caindo no update.
        if (!(error instanceof ConflictError)) throw error;
        plant = await upsert();
      }
      // Excluída no servidor (ex.: pelo painel): não ressuscita.
      if (plant.isDeleted) throw new NotFoundError("Planta excluída no servidor.");
      return plant;
    }

    const plant = await prisma.plants.create({
      data,
      include,
    });
    return plant;
  }

  async findById(id: string) {
    const plant = await prisma.plants.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
      include,
    });

    return plant;
  }

  async findByCenter(id: string) {
    const plants = await prisma.plants.findMany({
      where: {
        centerId: id,
        isDeleted: false,
      },
      include,
    });

    return plants;
  }

  async findAll() {
    const plants = await prisma.plants.findMany({
      where: {
        isDeleted: false,
      },
      include,
    });

    return plants;
  }

  async update(data: z.infer<typeof updatePlantRequestScheam>) {
    const plant = await prisma.plants.update({
      data,
      where: {
        id: data.id as string,
      },
      include,
    });
    return plant;
  }

  async exclude(id: string, soft = false) {
    if (soft) {
      const plant = await prisma.plants.update({
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
        where: {
          id,
        },
        include,
      });
      return plant;
    }

    const plant = await prisma.plants.delete({
      where: {
        id,
      },
    });
    return plant;
  }
}
