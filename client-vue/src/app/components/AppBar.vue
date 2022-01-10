<template>
	<v-app-bar app color="primary" dark>
		<div class="d-flex align-center">
			<router-link class="text-h4 white--text norm-link" :to="'/'">
				node-docker
			</router-link>
		</div>

		<v-spacer></v-spacer>

		<v-btn href="https://wforbes.net/" target="_blank" text>
			<span class="mr-2">Author's Site</span>
			<v-icon>mdi-open-in-new</v-icon>
		</v-btn>
	</v-app-bar>
</template>

<script>
export default {
	name: "AppBar",
	data() {
		return {};
	}
};
</script>
