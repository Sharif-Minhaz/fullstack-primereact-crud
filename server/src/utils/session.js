const fs = require("fs");
class Session {
	constructor(app) {
		this.app = app;
		this.id = null;
	}

	purge() {
		if (fs.existsSync(this.app.config.session_path) === false) return;
		let sessions = fs.readdirSync(this.app.config.session_path);
		let dt2 = new Date();
		for (let session of sessions) {
			let file = `${this.app.config.session_path}/${session}`;
			let stats = fs.statSync(file);
			let dt = new Date(stats.ctime);
			if (dt2 - dt > 3600000) fs.unlinkSync(file);
			console.log(
				`File Date: ${dt} - Current Date: ${dt2} - Difference: ${(dt2 - dt) / 1000}`
			);
		}
	}
	async Start(id = null) {
		this.id = id;
		if (Math.floor(Math.random() * 4) % 4 == 1) this.purge();
		if (this.id == null) {
			this.id = crypto.randomUUID();
			return await this.createNew();
		} else {
			return await this.Open(this.id);
		}
	}
	async Open(id) {
		// 1000 % 50 == 0 has only 20 possible values 0,50,100, 150... 1000
		// So this should be true approximately 20/1000 times
		if (Math.floor(Math.random() * 1000) % 50 == 0) await this.purge();
		this.id = id;

		let path = `${this.app.config.session_path}/${id}`;
		if (fs.existsSync(path)) {
			let s = JSON.parse(fs.readFileSync(path));
			for (var k in s) {
				this[k] = s[k];
			}
		} else {
			return await this.createNew();
		}

		return this;
	}
	async Save() {
		var sObject = {};
		this.t = new Date();
		this.app.log(`Saving session ${new Date() - this.t}`);
		sObject.lastUsed = new Date();
		for (var p in this) {
			if (p == "app" || p == "id" || this[p] == "") continue;
			sObject[p] = this[p];
		}
		return await this._save(sObject);
	}

	async createNew() {
		if (!fs.existsSync(this.app.config.session_path)) {
			let folders = this.app.config.session_path.split("/");
			let testPath = "";
			for (let folder of folders) {
				if (folder.trim() == "") continue;
				testPath = `${testPath}/${folder}`;
				if (!fs.existsSync(testPath)) fs.mkdirSync(testPath);
			}
		}
		let path = `${this.app.config.session_path}/${this.id}`;
		fs.writeFileSync(path, JSON.stringify({}));

		return this;
	}

	async _save(object) {
		fs.writeFileSync(`${this.app.config.session_path}/${this.id}`, JSON.stringify(object));
		console.log(`Session saved ${new Date() - this.t}`);
	}

	async deleteSessionFile() {
		if (
			fs.existsSync(this.app.config.session_path) === false ||
			fs.existsSync(`${this.app.config.session_path}/${this.id}`) === false
		) {
			return;
		}

		fs.unlinkSync(`${this.app.config.session_path}/${this.id}`);
	}
}

module.exports = Session;
