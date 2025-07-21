import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "words.telegram_admin_panel_bot_pin_codes";
const JWT_SECRET = process.env.JWT_SECRET;
export const verifyHandler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const pin = Number(body.pin);
        if (!pin) {
            return {
                statusCode: 400,
                body: JSON.stringify({ msg: "Pin code is required" }),
            };
        }
        const data = await ddb.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { pin },
        }));
        if (!data.Item) {
            return {
                statusCode: 401,
                body: JSON.stringify({ msg: "Invalid or expired pin" }),
            };
        }
        // JWT token yaratish
        const token = jwt.sign({ auth: true, name: "shunchaki", qale: "birnimalarda" }, JWT_SECRET, { expiresIn: "6h" } // optional
        );
        const cookie = [
            `access_token=${token}`,
            `HttpOnly`,
            `Path=/`,
            `Secure`,
            `SameSite=None`,
        ].join("; ");
        return {
            statusCode: 200,
            headers: {
                "Set-Cookie": cookie,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ msg: "Authenticated" }),
        };
    }
    catch (err) {
        console.error("Verify error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Internal Server Error" }),
        };
    }
};
