import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "words.telegram_support_bot_users";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const getUsersHandler = async (): Promise<APIGatewayProxyResult> => {
  const data = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));

  return {
    statusCode: 200,
    body: JSON.stringify(data.Items),
  };
};
