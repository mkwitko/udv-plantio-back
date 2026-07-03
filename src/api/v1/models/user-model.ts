import { prisma } from "@/lib/prisma/prisma";

interface CognitoUserData {
  email: string;
  nome: string;
  grau: string | null;
  cargos: string | null;
  cargoNome: string | null;
  cargoCodigo: string | null;
}

export class UserModel {
  // Busca usuário por ID (sem senha), com center. `cargos` vira array.
  async findById(id: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        center: {
          select: {
            id: true,
            name: true,
            region: true,
          },
        },
      },
    });

    const { password: _password, cargos, ...rest } = user;
    return {
      ...rest,
      cargos: cargos?.split(",").filter(Boolean) ?? [],
    };
  }

  async findAll() {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        center: {
          select: {
            id: true,
            name: true,
            region: true,
          },
        },
      },
    });

    return users.map(({ password: _password, cargos, ...rest }) => ({
      ...rest,
      cargos: cargos?.split(",").filter(Boolean) ?? [],
    }));
  }

  // Upsert de núcleo (Center) por nome (case-insensitive). Grava/atualiza a
  // região (string). Retorna o id.
  async upsertCenterByName(
    name: string,
    region: string | null,
  ): Promise<string> {
    const existing = await prisma.center.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      select: { id: true, region: true },
    });

    if (existing) {
      if (region && existing.region !== region) {
        await prisma.center.update({
          where: { id: existing.id },
          data: { region },
        });
      }
      return existing.id;
    }

    const created = await prisma.center.create({
      data: { name, region: region ?? "" },
      select: { id: true },
    });
    return created.id;
  }

  // Provisiona/atualiza o usuário a partir do Cognito. Cognito é a fonte de
  // verdade — sem senha local.
  async syncFromCognito(params: {
    data: CognitoUserData;
    centerId: string | null;
    bypass: boolean;
  }): Promise<{ id: string }> {
    const { data, centerId, bypass } = params;

    const centerConnect = centerId
      ? { center: { connect: { id: centerId } } }
      : {};

    const base = {
      name: data.nome,
      hierarchy: data.grau,
      cargos: data.cargos,
      cargoNome: data.cargoNome,
      cargoCodigo: data.cargoCodigo,
      bypass,
      ...centerConnect,
    };

    return prisma.user.upsert({
      where: { email: data.email },
      create: {
        email: data.email,
        password: null,
        ...base,
      },
      update: base,
      select: { id: true },
    });
  }
}
