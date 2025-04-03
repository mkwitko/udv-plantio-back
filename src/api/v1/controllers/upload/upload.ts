import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { handleGetSignedUrl } from "../../services/upload/get-signed-url-service";

export async function getPressignedUrl(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .post(
      "/upload",
      {
        schema: {
          security: [{ BearerAuth: [] }],
          tags: ["Upload"],
          summary: "Get pressigned url",
          operationId: "getPressignedUrl",
          description:
            "Get pressigned url to upload a file directly to the storage",
          body: z.discriminatedUnion("folder", [
            z.object({
              folder: z.literal("document"),
              fileSize: z.number().max(5 * 1024 * 1024), // 5MB
              fileName: z.string().regex(/\.(pdf)$/),
              fileType: z.string().regex(/(application\/pdf)/),
            }),
            z.object({
              folder: z.literal("image"),
              fileSize: z.number().max(10 * 1024 * 1024), // 5MB
              fileName: z.string().regex(/\.(png|jpeg|jpg)$/),
              fileType: z.string().regex(/image\/(png|jpeg|jpg)/),
            }),
            z.object({
              folder: z.literal("video"),
              fileSize: z.number().max(50 * 1024 * 1024), // 50MB
              fileName: z.string().regex(/\.(mp4|webm|ogg)$/),
              fileType: z.string().regex(/video\/(mp4|webm|ogg)/),
            }),
            z.object({
              folder: z.literal("audio"),
              fileSize: z.number().max(10 * 1024 * 1024), // 10MB
              fileName: z.string().regex(/\.(m4a|webm|mp3|wav)$/),
              fileType: z.string().regex(/audio\/(m4a|webm|mp3|wav)/), // Match valid audio MIME types
            }),
          ]),
          response: {
            201: z.object({
              pressignedUrl: z.string().url(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { fileName, fileType } = request.body;
        try {
          const pressignedUrl = await handleGetSignedUrl({
            filename: fileName,
            filetype: fileType,
          });

          return reply.status(201).send({
            pressignedUrl,
          });
        } catch (error) {
          //
        }
      }
    );
}
