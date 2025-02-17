class ResponseHandler {
	static success(res, data) {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: true, data }));
	}

	static error(res, error) {
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: false, error: error.message }));
	}
}

module.exports = ResponseHandler;
