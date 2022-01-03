import Vue from "vue";
import Vuex from "vuex";

import DataAccess from "@/data/DataAccess.js";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {},
	state: {
		vue: undefined,
		dataAccess: {},
		setupDone: false,
		host: "",
		localhostAddr: "http://localhost:8080",
		localApiHost: "http://localhost:3000"
	},
	getters: {
		vue: (state) => state.vue,
		dataAccess: (state) => state.dataAccess,
		setupDone: (state) => state.setupDone,
		host: (state) => state.host,
		localApiHost: (state) => state.localApiHost
	},
	actions: {
		async setupStore({ commit, dispatch }, { vue }) {
			commit("setVue", vue);
			await dispatch("setHost");
			await dispatch("setDataAccess");
			return Promise.resolve();
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
			let test = getters.dataAccess.testGet();
			console.log(test);
		}
	},
	mutations: {
		setVue(state, vue) {
			state.vue = vue;
		},
		setDataAccess(state, dataAccess) {
			state.dataAccess = dataAccess;
		},
		setSetupDone(state, done) {
			state.setupDone = done;
		},
		setHost(state, host) {
			state.host = host;
		}
	}
});
