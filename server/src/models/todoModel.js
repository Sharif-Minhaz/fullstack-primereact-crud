const db = require("../config/db");

class TodoModel {
	async getAllTodos(user_id) {
		return db.query("SELECT * FROM todos WHERE user = ? ORDER BY id DESC", [user_id]);
	}

	async getTodoById(id) {
		return db.query("SELECT * FROM todos WHERE id = ?", [id]);
	}

	async createTodo(title, description, user_id) {
		console.log(title, description, user_id);
		return db.query("INSERT INTO todos (title, description, user) VALUES (?, ?, ?)", [
			title,
			description,
			user_id,
		]);
	}

	async updateTodo(id, title, description, status, user_id) {
		return db.query(
			"UPDATE todos SET title = ?, description = ?, status = ?, user = ? WHERE id = ?",
			[title, description, status, user_id, id]
		);
	}

	async deleteTodo(id) {
		return db.query("DELETE FROM todos WHERE id = ?", [id]);
	}
}

module.exports = new TodoModel();
