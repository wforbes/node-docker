import Vue from "vue";
import Vuex from "vuex";

import DataAccess from "@/data/DataAccess.js";
import Auth from "@/auth/store/authModule.js";
import User from "@/user/store/userModule.js";

Vue.use(Vuex);

export default new Vuex.Store({
	namespaced: true,
	modules: {
		auth: Auth,
		user: User
	},
	state: {
		vue: undefined,
		da: {},
		setupDone: false,
		host: "",
		localhostAddr: "http://localhost:8080",
		localApiHost: "http://localhost", //dev env api host
		prodHostAddr: ""
	},
	getters: {
		vue: (state) => state.vue,
		da: (state) => state.da,
		setupDone: (state) => state.setupDone,
		host: (state) => state.host,
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
			dispatch("setHost");
			dispatch("setDataAccess");
			await dispatch("auth/initSession");
			commit("setSetupDone", true);
		},
		setVue({ commit }, { vue }) {
			commit("setVue", vue);
		},
		setHost({ commit, getters }) {
			commit(
				"setHost",
				window.location.host === getters.localhostAddr ||
					window.location.host.href === getters.localhostAddr
					? getters.localApiHost
					: getters.prodHostAddr
			);
		},
		setDataAccess({ commit, getters }) {
			commit("setDataAccess", new DataAccess(getters.vue));
		}
	},
	mutations: {
		setVue(state, vue) {
			state.vue = vue;
		},
		setHost(state, host) {
			state.host = host;
		},
		setDataAccess(state, da) {
			state.da = da;
		},
		setSetupDone(state, done) {
			state.setupDone = done;
		}
	}
});
