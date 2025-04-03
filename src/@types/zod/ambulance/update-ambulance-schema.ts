import z from "zod";

export const updateAmbulanceBody = z.object({
  id: z.string(),
  name: z.string().optional(),
  companyId: z.string().optional(),
  groupId: z.string().optional(),
  unitId: z.string().optional(),
  baseId: z.string().optional(),
  currentBaseId: z.string().optional().nullable(),
  destinationBaseId: z.string().optional().nullable(),
  plateNumber: z.string().optional(),
  avatarUrl: z.string().optional(),
  linkingCode: z.string().optional(),
  status: z.string().optional(),
  observation: z.string().optional(),
  subStatus: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  enterDate: z.string().optional().nullable(),
  leaveDate: z.string().optional().nullable(),
  documents: z
    .array(
      z.object({
        type: z.string(),
        content: z.string(),
        title: z.string(),
        validUntil: z.string().nullable(),
        exclude: z.boolean().nullable().optional(),
      })
    )
    .optional(),
  destinationCommands: z
    .array(
      z.object({
        id: z.string(),
        destinationBaseId: z.string().optional().nullable(),
        attended: z.boolean().optional(),
        latitude: z.number().optional().nullable(),
        longitude: z.number().optional().nullable(),
        address: z.string().optional().nullable(),
      })
    )
    .optional(),
});
