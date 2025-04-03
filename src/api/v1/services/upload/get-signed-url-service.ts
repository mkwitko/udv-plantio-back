import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/env";
import { r2 } from "@/lib/cloudfare";

export async function handleGetSignedUrl({
  filename,
  filetype,
}: {
  filename: string;
  filetype: string;
}) {
  return await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: filename,
      ContentType: filetype,
    }),
    {
      expiresIn: 60 * 5, // 5 minutes
    }
  );
}
