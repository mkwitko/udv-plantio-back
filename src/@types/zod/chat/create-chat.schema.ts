import z from "zod";

export const createChatBody = z.object({
  companyId: z.string().uuid(),
  ambulanceId: z.string().uuid(),
});

export const createChatResponse = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  ambulanceId: z.string().uuid(),
});
