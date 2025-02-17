const http = require("http");
const todoRoutes = require("./src/routes/todoRoutes");
const ResponseHandler = require("./src/utils/responseHandler");
const Tool = require("./src/utils/tool");

const server = http.createServer(async (req, res) => {
	try {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");

		// attach request body
		req.body = await Tool.parseJSON(req);
		// route handler for incoming requests
		await todoRoutes(req, res);
	} catch (error) {
		ResponseHandler.error(res, error);
	}
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
