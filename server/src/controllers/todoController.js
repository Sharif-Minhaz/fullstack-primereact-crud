const TodoModel = require("../models/todoModel");
const ResponseHandler = require("../utils/responseHandler.js");

class TodoController {
	async getAll(req, res) {
		try {
			const todos = await TodoModel.getAllTodos();
			ResponseHandler.success(res, todos);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async getOne(req, res, id) {
		try {
			const todo = await TodoModel.getTodoById(id);
			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}
}

module.exports = new TodoController();
