//import U from "@/lib/util/Util.js";
export default {
	namespaced: true,
	state: {
		categoryList: []
	},
	getters: {
		categoryList: (state) => state.categoryList
	},
	actions: {
		setCategoryList({ commit }, { categoryList }) {
			commit("setCategoryList", categoryList);
		}
	},
	mutations: {
		setCategoryList(state, categoryList) {
			state.categoryList = [...categoryList];
		}
	}
};
