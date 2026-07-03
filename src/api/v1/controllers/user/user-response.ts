import z from "zod";

export const userResponse = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
  birthday: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  hierarchy: z.string().nullable(),
  cargos: z.array(z.string()),
  cargoNome: z.string().nullable(),
  cargoCodigo: z.string().nullable(),
  bypass: z.boolean(),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  isSuperAdmin: z.boolean(),
  center: z
    .object({
      id: z.string(),
      name: z.string(),
      region: z.string(),
    })
    .nullable(),
});
