import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  HOST: z.string().default("0.0.0.0"),
  ENVIRONMENT: z.enum(["development", "production"]).default("production"),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_ACCOUNT_ID: z.string(),
  AWS_PUBLIC_SUBDOMAIN: z.string().url(),
  // Cognito — fonte de verdade das credenciais.
  COGNITO_REGION: z.string(),
  COGNITO_USER_POOL_ID: z.string(),
  COGNITO_USER_POOL_CLIENT_ID: z.string(),
  // Emails (separados por vírgula) com bypass de acesso.
  BYPASS_EMAILS: z.string().default(""),
  // Mock de claims (SÓ dev, SÓ para emails em BYPASS_EMAILS). Testar cargo/grau.
  MOCK_ENABLED: z.string().default("false"),
  MOCK_BYPASS: z.string().default("true"), // "false" p/ testar o gate sem bypass
  MOCK_GRAU: z.string().optional(),
  MOCK_CARGOS: z.string().optional(),
  MOCK_CARGO_CODIGO: z.string().optional(),
  MOCK_CARGO_NOME: z.string().optional(),
  MOCK_NUCLEO_NOME: z.string().optional(),
  MOCK_REGIAO_NOME: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.log(
    `Invalid environment variables: ${JSON.stringify(
      _env.error.flatten().fieldErrors
    )}`
  );
  throw new Error(
    `Invalid environment variables: ${_env.error.flatten().fieldErrors}`
  );
}

export const env = _env.data;
