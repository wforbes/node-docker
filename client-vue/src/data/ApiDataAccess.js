import axios from "axios";

export default class ApiDataAccess {
	vue;
	host;
	constructor(vue) {
		this.vue = vue;
		axios.defaults.withCredentials = true;
	}

	requestUrl(endpoint) {
		return `${this.vue.$store.getters.localApiHost}/api/v1/${endpoint}`;
	}

	get(endpoint, options = {}) {
		return new Promise(async (resolve) => {
			axios
				.get(
					this.requestUrl(endpoint) +
						(!this.vue.isEmpty(options) ? `${options.id}` : ""),
					{
						validateStatus: function (status) {
							return status < 500;
						}
					}
				)
				.catch((error) => {
					return resolve(error);
				})
				.then((response) => {
					if (!this.vue.isEmpty(response) && !this.vue.isEmpty(response.data)) {
						return resolve(response.data);
					}
					return resolve(response);
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
					console.log(response);
					if (!this.vue.isEmpty(response) && !this.vue.isEmpty(response.data)) {
						return resolve(response.data);
					}
					return resolve(response);
				});
		});
	}

	userExists(username) {
		return this.get(`users/userExists/${username}`);
	}
	submitSignup(data) {
		return this.post("users/signup", data);
	}
	checkSession() {
		return this.get("users/checkSession");
	}
	submitLogin(data) {
		return this.post("users/login", data);
	}
	logout() {
		return this.post("users/logout");
	}
}
