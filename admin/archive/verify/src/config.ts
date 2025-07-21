import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const ADMIN = process.env.ADMIN as string;
