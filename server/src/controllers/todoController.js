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

			if (!todo.length) {
				return ResponseHandler.notFound(res, new Error("Todo not found"));
			}

			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async create(req, res) {
		try {
			const { title, description } = req.body;

			if (!title || !description) {
				return ResponseHandler.error(res, new Error("Title and description are required"));
			}

			const todo = await TodoModel.createTodo(title, description);
			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async update(req, res, id) {
		try {
			const { title, description, status } = req.body;

			const todo = await TodoModel.updateTodo(id, title, description, status);

			if (!todo.affectedRows) {
				return ResponseHandler.badRequest(res, new Error("Todo doesn't exist"));
			}

			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async delete(_, res, id) {
		try {
			const todo = await TodoModel.deleteTodo(id);

			if (!todo.affectedRows) {
				return ResponseHandler.badRequest(
					res,
					new Error("Todo not exist, possible already deleted")
				);
			}

			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}
}

module.exports = new TodoController();
