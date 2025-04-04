import { prisma } from "prisma/db";
import type z from "zod";
import type { createUserRequestScheam } from "../controllers/user/create-user";
import type { updateUserRequestScheam } from "../controllers/user/update-user";

export class UserModel {
  async create(
    data: z.infer<typeof createUserRequestScheam> & { password: string }
  ) {
    const user = await prisma.user.create({
      data,
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
    });

    if (omitPassword) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword; // Type assertion to Omit<user, 'password'>
    }

    return user; // Return the full user with password
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
        isDeleted: false,
      },
      select: {
        id: true,
        password: true,
      },
    });

    return user;
  }

  async findAll() {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
      },
    });

    return users;
  }

  async update(data: z.infer<typeof updateUserRequestScheam>) {
    const user = await prisma.user.update({
      data,
      where: {
        id: data.id as string,
      },
    });
    return user;
  }

  async exclude(id: string, soft = false) {
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
