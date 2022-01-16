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
		},
		updateMyUserField({ rootState, getters }, { field, value }) {
			return rootState.da
				.updateUserFieldById({
					id: getters.user.id,
					field: field,
					value: value
				})
				.then((response) => {
					console.log(response);
					return Promise.resolve(response);
				});
		}
	},
	mutations: {
		setUser(state, user) {
			state.user = U.cloneDeep(user);
		}
	}
};
