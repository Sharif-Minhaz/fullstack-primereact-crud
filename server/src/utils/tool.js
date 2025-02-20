const querystring = require("querystring");
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

	static parseUrl(req) {
		try {
			const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
			const path = parsedUrl.pathname;
			const query = Object.fromEntries(parsedUrl.searchParams);

			return { path, query, parsedUrl };
		} catch (error) {
			throw new Error("Error occurred while parsing URL: " + error.message);
		}
	}
}

module.exports = Tool;
