import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "eu-central-1" });
const BUCKET = "words.assets";

export const handler = async (event) => {
  const { fileName, contentType = "application/octet-stream" } =
    JSON.parse(event.body || "{}");

  if (!fileName) {
    return { statusCode: 400, body: JSON.stringify({ error: "fileName is required" }) };
  }

  const key = `uploads/${fileName}`;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 300 });

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl,
      fileUrl: `https://${BUCKET}.s3.eu-central-1.amazonaws.com/${key}`,
    }),
  };
};
