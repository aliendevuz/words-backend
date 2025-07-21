import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "words.telegram_support_bot_users";
const JWT_SECRET = process.env.JWT_SECRET;
export const handler = async (event) => {
    try {
        console.log(`Cookies: ${JSON.stringify(event.cookies)}`);
        const rawCookies = event.cookies;
        let token;
        if (rawCookies && Array.isArray(rawCookies)) {
            for (const cookie of rawCookies) {
                const parts = cookie.split("=");
                const key = parts[0].trim();
                const value = parts.slice(1).join("="); // to support '=' in token
                if (key === "access_token") {
                    token = value;
                    break;
                }
            }
        }
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ msg: "Access token missing" }),
            };
        }
        // 3. JWT ni verify qilish
        const payload = jwt.verify(token, JWT_SECRET);
        if (!payload.auth) {
            return {
                statusCode: 401,
                body: JSON.stringify({ msg: "Invalid token" }),
            };
        }
        // 4. Foydalanuvchilarni olish
        const data = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    }
    catch (err) {
        console.error("Auth error:", err);
        return {
            statusCode: 401,
            body: JSON.stringify({ msg: "Unauthorized" }),
        };
    }
};
