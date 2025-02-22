const { S3Client, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const AWS = require("aws-sdk");

const aws_region = process.env.AWS_REGION;

class S3 {
	constructor(app, bucket, credentials) {
		this.app = app;
		this.bucket = bucket;
		this.folder = null;
		this.bucket = null;
		this.credentials = credentials;
		this.client = new S3Client({
			region: aws_region,
			bucket: process.env.AWS_S3_BUCKET_NAME,
			credentials,
		});
	}

	setFolder(folder) {
		this.folder = folder;
	}

	setBucket(bucket) {
		this.bucket = bucket;
	}

	async getFolderListing(folder = null, bucket = null) {
		const prefix = folder == null ? this.folder : folder;
		const buck = bucket == null ? this.bucket : bucket;
		if (prefix == null || buck == null) {
			throw Error(
				"Either a bucket or folder were not specified in S3::getFolderListing. Either specify a folder and bucket in the constructor or for the method."
			);
		}

		const command = new ListObjectsV2Command(input);
		const retval = await this.client.send(command);
		return retval.Contents;
	}

	async getFile(file, bucket = null) {
		const buck = bucket == null ? this.bucket : bucket;
		if (buck == null || file == null || file.trim() == "") {
			throw Error(
				"A bucket or file was not specified in S3::getFile. You must specify the bucket and file"
			);
		}
		const parameters = {
			Bucket: bucket,
			Key: file,
		};

		const { Body } = await this.client.send(new GetObjectCommand(parameters));

		retval = await Body.transformToString();
		return retval;
	}

	async getFileNameUrl(file, bucket = process.env.AWS_S3_BUCKET_NAME) {
		if (!file) throw new Error("File name is required");
		if (!bucket) throw new Error("Bucket name is required");

		let fileName = file;

		if (fileName.startsWith("http")) {
			try {
				const urlObj = new URL(fileName);
				fileName = decodeURIComponent(urlObj.pathname.split("/").pop());
			} catch (error) {
				throw new Error("Invalid file URL format");
			}
		}

		console.log("Extracted file name:", fileName);

		try {
			const command = new GetObjectCommand({
				Bucket: bucket,
				Key: `uploads/${fileName}`,
			});

			const url = await getSignedUrl(this.client, command, { expiresIn: 60 });

			console.log("Generated S3 Signed URL:", url);
			return url;
		} catch (error) {
			console.error("Error generating signed URL:", error);
			throw new Error("Failed to generate signed URL");
		}
	}

	listFolders(bucket) {
		return new Promise((resolve, reject) => {
			const s3params = {
				Bucket: bucket,
				MaxKeys: 100,
				Delimiter: "/",
			};

			this.client.listObjectsV2(s3params, (err, data) => {
				if (err) {
					reject(err);
				}
				const retval = {
					folders: [],
				};
				for (const folder of data.CommonPrefixes) {
					retval.folders.push(folder.Prefix.replace("/", ""));
				}
				resolve(retval);
			});
		});
	}

	createFolder(bucket, folder) {
		return new Promise((resolve, reject) => {
			const s3params = {
				Bucket: bucket,
				Key: `${folder}/index.json`,
				Body: JSON.stringify({ reports: [] }),
			};
			const client = new AWS.S3({
				region: aws_region,
				bucket: bucket,
			});
			client.upload(s3params, (err, data) => {
				if (err) {
					console.dir(err);
					reject(err);
				}
				resolve(data);
			});
		});
	}

	async moveObject(srcBucket, srcKey, destBucket, destKey) {
		try {
			const s3 = new AWS.S3({
				region: aws_region,
				bucket: srcBucket,
			});
			const params = {
				Bucket: destBucket,
				CopySource: `/${srcBucket}/${srcKey}`,
				Key: destKey,
			};
			console.dir(params);
			await s3.copyObject(params).promise();
			params = {
				Bucket: srcBucket,
				Key: srcKey,
			};
			console.dir(params);
			console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
			await s3.deleteObject(params);
			return false;
		} catch (e) {
			console.dir(e);
			return true;
		}
	}

	saveFile(params) {
		const credentials = this.credentials;
		const s3 = new AWS.S3({
			region: aws_region,
			credentials,
		});
		return s3.upload(params).promise();
	}

	async deleteObject(params, bucket) {
		const credentials = this.credentials;
		const s3 = new AWS.S3({
			region: aws_region,
			bucket: bucket,
			credentials,
		});
		return await s3.deleteObject(params).promise();
	}
}

module.exports = S3;
