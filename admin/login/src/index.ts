import { APIGatewayProxyEvent } from "aws-lambda";
import { Telegraf } from "telegraf";
import { PASSWORD, BOT_TOKEN, ADMIN } from "./config";

import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

// DynamoDB client
const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "words.telegram_admin_panel_bot_pin_codes";

// 4-raqamli pin generator
const pinCodeGenerator = () => Math.floor(1000 + Math.random() * 9000);

export const handler = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body || '{}');

  if (!body.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ msg: 'Password is required' }),
    };
  }

  if (body.password !== PASSWORD) {
    return {
      statusCode: 401,
      body: JSON.stringify({ msg: 'Unauthorized', your_password: body.password }),
    };
  }

  const pinCode = pinCodeGenerator();
  const now = Math.floor(Date.now() / 1000); // current timestamp (sec)
  const expiresAt = now + 300; // 5 minut (TTL)

  // DynamoDBga yozish (AWS SDK v3)
  await ddb.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      pin: pinCode,
      expiresAt: expiresAt, // TTL uchun
      createdAt: new Date().toISOString(),
    },
  }));

  // Botga yuborish
  const bot = new Telegraf(BOT_TOKEN);
  await bot.telegram.sendMessage(ADMIN, `🔐 Pin code: ${pinCode}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ msg: 'Pin code sent', pin: pinCode }),
  };
};
