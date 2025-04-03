import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { deleteUserService } from '../../services/user/delete-user-service'
import { authenticationMiddleware } from '@/middlewares/authentication-middleware'

export async function deleteUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .delete(
      '/user/delete',
      {
        schema: {
          tags: ['User'],
          summary: 'Delete User',
          description: 'Delete a user',
          operationId: 'deleteUser',
          body: z.object({
            id: z.string().cuid(),
            soft: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              id: z.string().cuid(),
            }),
          },
        },
      },
      async (request, response) => {
        const { user } = await deleteUserService({
          userId: request.body.id,
          soft: request.body.soft,
        })
        return response.status(201).send({
          id: user.id,
        })
      },
    )
}
