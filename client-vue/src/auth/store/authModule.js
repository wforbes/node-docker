import U from "@/lib/util/Util.js";
export default {
	state: {
		LOGIN_STATES: {
			IN: "in",
			OUT: "out",
			LOADING: "loading"
		},
		loginStatus: false,
		user: {}
	},
	getters: {
		LOGIN_STATES: (state) => state.LOGIN_STATES,
		loginStatus: (state) => state.loginStatus,
		isLoggedIn: (state) => state.loginStatus === state.LOGIN_STATES.IN,
		loginIsLoading: (state) => state.loginStatus === state.LOGIN_STATES.LOADING,
		user: (state) => state.user
	},
	actions: {
		initSession({ commit, dispatch, getters, rootState }) {
			commit({
				type: "setLoginStatus",
				status: getters.LOGIN_STATES.LOADING
			});
			return rootState.da.checkSession().then((responseData) => {
				if (!U.isEmpty(responseData.user)) {
					dispatch({
						type: "loginUser",
						user: responseData.user
					});
				} else {
					commit({
						type: "setLoginStatus",
						status: getters.LOGIN_STATES.OUT
					});
				}
				return Promise.resolve();
			});
		},
		async userExists({ rootGetters }, { username }) {
			return rootGetters.da.userExists(username).then((response) => {
				return Promise.resolve(response.exists);
			});
		},
		async submitSignup({ rootGetters, dispatch }, { signupData }) {
			return rootGetters.da.submitSignup(signupData).then((response) => {
				if (!U.isEmpty(response.newUser)) {
					const user = response.newUser;
					dispatch({
						type: "loginUser",
						user
					});
					return Promise.resolve(user);
				}
				return Promise.resolve();
			});
		},
		loginUser({ commit, getters }, { user }) {
			commit("setUser", user);
			commit("setLoginStatus", getters.LOGIN_STATES.IN);
		}
	},
	mutations: {
		setUser(state, user) {
			state.user = U.cloneDeep(user);
		},
		setLoginStatus(state, status) {
			state.loginStatus = status;
		}
	}
};
