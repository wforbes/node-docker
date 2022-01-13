<template>
	<v-container>
		<v-row v-if="responseLoading">
			<v-col></v-col>
		</v-row>
		<div v-else>
			<v-row>
				<v-col cols="12">
					<v-row v-if="successfullyVerified">
						<v-col>
							<h1>Your account is verified!</h1>
							<p>Thanks for verifying your email address at {{ email }}.</p>
							<p>
								The features of the app that send outgoing email should now be
								unlocked for you.
							</p>
						</v-col>
					</v-row>
					<v-row v-if="alreadyVerified">
						<v-col>
							<h1>Your account was already verified!</h1>
							<br />
							<p>
								You or someone with access to your email has already verified
								this account!
							</p>
							<p>
								If you were unaware of this change or feel this was a mistake,
								please contact our support.
							</p>
							<p>
								(Server response: <em>{{ errorMessage }}.</em>)
							</p>
						</v-col>
					</v-row>
					<v-row v-if="verificationFailed">
						<v-col>
							<h1>Bad Verification Request</h1>
							<p>Looks like there was a problem verifying your email!</p>
							<p>
								(Server response: <em>{{ errorMessage }}.</em>)
							</p>
						</v-col>
					</v-row>
					<v-row v-if="badRequest">
						<v-col>
							<h1>Bad Verification Request</h1>
							<p>Looks like there was a problem verifying your email!</p>
							<p>
								Please check your email inbox for the message we sent to you
								when you signed up for your account and follow the instructions
								in that message to verify your email address.
							</p>
						</v-col>
					</v-row>
					<v-row>
						<v-col align="center">
							<v-btn v-if="isLoggedIn" @click="openDashboard()">
								Go to Dashboard
							</v-btn>
							<div v-else>
								<v-row>
									<v-col align="right">
										<v-btn @click="openSignupForm()">Signup</v-btn>
									</v-col>
									<v-col align="left">
										<v-btn @click="openLoginForm()">Login</v-btn>
									</v-col>
								</v-row>
							</div>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
export default {
	name: "VerifyView",
	props: ["email", "hash"],
	data() {
		return {
			responseLoading: true,
			successfullyVerified: false,
			alreadyVerified: false,
			verificationSuccess: false,
			verificationFailed: false,
			errorMessage: ""
		};
	},
	created() {
		if (this.isEmpty(this.email) || this.isEmpty(this.hash)) {
			this.responseLoading = false;
			return;
		}
		console.log("verify attempt");
	},
	computed: {
		badRequest() {
			return this.isEmpty(this.email) || this.isEmpty(this.hash);
		},
		isLoggedIn() {
			return this.$store.getters.isLoggedIn;
		}
	},
	methods: {
		openDashboard() {
			this.$router.push("dashboard");
		},
		openLoginForm() {
			this.$emit("openLoginForm");
			this.$router.push("login");
		},
		openSignupForm() {
			this.$emit("openSignupForm");
			this.$router.push("signup");
		}
	}
};
</script>
