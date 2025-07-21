import dotenv from "dotenv";
dotenv.config();

export const PASSWORD = process.env.PASSWORD as string;
export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const ADMIN = process.env.ADMIN as string;
