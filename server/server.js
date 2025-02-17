const http = require("http");
const todoRoutes = require("./src/routes/todoRoutes");

const server = http.createServer(async (req, res) => {
	await todoRoutes(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
