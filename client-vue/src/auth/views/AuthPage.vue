<template>
	<v-container fill-height fluid>
		<v-row align="center">
			<v-col>
				<v-card v-if="showVerifyView">
					<VerifyView
						:email="email"
						:hash="hash"
						@openLoginForm="openLoginForm"
						@openSignupForm="openSignupForm"
					/>
				</v-card>
				<v-card v-else-if="showLogoutView">
					<LogoutView />
				</v-card>
				<v-card v-else>
					<v-tabs
						v-model="tabsKey"
						background-color="primary"
						dark
						fixed-tabs
						icons-and-text
					>
						<v-tab :key="0">
							Signup
							<v-icon>mdi-account-plus</v-icon>
						</v-tab>
						<v-tab-item :key="0">
							<SignupForm />
						</v-tab-item>
						<v-tab :key="1">
							Log In
							<v-icon>mdi-login</v-icon>
						</v-tab>
						<v-tab-item :key="1">
							<LoginForm />
						</v-tab-item>
					</v-tabs>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import SignupForm from "@/auth/components/SignupForm.vue";
import LoginForm from "@/auth/components/LoginForm.vue";
import LogoutView from "@/auth/views/LogoutView.vue";
import VerifyView from "@/auth/views/VerifyView.vue";
export default {
	name: "AuthPage",
	props: ["route", "email", "hash"],
	components: {
		SignupForm,
		LoginForm,
		LogoutView,
		VerifyView
	},
	data() {
		return {
			pageState: "",
			tabsKey: 0,
			signupKey: 0,
			loginKey: 1
		};
	},
	computed: {
		showVerifyView() {
			return this.route.substring(1) === "verify";
		},
		showLogoutView() {
			return this.route.substring(1) === "logout";
		}
	},
	created() {
		this.tabsKey =
			this.route.substring(1) === "login" ? this.loginKey : this.signupKey;
	}
};
</script>
