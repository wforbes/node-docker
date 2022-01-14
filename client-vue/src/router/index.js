import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: () =>
			import(/* webpackChunkName: "home" */ "@/home/views/HomePage.vue")
	},
	{
		path: "/about",
		name: "About",
		component: () =>
			import(/* webpackChunkName: "home" */ "@/home/views/AboutPage.vue")
	},
	{
		path: "/auth",
		name: "Auth",
		component: () =>
			import(/* webpackChunkName: "auth" */ "@/auth/views/AuthPage.vue"),
		alias: ["/login", "/signup", "/verify", "/logout"],
		props: (route) => ({
			route: route.path,
			email: route.query.e,
			hash: route.query.h
		})
	},
	{
		path: "/dashboard",
		name: "Dashboard",
		component: () =>
			import(
				/* webpackChunkName: "dashboard" */ "@/user/views/DashboardPage.vue"
			)
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
