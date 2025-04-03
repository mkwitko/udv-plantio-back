import { authenticationStatus } from '@/api/v1/controllers/authentication/auth-status'
import { authenticateUser } from '@/api/v1/controllers/authentication/authenticate'
import { refreshToken } from '@/api/v1/controllers/authentication/refresh-token'
import { signOut } from '@/api/v1/controllers/authentication/sign-out'
import type { FastifyInstance } from 'fastify'

export async function authenticationRoute(app: FastifyInstance) {
  app.register(authenticationStatus)
  app.register(authenticateUser)
  app.register(refreshToken)
  app.register(signOut)
}
