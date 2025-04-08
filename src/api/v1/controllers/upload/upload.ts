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
              folder: z.literal("news-image"),
              fileSize: z.number().max(5 * 1024 * 1024), // 5MB
              fileName: z.string().regex(/\.(jpg|jpeg|png)$/),
              fileType: z.string().regex(/(image\/jpeg|image\/png)/),
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
