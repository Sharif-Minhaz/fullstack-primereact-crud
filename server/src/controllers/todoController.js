const TodoModel = require("../models/todoModel");
const ResponseHandler = require("../utils/responseHandler.js");
const AuthController = require("./authController");
const S3 = require("../utils/s3");
const fs = require("fs");

class TodoController {
	constructor() {
		this.s3Instance = new S3(null, process.env.AWS_S3_BUCKET_NAME, {
			accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY,
		});
		console.log("session:", this.session);
	}
	async getAll(req, res) {
		try {
			const user_id = AuthController.getSession()?.user?.sub;

			if (!user_id) return ResponseHandler.badRequest(res, "User cognito sub id not found");

			const todos = await TodoModel.getAllTodos(user_id);
			ResponseHandler.success(res, todos);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async getOne(req, res, id) {
		try {
			const todo = await TodoModel.getTodoById(id);

			if (!todo.length) {
				return ResponseHandler.notFound(res, new Error("Todo not found"));
			}

			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async create(req, res) {
		try {
			const { title, description } = req.body?.fields;
			const image = req.body?.files?.image[0];

			const user_id = AuthController.getSession()?.user?.sub;

			if (!user_id) return ResponseHandler.badRequest(res, "User cognito sub id not found");

			if (!title || !description) {
				return ResponseHandler.error(res, new Error("Title and description are required"));
			}

			let fileName = image ? await this.upload(image) : null;

			if (fileName) {
				fileName = fileName.split("/uploads/").pop();
			}

			const todo = await TodoModel.createTodo(title, description, fileName, user_id);
			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async upload(image) {
		if (!image) return null;

		const fileStream = fs.createReadStream(image?.filepath);

		const params = {
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: `uploads/${Date.now()}_${image.originalFilename}`,
			Body: fileStream,
			MimeType: image.mimetype,
		};

		const uploadResult = await this.s3Instance.saveFile(params);
		return uploadResult.Location;
	}

	async update(req, res, id) {
		try {
			const { title, description, status } = req.body;

			const user_id = AuthController.getSession()?.user?.sub;

			if (!user_id) return ResponseHandler.badRequest(res, "User cognito sub id not found");

			const todo = await TodoModel.updateTodo(id, title, description, status, user_id);

			if (!todo.affectedRows) {
				return ResponseHandler.badRequest(res, new Error("Todo doesn't exist"));
			}

			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async delete(_, res, id) {
		try {
			// Fetch the todo to get the associated image file name
			const todoData = await TodoModel.getTodoById(id);

			if (!todoData.length) {
				return ResponseHandler.badRequest(
					res,
					new Error("Todo not exist, possible already deleted")
				);
			}

			const todo = await TodoModel.deleteTodo(id);

			if (!todo.affectedRows) {
				return ResponseHandler.badRequest(res, new Error("Failed to delete todo"));
			}

			const fileName = todoData[0].image;

			if (fileName) {
				console.log("Deleting file:", fileName);
				await this.s3Instance.deleteObject(
					{
						Bucket: process.env.AWS_S3_BUCKET_NAME,
						Key: `uploads/${fileName}`,
					},
					process.env.AWS_S3_BUCKET_NAME
				);
			}

			ResponseHandler.success(res, todo);
		} catch (error) {
			ResponseHandler.error(res, error);
		}
	}

	async getFileName(req, res) {
		try {
			const url = new URL(req.url, `http://${req.headers.host}`);
			const fileName = url.searchParams.get("name");

			const fileUrl = await this.fileName(fileName);
			return ResponseHandler.success(res, { fileUrl, success: true });
		} catch (error) {
			console.error("Error getting file name:", error);
			return ResponseHandler.error(res, {
				error,
				message: "Something happened in getFileName",
			});
		}
	}

	async fileName(filename) {
		if (!filename) throw new Error("Filename is required");

		console.log("filename before:", filename);
		filename = decodeURIComponent(filename);
		console.log("filename after:", filename);

		const url = await this.s3Instance.getFileNameUrl(filename, process.env.AWS_S3_BUCKET_NAME);
		return url;
	}
}

module.exports = new TodoController();
