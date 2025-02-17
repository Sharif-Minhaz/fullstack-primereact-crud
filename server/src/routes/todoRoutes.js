const TodoController = require("../controllers/todoController");
const ResponseHandler = require("../utils/responseHandler");

module.exports = async (req, res) => {
	if (req.method === "GET" && req.url === "/todos") {
		await TodoController.getAll(req, res);
	} else if (req.method === "GET" && req.url.startsWith("/todos/")) {
		const id = req.url.split("/")[2];

		if (isNaN(id)) {
			return ResponseHandler.error(res, new Error("Invalid ID"));
		}

		await TodoController.getOne(req, res, id);
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ message: "Route not found" }));
	}
};
