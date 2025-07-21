import { generatePinHandler } from "./handlers/generatePin.mjs";
import { getUsersHandler } from "./routes/get_users.mjs";
import { verifyToken } from "./utils/auth.mjs";
// Yagona kirish nuqtasi
export const handler = async (event) => {
    try {
        const routeKey = `${event.requestContext.http.method} ${event.rawPath}`;
        // 🔓 Open routes (token required emas)
        if (routeKey === "POST /login") {
            return await generatePinHandler(event);
        }
        // 🔐 Protected routes
        const user = verifyToken(event);
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ msg: "Unauthorized" }),
            };
        }
        switch (routeKey) {
            case "GET /get_users":
                return await getUsersHandler();
            default:
                return {
                    statusCode: 404,
                    body: JSON.stringify({ msg: "Route not found" }),
                };
        }
    }
    catch (err) {
        console.error("Global error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Internal Server Error" }),
        };
    }
};
