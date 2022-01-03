import axios from "axios";

export default class ApiDataAccess {
	vue;
	host;
	constructor(vue) {
		this.vue = vue;
	}

	requestUrl(endpoint) {
		return `${this.vue.$store.getters.localApiHost}/api/v1/${endpoint}/`;
	}

	testGet() {
		console.log(this.requestUrl());
		return new Promise(async (resolve) => {
			axios
				.get(this.requestUrl("posts"))
				.catch((error) => {
					resolve(error);
				})
				.then((response) => {
					console.log(response);
					return resolve(response);
					/*
				if (!response?.data?.results) {
					return resolve(response.data.results);
				}
				return resolve(response.data);
				*/
				});
		});
	}
}
