const {
	AdminCreateUserCommand,
	AdminDeleteUserCommand,
	AdminGetUserCommand,
	AdminResetUserPasswordCommand,
	AdminSetUserPasswordCommand,
	AdminUpdateUserAttributesCommand,
	CognitoIdentityProvider,
	ListUsersCommand,
	AdminListGroupsForUserCommand,
	AdminRemoveUserFromGroupCommand,
	AdminAddUserToGroupCommand,
	AdminDisableUserCommand,
	AdminEnableUserCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { jwtDecode } = require("jwt-decode");
const https = require("https");
const querystring = require("querystring");

class Cognito {
	constructor() {
		this.IdentityProvider = new CognitoIdentityProvider({
			region: process.env.AWS_REGION,
		});

		this.tokens = {};
	}

	async authenticateUser(code) {
		this.tokens = await this.getToken(code);

		if (!this.tokens?.id_token) {
			throw new Error("Id token could not be generated");
		}

		return jwtDecode(this.tokens?.id_token);
	}

	async getToken(code) {
		return new Promise((resolve, reject) => {
			const host = process.env.AWS_COGNITO_HOST_NAME;
			const redirectUri = process.env.AWS_COGNITO_REDIRECT_URI;
			const clientId = process.env.AWS_COGNITO_APP_ID;
			const clientSecret = process.env.AWS_COGNITO_APP_SECRET;

			try {
				const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

				const postData = querystring.stringify({
					grant_type: "authorization_code",
					code,
					redirect_uri: redirectUri,
				});

				const options = {
					hostname: host,
					path: "/oauth2/token",
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${authHeader}`,
						"Content-Length": Buffer.byteLength(postData),
					},
					family: 4,
					timeout: 10000,
					rejectUnauthorized: true,
				};

				const req = https.request(options);

				req.setTimeout(10000, () => {
					req.destroy();
					reject(new Error("Request timed out after 10 seconds"));
				});

				req.on("response", (res) => {
					let data = "";

					res.on("data", (chunk) => {
						data += chunk;
					});

					res.on("end", () => {
						try {
							const parsedData = JSON.parse(data);

							if (res.statusCode >= 400) {
								reject(
									new Error(
										`HTTP ${res.statusCode}: ${JSON.stringify(parsedData)}`
									)
								);
								return;
							}

							resolve(parsedData);
						} catch (err) {
							console.error("Error parsing JSON:", err);
							reject(err);
						}
					});
				});

				req.on("error", (error) => {
					console.error("Request error details:", {
						message: error.message,
						code: error.code,
						errno: error.errno,
						syscall: error.syscall,
						address: error.address,
						port: error.port,
					});
					reject(error);
				});

				req.write(postData);
				req.end();
			} catch (err) {
				console.error("Error in getToken:", err);
				reject(err);
			}
		});
	}

	async getAllUsers() {
		const poolID = process.env.AWS_COGNITO_USER_POOL_ID;
		const params = {
			UserPoolId: poolID,
			AttributesToGet: null,
		};

		try {
			const cmd = new ListUsersCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error listing users:", error);
			throw error;
		}
	}

	async getUser(username) {
		const poolID = process.env.AWS_COGNITO_USER_POOL_ID;
		const params = {
			UserPoolId: poolID,
			Username: username,
		};

		try {
			const cmd = new AdminGetUserCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error getting user data:", error);
			throw error;
		}
	}

	async updateUser(username, attributes) {
		const poolID = process.env.AWS_COGNITO_USER_POOL_ID;
		const params = {
			UserAttributes: [/* required */ attributes],
			UserPoolId: poolID,
			Username: username,
		};

		try {
			const cmd = new AdminUpdateUserAttributesCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error updating user:", error);
			throw error;
		}
	}

	async resetUserPassword(username) {
		const poolID = process.env.AWS_COGNITO_USER_POOL_ID;
		const params = {
			UserPoolId: poolID,
			Username: username,
		};

		try {
			const cmd = new AdminResetUserPasswordCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error resetting user password:", error);
			throw error;
		}
	}

	async deleteUser(username, customPoolId = false) {
		const poolID = process.env.AWS_COGNITO_USER_POOL_ID;

		if (customPoolId) {
			poolID = customPoolId;
		}

		const params = {
			UserPoolId: poolID,
			Username: username,
		};

		try {
			const cmd = new AdminDeleteUserCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error deleting user:", error);
			throw error;
		}
	}

	async createUser(username, attrsObj, customPoolId = false) {
		const poolID = process.env.AWS_COGNITO_USER_POOL_ID;

		if (customPoolId) {
			poolID = customPoolId;
		}

		const params = {
			UserPoolId: poolID,
			Username: username,
			UserAttributes: [
				{
					Name: "email_verified",
					Value: "true",
				},
				{
					Name: "email",
					Value: username,
				},
			],
		};

		try {
			const cmd = new AdminCreateUserCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error creating user:", error);
			throw error;
		}
	}

	async setPassword(username, userPass, customPoolId = false) {
		const poolID = process.env.AWS_COGNITO_USER_POOL_ID;

		if (customPoolId) {
			poolID = customPoolId;
		}

		const params = {
			UserPoolId: poolID,
			Username: username,
			Permanent: true,
			Password: userPass,
		};

		try {
			const cmd = new AdminSetUserPasswordCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error setting password for user:", error);
			throw error;
		}
	}

	async getUserGroups(username, customPoolId = false) {
		const poolID = customPoolId || process.env.AWS_COGNITO_USER_POOL_ID;

		const params = {
			UserPoolId: poolID,
			Username: username,
		};

		try {
			const cmd = new AdminListGroupsForUserCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error listing groups for user:", error);
			throw error;
		}
	}

	async removeUserFromGroup(username, groupName, customPoolId = false) {
		const poolID = customPoolId || process.env.AWS_COGNITO_USER_POOL_ID;

		const params = {
			UserPoolId: poolID,
			Username: username,
			GroupName: groupName,
		};

		try {
			const cmd = new AdminRemoveUserFromGroupCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error removing user from group:", error);
			throw error;
		}
	}

	async addUserToGroup(username, groupName, customPoolId = false) {
		const poolID = customPoolId || process.env.AWS_COGNITO_USER_POOL_ID;

		const params = {
			GroupName: groupName,
			Username: username,
			UserPoolId: poolID,
		};

		try {
			const cmd = new AdminAddUserToGroupCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error adding user to group:", error);
			throw error;
		}
	}

	async disableUser(username, customPoolId = false) {
		const poolID = customPoolId || process.env.AWS_COGNITO_USER_POOL_ID;

		const params = {
			UserPoolId: poolID,
			Username: username,
		};

		try {
			const cmd = new AdminDisableUserCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error disabling user:", error);
			throw error;
		}
	}

	async createUserWithGroup(username, attributes, groupName) {
		if (!groupName) {
			throw new Error("Group is empty.");
		}

		const validGroups = await this.getUserGroups();

		const isValidGroup = validGroups.some((validGroup) => validGroup.GroupName === groupName);

		if (!isValidGroup) {
			throw new Error("User group is invalid.");
		}

		const newUser = await this.createUser(username, attributes);
		await this.addUserToGroup(newUser.Username, groupName);

		return { user: newUser, group: groupName };
	}

	async enableUser(username) {
		const poolID = process.env.AWS_COGNITO_USER_POOL_ID;
		const params = {
			UserPoolId: poolID,
			Username: username,
		};

		try {
			const cmd = new AdminEnableUserCommand(params);
			return await this.IdentityProvider.send(cmd);
		} catch (error) {
			console.error("Error enabling user:", error);
			throw error;
		}
	}
}

module.exports = new Cognito();
