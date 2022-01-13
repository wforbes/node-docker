import axios from "axios";

export default class ApiDataAccess {
	vue;
	host;
	constructor(vue) {
		this.vue = vue;
	}

	requestUrl(endpoint) {
		return `${this.vue.$store.getters.localApiHost}/api/v1/${endpoint}`;
	}

	get(endpoint, options = {}) {
		return new Promise(async (resolve) => {
			axios
				.get(
					this.requestUrl(endpoint) +
						(!this.vue.isEmpty(options) ? `${options.id}` : "")
				)
				.catch((error) => {
					resolve(error);
				})
				.then((response) => {
					if (!this.vue.isEmpty(response.data.status)) {
						return resolve(response.data.data);
					}
					return resolve(response.data);
				});
		});
	}

	post(endpoint, body = {}) {
		return new Promise((resolve) => {
			axios
				.post(this.requestUrl(endpoint), body)
				.catch(({ response }) => {
					if (response.status === "fail" && !this.vue.isEmpty(response.data)) {
						let fieldErrors = response.data;
						console.log(fieldErrors);
						return resolve({ fieldErrors });
					}
				})
				.then((response) => {
					if (!this.vue.isEmpty(response) && !this.vue.isEmpty(response.data)) {
						return resolve(response.data.data);
					}
					return resolve(response);
				});
		});
	}

	head(endpoint, options = {}) {
		return new Promise((resolve) => {
			axios
				.head(
					this.requestUrl(endpoint) +
						(!this.vue.isEmpty(options) ? `${options.id}` : "")
				)
				.catch((error) => {
					return resolve(error);
				})
				.then((response) => {
					return resolve(response.data.status);
				});
		});
	}

	userExists(username) {
		return this.get(`users/userExists/${username}`);
	}
	submitSignup(data) {
		return this.post("users/signup", data);
	}
}
