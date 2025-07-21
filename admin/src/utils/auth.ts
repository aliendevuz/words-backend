import { APIGatewayProxyEventV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const verifyToken = (event: APIGatewayProxyEventV2): null | object => {
  const rawCookies = event.cookies;
  let token: string | undefined;

  if (rawCookies && Array.isArray(rawCookies)) {
    for (const cookie of rawCookies) {
      const [key, ...rest] = cookie.split("=");
      if (key.trim() === "access_token") {
        token = rest.join("=");
        break;
      }
    }
  }

  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { auth?: boolean };
    return payload.auth ? payload : null;
  } catch {
    return null;
  }
};
