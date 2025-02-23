const db = require("../config/db");

class TodoModel {
	async getAllTodos(user_id) {
		try {
			return await db.query("SELECT * FROM todos WHERE user = ? ORDER BY id DESC", [user_id]);
		} catch (error) {
			throw new Error(`Error fetching todos: ${error.message}`);
		}
	}

	async getTodoById(id) {
		if (!id) {
			throw new Error("Error fetching todo by ID: Todo ID is required");
		}

		try {
			return await db.query("SELECT * FROM todos WHERE id = ?", [id]);
		} catch (error) {
			throw new Error(`Error fetching todo by ID: ${error.message}`);
		}
	}

	async createTodo(title, description, image, user_id) {
		try {
			return await db.query(
				"INSERT INTO todos (title, description, status, user, image) VALUES (?, ?, ?, ?, ?)",
				[title, description, "pending", user_id, image]
			);
		} catch (error) {
			throw new Error(`Error creating todo: ${error.message}`);
		}
	}

	async updateTodo({ id, title, description, user_id, image }) {
		try {
			const todo = await this.getTodoById(id);

			if (!todo.length) {
				throw new Error("Todo not found to update");
			}

			console.log(id, title, description, user_id, image, todo[0]?.status);

			return await db.query(
				"UPDATE todos SET title = ?, description = ?, status = ?, image = ?, user = ? WHERE id = ?",
				[
					title,
					description,
					todo[0]?.status,
					(image = image !== "null" ? image : null),
					user_id,
					id,
				]
			);
		} catch (error) {
			throw new Error(`Error updating todo: ${error.message}`);
		}
	}

	async deleteTodo(id) {
		try {
			return await db.query("DELETE FROM todos WHERE id = ?", [id]);
		} catch (error) {
			throw new Error(`Error deleting todo: ${error.message}`);
		}
	}
}

module.exports = new TodoModel();
