import Vue from "vue";
import Vuex from "vuex";

import DataAccess from "@/data/DataAccess.js";
import Auth from "@/auth/store/authModule.js";
import User from "@/user/store/userModule.js";
import Lvlz from "@/lvlz/store/lvlzModule.js";

Vue.use(Vuex);

export default new Vuex.Store({
	namespaced: true,
	modules: {
		auth: Auth,
		user: User,
		lvlz: Lvlz
	},
	state: {
		vue: undefined,
		da: {},
		setupDone: false,
		apiHost: "",
		localhostAddr: "localhost:8080",
		localApiHost: "http://localhost:3000", //dev env api host
		prodHostAddr: ""
	},
	getters: {
		vue: (state) => state.vue,
		da: (state) => state.da,
		setupDone: (state) => state.setupDone,
		apiHost: (state) => state.apiHost,
		localhostAddr: (state) => state.localhostAddr,
		localApiHost: (state) => state.localApiHost,
		prodHostAddr: (state) => state.prodHostAddr
	},
	actions: {
		async setupStore({ dispatch, commit }, { vue }) {
			dispatch({
				type: "setVue",
				vue
			});
			dispatch("setApiHost");
			dispatch("setDataAccess");
			await dispatch("auth/initSession");
			commit("setSetupDone", true);
		},
		setVue({ commit }, { vue }) {
			commit("setVue", vue);
		},
		setApiHost({ commit, getters }) {
			const apiHost =
				window.location.host === getters.localhostAddr ||
				window.location.host.href === getters.localhostAddr
					? getters.localApiHost
					: "";
			commit("setApiHost", apiHost);
		},
		setDataAccess({ commit, getters }) {
			commit("setDataAccess", new DataAccess(getters.vue));
		}
	},
	mutations: {
		setVue(state, vue) {
			state.vue = vue;
		},
		setApiHost(state, apiHost) {
			state.apiHost = apiHost;
		},
		setDataAccess(state, da) {
			state.da = da;
		},
		setSetupDone(state, done) {
			state.setupDone = done;
		}
	}
});
