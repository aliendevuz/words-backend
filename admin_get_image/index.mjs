import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "eu-central-1" });
const BUCKET = "words.assets";

export const handler = async (event) => {
  const fileName = event?.queryStringParameters?.file;
  if (!fileName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "file param is required" }),
    };
  }

  // uploads/<fileName>
  const key = `uploads/${fileName}`;

  // presign GET
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 300 } // 5 minut
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ url }),
  };
};
