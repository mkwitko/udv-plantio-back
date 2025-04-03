import { prisma } from "prisma/db";
import type z from "zod";
import type { createUserRequestScheam } from "../controllers/user/create-user";
import type { updateUserRequestScheam } from "../controllers/user/update-user";

export class UserModel {
  async create(
    data: z.infer<typeof createUserRequestScheam> & { password: string }
  ) {
    const companiesData: any = data.companies?.map((id) => ({ id }));
    const groupData: any = data.group?.map((id) => ({ id }));
    const unitData: any = data.unit?.map((id) => ({ id }));

    data.group = undefined;
    data.unit = undefined;

    const user = await prisma.user.create({
      data: {
        ...data,
        companies: {
          connect: companiesData,
        },
        group: {
          connect: groupData,
        },
        unit: {
          connect: unitData,
        },
      },
      include: {
        companies: {
          select: {
            id: true,
            name: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return user;
  }

  async findById<
    T extends boolean = true // Default to true for omitPassword
  >(id: string, omitPassword: T = true as T) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        companies: true,
        group: true,
        unit: true,
      },
    });

    if (omitPassword) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword; // Type assertion to Omit<user, 'password'>
    }

    return user; // Return the full user with password
  }

  async findByCpf<T extends boolean = true>(
    cpf: string,
    omitPassword: T = true as T
  ) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        cpf,
        isDeleted: false,
      },
      select: {
        id: true,
        password: true,
        permissions: true,
      },
    });

    return user;
  }

  async findAll() {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        companies: true,
        group: true,
        unit: true,
      },
    });

    return users;
  }

  async findByCompany(companyId: string) {
    const users = await prisma.user.findMany({
      where: {
        companies: {
          some: {
            id: companyId,
          },
        },
        isDeleted: false,
      },
      include: {
        companies: {
          select: {
            id: true,
            name: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return users;
  }

  async findByGroup(groupId: string) {
    const users = await prisma.user.findMany({
      where: {
        group: {
          some: {
            id: groupId,
          },
        },
        isDeleted: false,
      },
      include: {
        companies: true,
        group: true,
      },
    });

    return users;
  }

  async findByUnit(unitId: string) {
    const users = await prisma.user.findMany({
      where: {
        unit: {
          some: {
            id: unitId,
          },
        },
        isDeleted: false,
      },
      include: {
        companies: true,
        group: true,
        unit: true,
      },
    });

    return users;
  }

  async update(data: z.infer<typeof updateUserRequestScheam>) {
    const companiesData: any = data.companies?.map((id) => ({ id })) || [];
    const groupData: any = data.group?.map((id) => ({ id })) || [];
    const unitData: any = data.unit?.map((id) => ({ id })) || [];

    data.companies = undefined;
    data.group = undefined;
    data.unit = undefined;

    const user = await prisma.user.update({
      data: {
        ...data,
        companies: {
          set: companiesData.length > 0 ? companiesData : [],
        },
        group: {
          set: groupData.length > 0 ? groupData : [],
        },
        unit: {
          set: unitData.length > 0 ? unitData : [],
        },
      },
      where: {
        id: data.id as string,
      },
      include: {
        companies: {
          select: {
            id: true,
            name: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return user;
  }

  async exclude(id: string, soft = false) {
    console.log("id to delete - ", id);
    if (soft) {
      const user = await prisma.user.update({
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
        where: {
          id,
        },
      });
      return user;
    }

    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    return user;
  }
}
