const http = require("http");
const todoRoutes = require("./src/routes/todoRoutes");
const ResponseHandler = require("./src/utils/responseHandler");
const Tool = require("./src/utils/tool");
const authRoutes = require("./src/routes/authRoutes");
const App = require("./src/app");
const AuthController = require("./src/controllers/authController");

const server = http.createServer(async (req, res) => {
	try {
		const app = new App();

		// bind the app object to the request
		req.app = app;

		// update CORS headers
		const allowedOrigin =
			process.env.NODE_ENV === "production"
				? process.env.ALLOWED_ORIGIN
				: "http://localhost:3000";

		// set CORS headers based on origin
		const origin = req.headers.origin;
		if (origin === allowedOrigin) {
			res.setHeader("Access-Control-Allow-Origin", origin);
			res.setHeader("Access-Control-Allow-Credentials", "true");
			res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
			res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		}

		// handle the preflight request
		if (req.method === "OPTIONS") {
			res.writeHead(204);
			return res.end();
		}

		// attach request body
		req.body = await Tool.parseBody(req);

		console.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

		if (req.url?.startsWith("/auth")) {
			await authRoutes(req, res);
		} else if (req.url?.startsWith("/login")) {
			await AuthController.login(req, res);
		} else if (req.url?.startsWith("/todos")) {
			await todoRoutes(req, res);
		} else {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Route not found" }));
		}
	} catch (error) {
		ResponseHandler.error(res, error);
	}
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.info(`Server running on port ${PORT}`));
