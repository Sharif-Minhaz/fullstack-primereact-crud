// src/utils/cookieHandler.js
function setCookie(res, name, value, maxAge) {
	res.setHeader("Set-Cookie", `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAge}`);
}

function getCookie(req, name) {
	const cookies = req.headers.cookie ? req.headers.cookie.split("; ") : [];
	const cookie = cookies.find((c) => c.startsWith(name + "="));
	return cookie ? cookie.split("=")[1] : null;
}

module.exports = { setCookie, getCookie };
