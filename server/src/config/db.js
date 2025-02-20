const mysql = require("mysql2");

class Database {
	constructor() {
		this.connection = mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

		this.connection.connect((err) => {
			if (err) {
				console.error("Database connection failed:", err.stack);
				return;
			}
			console.info("Connected to MySQL database");
		});
	}

	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, results) => {
				if (err) reject(err);
				else resolve(results);
			});
		});
	}
}

module.exports = new Database();
