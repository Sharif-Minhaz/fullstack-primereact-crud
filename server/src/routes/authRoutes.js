const AuthController = require("../controllers/authController");

module.exports = async (req, res) => {
	const url = req.url;
	if (req.method === "GET" && url === "/auth/profile") {
		await AuthController.profile(req, res);
	} else if (req.method === "POST" && url === "/auth/logout") {
		await AuthController.logout(req, res);
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ message: "Route not found" }));
	}
};
