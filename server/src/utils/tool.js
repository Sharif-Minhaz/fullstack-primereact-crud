const ResponseHandler = require("./responseHandler");
const { formidable } = require("formidable");

class Tool {
	static getParsedId(req) {
		const id = req.url?.split("/")[2];

		if (isNaN(id)) {
			return new Error("Invalid ID");
		}

		return id;
	}

	static parseBody(req) {
		const contentType = req.headers["content-type"];

		if (!contentType) return null;

		if (contentType.includes("application/json")) {
			return this.parseJSON(req);
		} else if (contentType.includes("multipart/form-data")) {
			return this.parseMultipart(req);
		} else {
			return null;
		}
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

	static parseMultipart(req) {
		return new Promise((resolve, reject) => {
			const form = formidable({ multiples: true });
			form.parse(req, (err, fields, files) => {
				if (err) return reject(err);
				resolve({ fields, files });
			});
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
