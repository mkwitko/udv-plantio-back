import { prisma } from "@/lib/prisma/prisma";

export class CenterModel {
  async findById(id: string) {
    const center = await prisma.center.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
    });

    return center;
  }

  async findAll() {
    const centers = await prisma.center.findMany({
      where: {
        isDeleted: false,
      },
    });

    return centers;
  }
}
