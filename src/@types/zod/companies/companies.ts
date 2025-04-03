import z from "zod";

export const companyItem = z.object({
  id: z.string(),
  name: z.string(),
  cnpj: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
  cellphone: z.array(z.string()),
});

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  isDeleted: boolean;
  cellphone?: string[];
}
