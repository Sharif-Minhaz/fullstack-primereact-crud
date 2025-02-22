const db = require("../config/db");

class UserModel {
	async getAllUsers() {
		try {
			return await db.query("SELECT * FROM users");
		} catch (error) {
			console.error("Error getting all users:", error);
			throw error;
		}
	}

	async saveUser(userInfo) {
		const { sub, email } = userInfo;
		const name = email?.split("@")[0];
		try {
			const existingUser = await db.query("SELECT * FROM users WHERE cognito_sub = ?", [sub]);
			if (existingUser.length === 0) {
				await db.query("INSERT INTO users (cognito_sub, email, name) VALUES (?, ?, ?)", [
					sub,
					email,
					name,
				]);
			} else {
				await db.query("UPDATE users SET email = ?, name = ? WHERE cognito_sub = ?", [
					email,
					name,
					sub,
				]);
			}
		} catch (error) {
			console.error("Error saving user:", error);
			throw error;
		}
	}
}

module.exports = new UserModel();
