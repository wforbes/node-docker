<template>
	<v-container>
		<v-row>
			<v-col>
				<div v-if="isLoggedIn">
					<v-card class="pa-5" min-height="420">
						<v-row>
							<v-col>
								<p class="text-h3">{{ user.username }}</p>
							</v-col>
							<v-col>
								<v-row>
									<UserMenu />
								</v-row>
							</v-col>
						</v-row>
						<v-row>
							<FeatureMenu />
						</v-row>
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
import FeatureMenu from "@/user/components/FeatureMenu.vue";
import UserMenu from "@/user/components/UserMenu.vue";
export default {
	name: "DashboardPage",
	components: {
		NotLoggedInView,
		FeatureMenu,
		UserMenu
	},
	data() {
		return {};
	},
	computed: {
		isLoggedIn() {
			return this.$store.getters["auth/isLoggedIn"];
		},
		user() {
			return this.$store.getters["user/user"];
		}
	}
};
</script>
