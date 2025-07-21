import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { getUsersHandler } from "./routes/get_users";
import { verifyToken } from "./utils/auth";

// Yagona kirish nuqtasi
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  try {
    // Token tekshirish
    const user = verifyToken(event);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ msg: "Unauthorized" }),
      };
    }

    // Routing
    const routeKey = `${event.requestContext.http.method} ${event.rawPath}`;

    switch (routeKey) {
      case "GET /get_users":
        return await getUsersHandler();
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ msg: "Route not found" }),
        };
    }
  } catch (err) {
    console.error("Global error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal Server Error" }),
    };
  }
};
