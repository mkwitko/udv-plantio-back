import { env } from "@/env";

export async function createFileUrlFromFilename({
  filename,
}: {
  filename: string;
}) {
  return `${env.AWS_PUBLIC_SUBDOMAIN}/${filename.replace("//", "/")}`;
}
