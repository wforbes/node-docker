<template>
	<v-container>
		<v-row>
			<v-col>
				<div v-if="isLoggedIn">
					<v-card class="pa-5" min-height="420">
						<v-row>
							<v-col>
								<v-btn>
									<v-icon>mdi-arrow-left</v-icon>
									Dashboard
								</v-btn>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								{{ user.username }}
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								{{ user.email }}
							</v-col>
						</v-row>
						<v-row v-if="user.profile">
							<v-col>
								{{ user.profile.firstName }}
							</v-col>
							<v-col>
								{{ user.profile.lastName }}
							</v-col>
							<v-col>
								{{ user.profile.phone }}
							</v-col>
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
export default {
	name: "EditProfilePage",
	components: {
		NotLoggedInView
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
