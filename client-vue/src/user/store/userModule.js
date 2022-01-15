import U from "@/lib/util/Util.js";
export default {
	namespaced: true,
	state: {
		user: {}
	},
	getters: {
		user: (state) => state.user
	},
	actions: {
		setUser({ commit }, { user }) {
			//console.log(user);
			commit("setUser", user);
		}
	},
	mutations: {
		setUser(state, user) {
			state.user = U.cloneDeep(user);
		}
	}
};
