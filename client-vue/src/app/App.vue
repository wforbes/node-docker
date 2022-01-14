<template>
	<v-app>
		<app-bar />
		<v-main>
			<v-container>
				<v-row>
					<v-col
						offset-md="1"
						md="10"
						offset-lg="2"
						lg="8"
						offset-xl="3"
						xl="6"
						cols="12"
						class="pa-0 mx-auto mt-5"
					>
						<router-view :key="$route.fullPath"></router-view>
					</v-col>
				</v-row>
			</v-container>
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
	}),
	async created() {
		await this.$store.dispatch({
			type: "setupStore",
			vue: this
		});
	}
};
</script>

<style>
.norm-link {
	text-decoration: none;
}
</style>
