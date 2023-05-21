import ApiDataAccess from "./ApiDataAccess.js";
//import { errorInterceptor } from "@/data/ErrorInterceptor.js";
class DataAccess {
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
	submitLogin(data) {
		return this.dataContext.submitLogin(data);
	}
	logout() {
		return this.dataContext.logout();
	}
	updateUserFieldById(data) {
		return this.dataContext.updateUserFieldById(data);
	}
}

export default DataAccess;
