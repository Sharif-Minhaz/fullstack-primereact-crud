const db = require("../config/db");

class TodoModel {
	async getAllTodos() {
		return db.query("SELECT * FROM todos");
	}

	async getTodoById(id) {
		return db.query("SELECT * FROM todos WHERE id = ?", [id]);
	}

	async createTodo(title, description) {
		return db.query("INSERT INTO todos (title, description) VALUES (?, ?)", [
			title,
			description,
		]);
	}

	async updateTodo(id, title, description, status) {
		return db.query("UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?", [
			title,
			description,
			status,
			id,
		]);
	}

	async deleteTodo(id) {
		return db.query("DELETE FROM todos WHERE id = ?", [id]);
	}
}

module.exports = new TodoModel();
