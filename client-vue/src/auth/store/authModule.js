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
		LOGIN_STATES: (state) => {
			return state.LOGIN_STATES;
		},
		loginStatus: (state) => {
			return state.loginStatus;
		},
		isLoggedIn: (state) => {
			return state.loginStatus === state.LOGIN_STATES.IN;
		},
		loginIsLoading: (state) => {
			return state.loginStatus === state.LOGIN_STATES.LOADING;
		}
	},
	actions: {
		async userExists({ rootGetters }, { username }) {
			return rootGetters.da.userExists(username).then((response) => {
				return Promise.resolve(response.exists);
			});
		},
		async submitSignup({ rootGetters, dispatch }, { signupData }) {
			return rootGetters.da.submitSignup(signupData).then((response) => {
				console.log(response.newUser);
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
