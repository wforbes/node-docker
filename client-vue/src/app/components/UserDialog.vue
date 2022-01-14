<template>
	<div>
		<v-dialog v-model="dialogOpen" ref="userDialog" persistent max-width="800">
			<v-card class="elevation-12">
				<v-toolbar dark dense flat>
					<v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn @click="closeDialog" icon>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-card>
					<v-list>
						<v-subheader>USER OPTIONS</v-subheader>
						<v-list-item-group color="primary" v-model="listSelection">
							<v-list-item link @click.native="routeTo('dashboard')">
								<v-list-item-icon>
									<v-icon>mdi-view-dashboard-variant</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>User Dashboard</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item link @click.native="routeTo('account')">
								<v-list-item-icon>
									<v-icon>mdi-account-cog</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Account Management</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item @click.native="logout">
								<v-list-item-icon>
									<v-icon>mdi-logout</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Logout</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-card>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	name: "UserDialog",
	props: ["dialogOpen"],
	data() {
		return {
			listSelection: null
		};
	},
	computed: {
		username() {
			return this.$store.getters.user.username;
		},
		toolbarTitle() {
			return "Hello, " + this.username + " !";
		}
	},
	methods: {
		routeTo(routeName) {
			this.listSelection = null;
			this.closeDialog();
			if (this.$router.currentRoute.path !== `/${routeName}`)
				return this.$router.push({ path: routeName });
			return;
		},
		logout() {
			this.listSelection = null;
			this.$store.dispatch("logoutUser");
			this.closeDialog();
			this.$router.push({ path: "logout" });
		},
		closeDialog() {
			this.$emit("closeDialog");
		}
	}
};
</script>
