const ResponseHandler = require("./responseHandler");

class Tool {
	static getParsedId(req) {
		const id = req.url?.split("/")[2];

		if (isNaN(id)) {
			return ResponseHandler.error(res, new Error("Invalid ID"));
		}

		return id;
	}

	static parseJSON(req) {
		return new Promise((resolve, reject) => {
			let body = "";
			req.on("data", (chunk) => {
				body += chunk.toString();
			});
			req.on("end", () => {
				try {
					resolve(JSON.parse(body));
				} catch (error) {
					resolve(null); // Handle empty or invalid JSON
				}
			});
			req.on("error", reject);
		});
	}
}

module.exports = Tool;
