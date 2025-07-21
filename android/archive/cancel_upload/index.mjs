import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "eu-central-1" });
const BUCKET = "words.assets";

export const handler = async (event) => {
  const fileName = event?.queryStringParameters?.file ??
    JSON.parse(event.body ?? "{}").file;

  if (!fileName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "file param is required" }),
    };
  }

  const key = `uploads/${fileName}`;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

    return {
      statusCode: 204,
      body: "",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "delete_failed" }),
    };
  }
};
