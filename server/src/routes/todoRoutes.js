const TodoController = require("../controllers/todoController");
const Tool = require("../utils/tool");

module.exports = async (req, res) => {
	if (req.method === "GET" && req.url === "/todos") {
		// ============ handle get request with /todos route============
		await TodoController.getAll(req, res);
	} else if (req.method === "GET" && req.url.startsWith("/todos/")) {
		// ============ handle get request with /todos/:id route ===========
		const id = Tool.getParsedId(req);
		await TodoController.getOne(req, res, id);
	} else if (req.method === "POST" && req.url === "/todos") {
		// ============ handle post request with /todos route ============
		await TodoController.create(req, res);
	} else if (req.method === "PUT" && req.url.startsWith("/todos/")) {
		// ============ handle put request with /todos/:id route ============
		const id = Tool.getParsedId(req);
		await TodoController.update(req, res, id);
	} else if (req.method === "DELETE" && req.url.startsWith("/todos/")) {
		// ============ handle delete request with /todos/:id route ============
		const id = Tool.getParsedId(req);
		await TodoController.delete(req, res, id);
	} else {
		// ============ handle route not found case ============
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: false, message: "Route not found" }));
	}
};
