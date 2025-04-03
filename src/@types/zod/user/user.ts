import type { Company, Group, Unit } from "@prisma/client";
import z from "zod";

export const userItem = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
  birthday: z.string(),
  permissions: z.array(z.string()),
  avatarUrl: z.string().nullable().optional(),
});

export interface UserInterface {
  id: string;
  name: string;
  cpf: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  isDeleted: boolean;
  birthday: string;
  permissions: string[];
  companies: Company[];
  group: Group[];
  unit: Unit[];
}
