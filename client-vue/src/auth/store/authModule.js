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
						type: "setLoggedIn",
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
		submitSignup({ rootGetters, dispatch }, { signupData }) {
			return rootGetters.da.submitSignup(signupData).then((response) => {
				if (!U.isEmpty(response.newUser)) {
					const user = response.newUser;
					dispatch({
						type: "setLoggedIn",
						user
					});
					return Promise.resolve(user);
				}
				return Promise.resolve();
			});
		},
		submitLogin({ rootGetters, dispatch }, { loginData }) {
			return rootGetters.da.submitLogin(loginData).then((response) => {
				if (response.status === "success") {
					const { user } = response;
					dispatch({
						type: "setLoggedIn",
						user
					});
					return Promise.resolve({ success: true });
				}
				return Promise.resolve({ success: false, message: response.message });
			});
		},
		setLoggedIn({ commit, getters }, { user }) {
			commit("setUser", user);
			commit("setLoginStatus", getters.LOGIN_STATES.IN);
		},
		logoutUser({ rootGetters, getters, commit }) {
			return rootGetters.da.logout().then(() => {
				commit("setLoginStatus", getters.LOGIN_STATES.OUT);
				return Promise.resolve();
			});
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
