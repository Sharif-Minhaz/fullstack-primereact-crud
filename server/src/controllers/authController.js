const cognito = require("../utils/cognito");
const ResponseHandler = require("../utils/responseHandler");
const Session = require("../utils/session");
const Tool = require("../utils/tool");
const UserModel = require("../models/userModel");
const { setCookie, getCookie } = require("../utils/cookieHandler");

class AuthController {
	constructor() {
		this.session = null;
	}

	getSession() {
		return this.session;
	}

	// login from cognito
	async login(req, res) {
		try {
			const app = req.app;
			const { query } = Tool.parseUrl(req);
			if (query?.code) {
				const userInfo = await cognito.authenticateUser(query.code);

				await UserModel.saveUser(userInfo);
				console.log("User information saved to db");

				this.session = new Session(app);
				await this.session.Start();
				this.session.user = userInfo;
				await this.session.Save();

				setCookie(res, "session_id", this.session.id, 3600); //

				res.writeHead(302, { Location: process.env.AWS_COGNITO_FINAL_URI });
				return res.end();
			} else {
				res.writeHead(302, { Location: process.env.AWS_COGNITO_LOGIN_URL });
				return res.end();
			}
		} catch (error) {
			res.writeHead(500, { "Content-Type": "application/json" });
			return res.end(
				JSON.stringify({ error: "Authentication failed", details: error.message })
			);
		}
	}

	async profile(req, res) {
		const sessionId = getCookie(req, "session_id");
		if (!sessionId) {
			res.writeHead(401, { "Content-Type": "application/json" });
			return res.end(JSON.stringify({ error: "Not logged in" }));
		}
		try {
			const session = this.session;
			await session.Open(sessionId);
			if (!session.user) throw new Error("Session invalid");
			res.writeHead(200, { "Content-Type": "application/json" });
			return res.end(JSON.stringify({ profile: session.user }));
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async logout(req, res) {
		try {
			const sessionId = getCookie(req, "session_id");
			if (sessionId) {
				const session = this.session;
				await session.Open(sessionId);
				await session.deleteSessionFile();
			}

			// Clear the session cookie
			setCookie(res, "session_id", "", -1);

			// Send success response instead of redirecting
			res.writeHead(200, { "Content-Type": "application/json" });
			return res.end(
				JSON.stringify({
					success: true,
					logoutUrl: process.env.AWS_COGNITO_LOGOUT_URI,
				})
			);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}
}

module.exports = new AuthController();
