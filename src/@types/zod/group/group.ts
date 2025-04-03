import z from "zod";

export const groupItem = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
  cellphone: z.array(z.unknown()),
});

export interface Group {
  id: string;
  companyId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  isDeleted: boolean;
  cellphone?: string[];
}
