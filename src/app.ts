import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";

import { fastify } from "fastify";
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { env } from "./env";
import { errorHandler } from "./error-handler";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Routing from "./routes";
import fastifyWebsocket from "@fastify/websocket";
import fastifyCookie from "@fastify/cookie";
import qs from "qs";

const app = fastify({
  querystringParser: (str) => qs.parse(str), // Use qs for parsing query strings
}).withTypeProvider<ZodTypeProvider>();

// Jwt Authentication
app.register(fastifyJwt, {
  sign: {
    algorithm: "RS256",
    expiresIn: "1h",
  },
  secret: {
    private: Buffer.from(env.JWT_PRIVATE_KEY, "base64"),
    public: Buffer.from(env.JWT_PUBLIC_KEY, "base64"),
  },
});

app.setErrorHandler(errorHandler);

// Zod Type Provider
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCookie);

// Cors Policy
app.register(fastifyCors, {
  origin:
    env.ENVIRONMENT === "production"
      ? "https://udv-plantio-rfcqip7pg-mkwitkos-projects.vercel.app/"
      : "http://localhost:5173", // Change this to your front-end origin
  credentials: true, // This allows cookies to be sent
});

// Swagger Documentation
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Udv Plantio",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifyWebsocket);

// HTTP Routes
Routing();

// Swagger Documentation UI
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

export { app };
