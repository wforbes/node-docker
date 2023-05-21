<template>
	<v-container>
		<v-row v-for="(item, i) of menuItems" :key="i">
			<v-col class="pa-1">
				<v-btn width="100%" color="primary" @click="navigateTo(item.path)">{{
					item.text
				}}</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
export default {
	name: "UserMenu",
	data() {
		return {
			menuItems: [
				{
					text: "Edit Profile",
					path: "edit-profile"
				},
				{
					text: "Account",
					path: "account"
				}
			]
		};
	},
	methods: {
		navigateTo(path) {
			if (this.$router.currentRoute.path !== `/${path}`)
				this.$router.push(`/${path}`);
		}
	}
};
</script>
