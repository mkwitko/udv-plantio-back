import z from "zod";

export const centerResponse = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
});
