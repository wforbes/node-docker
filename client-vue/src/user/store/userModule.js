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
		updateMyUserField({ rootState, getters, commit }, { field, value }) {
			return rootState.da
				.updateUserFieldById({
					id: getters.user.id,
					field: field,
					value: value
				})
				.then((response) => {
					console.log(response);
					if (response.user) {
						console.log(response.user);
						commit("setUser", response.user);
						return Promise.resolve(true);
					}
					console.log(response);
					return Promise.resolve(false);
				});
		}
	},
	mutations: {
		setUser(state, user) {
			state.user = U.cloneDeep(user);
		}
	}
};
