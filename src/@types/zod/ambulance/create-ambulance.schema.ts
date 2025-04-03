import z from "zod";

export const createAmbulanceBody = z.object({
  name: z.string(),
  companyId: z.string(),
  groupId: z.string(),
  unitId: z.string(),
  baseId: z.string(),
  plateNumber: z.string(),
  linkingCode: z.string(),
  documents: z
    .array(
      z.object({
        type: z.string(),
        content: z.string(),
        title: z.string(),
        validUntil: z.date().nullable(),
        exclude: z.boolean().optional(),
      })
    )
    .optional(),
});

export const createAmbulanceResponse = z.object({
  id: z.string().uuid(),
  plateNumber: z.string(),
  linkingCode: z.string(),
  companyId: z.string().uuid(),
  chatId: z.string().uuid(),
  baseId: z.string().uuid(),
});
