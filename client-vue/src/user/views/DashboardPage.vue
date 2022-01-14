<template>
	<v-container>
		<v-row>
			<v-col>
				<h1>Dashboard</h1>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<div v-if="isLoggedIn">
					<v-card class="pa-2" min-height="420">
						<p>Logged in as {{ user.username }}.</p>
					</v-card>
				</div>
				<div v-else>
					<NotLoggedInView />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import NotLoggedInView from "@/app/views/NotLoggedInView.vue";
export default {
	name: "DashboardPage",
	components: {
		NotLoggedInView
	},
	data() {
		return {};
	},
	computed: {
		isLoggedIn() {
			return this.$store.getters.isLoggedIn;
		},
		user() {
			return this.$store.getters.user;
		}
	}
};
</script>
