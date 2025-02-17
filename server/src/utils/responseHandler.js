class ResponseHandler {
	static success(res, data) {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: true, data }));
	}

	static badRequest(res, error) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: false, error: error?.message }));
	}

	static notFound(res, error) {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: false, error: error?.message }));
	}

	static error(res, error) {
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: false, error: error?.message }));
	}
}

module.exports = ResponseHandler;
