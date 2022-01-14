import ApiDataAccess from "./ApiDataAccess.js";
export default class DataAccess {
	dataContext;
	constructor(vue) {
		this.dataContext = new ApiDataAccess(vue);
	}
	userExists(username) {
		return this.dataContext.userExists(username);
	}
	submitSignup(data) {
		return this.dataContext.submitSignup(data);
	}
	checkSession() {
		return this.dataContext.checkSession();
	}
}
