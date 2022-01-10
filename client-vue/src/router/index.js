import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: () =>
			import(/* webpackChunkName: "home") */ "@/home/views/HomePage.vue")
	},
	{
		path: "/about",
		name: "About",
		component: () =>
			import(/* webpackChunkName: "about" */ "@/home/views/AboutPage.vue")
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
