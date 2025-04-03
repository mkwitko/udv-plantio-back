import z from "zod";

export const unitItem = z.object({
  id: z.string(),
  companyId: z.string(),
  groupId: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
  cellphone: z.array(z.unknown()),
});

export interface Unit {
  id: string;
  companyId: string;
  groupId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  isDeleted: boolean;
  cellphone?: string[];
}
