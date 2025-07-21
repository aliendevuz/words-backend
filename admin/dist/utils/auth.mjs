import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const verifyToken = (event) => {
    const rawCookies = event.cookies;
    let token;
    if (rawCookies && Array.isArray(rawCookies)) {
        for (const cookie of rawCookies) {
            const [key, ...rest] = cookie.split("=");
            if (key.trim() === "access_token") {
                token = rest.join("=");
                break;
            }
        }
    }
    if (!token)
        return null;
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return payload.auth ? payload : null;
    }
    catch {
        return null;
    }
};
