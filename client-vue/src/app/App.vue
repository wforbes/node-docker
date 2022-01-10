<template>
	<v-app>
		<app-bar />
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
import AppBar from "@/app/components/AppBar.vue";
export default {
	name: "App",
	components: {
		AppBar
	},
	data: () => ({
		//
	})
};
</script>

<style>
.norm-link {
	text-decoration: none;
}
</style>
