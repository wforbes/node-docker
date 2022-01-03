import ApiDataAccess from "./ApiDataAccess.js";
export default class DataAccess {
	dataContext;
	constructor(vue) {
		this.dataContext = new ApiDataAccess(vue);
	}
	testGet() {
		this.dataContext.testGet();
	}
}
