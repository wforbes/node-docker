<template>
	<div>
		<v-container>
			<v-row>
				<v-col align="center">
					<div v-if="loginErrors.length >= 1">
						<h5 class="text-h6">
							Sorry, there
							<span v-if="loginErrors.length === 1">was a problem</span>
							<span v-else-if="loginErrors.length >= 2">were problems</span>
							with your login request:
						</h5>
						<span v-html="loginFeedback"></span>
					</div>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12" offset-sm="3" sm="6">
					<v-form v-model="loginValid">
						<v-text-field
							outlined
							label="Email / Username"
							v-model="loginUsername"
							:rules="[rules.required]"
						></v-text-field>
						<v-text-field
							outlined
							label="Password"
							type="password"
							v-model="loginPassword"
							:rules="[rules.required]"
							@keypress.enter="submitLogin"
						></v-text-field>
						<v-container>
							<v-row>
								<v-col>
									<v-btn color="error" @click="resetLoginForm">Reset</v-btn>
								</v-col>
								<v-col align="right">
									<v-btn
										:disabled="!loginValid"
										color="success"
										@click="submitLogin"
									>
										Log In
									</v-btn>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>
<script>
export default {
	name: "LoginForm",
	data() {
		return {
			loginValid: true,
			loginErrors: [],
			loginFeedback: "",
			loginUsername: "",
			loginPassword: "",
			rules: {
				required: (value) => !!value || "This can't be blank."
			}
		};
	},
	methods: {
		submitLogin() {
			this.loginErrors = [];
			console.log("login attempt");
			/*
			this.$store
				.dispatch({
					type: "submitLogin",
					loginData: {
						u: this.loginUsername,
						p: this.loginPassword
					}
				})
				.then((response) => {
					this.loginFeedback = response;
					if (response.data["success"]) {
						this.loginFeedback = response.data["success"];
						this.$store.dispatch({
							type: "loginUser",
							userId: response.data["success"]["userId"],
							username: response.data["success"]["username"],
							userEmail: response.data["success"]["userEmail"],
							userProfileId: response.data["success"]["userProfileId"]
						});
						this.$emit("closeDialog");
						if (this.$route.path !== "/dashboard") {
							this.$router.push("dashboard");
						}
					} else if (response.data["errors"]) {
						this.loginFeedback = response.data["errors"];
						this.loginErrors = response.data["errors"];
						this.loginFeedback = "<ul style='list-style:none; padding:0;'>";
						for (let msg of this.loginErrors) {
							this.loginFeedback +=
								"<li style='color:red;'><strong>" + msg + "</strong></li>";
						}
						this.loginFeedback += "</ul>";
					}
				});
				*/
		},
		resetLoginForm() {
			this.loginUsername = "";
			this.loginPassword = "";
			this.loginErrors = [];
			this.loginFeedback = "";
		}
	}
};
</script>
