<template>
	<div>
		<v-container>
			<div v-if="showLoading">
				<v-row>
					<v-col cols="12" align="center">
						<v-progress-circular indeterminate color="primary" :size="25" />
						<h1>Signing up...</h1>
					</v-col>
				</v-row>
			</div>
			<div v-else>
				<v-row v-if="signupSubmitted">
					<v-col cols="12" align="center">
						<h2>Thanks for signing up!</h2>
						<br />
						<h3>
							We sent an email to <i>{{ submittedEmail }}</i>
						</h3>
						<br />
						<h4>Follow the email instructions to verify your account.</h4>
						<p><em>Remember to check your SPAM folder!</em></p>
						<br />
						<v-btn @click="openDashboard()">Continue to your Dashboard</v-btn>
					</v-col>
				</v-row>
				<v-row v-else>
					<v-col cols="12" sm="6" order-sm="1" order="2">
						<v-form v-model="signupValid">
							<v-text-field
								outlined
								label="Email"
								v-model="newEmail"
								:rules="[rules.required, rules.emailValid]"
							></v-text-field>
							<v-text-field
								outlined
								label="Username"
								v-model="newUsername"
								:rules="[
									rules.required,
									rules.usernameLength,
									rules.usernameValid,
									usernameIsUnique
								]"
								ref="usernameField"
							></v-text-field>
							<v-text-field
								outlined
								label="Password"
								v-model="newPassword"
								type="password"
								:rules="[
									rules.required,
									rules.passwordLength,
									rules.passwordValid
								]"
							></v-text-field>
							<v-text-field
								outlined
								label="Repeat Password"
								v-model="newRepeatPassword"
								type="password"
								:rules="[rules.required, rules.passwordMatch]"
								@keypress.enter="submitSignup"
							></v-text-field>
							<v-container>
								<v-row>
									<v-col>
										<v-btn color="error" @click="resetSignupForm">Reset</v-btn>
									</v-col>
									<v-col align="right">
										<v-btn
											@click="submitSignup"
											:disabled="!signupValid"
											color="success"
											>Sign Up</v-btn
										>
									</v-col>
								</v-row>
							</v-container>
						</v-form>
					</v-col>
					<v-col cols="12" sm="6" order-sm="2" order="1">
						<v-card class="elevation-6 pa-4">
							<span v-if="signupErrors.length === 0">
								<h5 class="text-h5">Signup for Node-Docker</h5>
								<span class="text-subtitle-1">
									To create an account on Node-Docker, we just need a couple
									pieces of info.<br />
								</span>
							</span>
							<span v-else-if="signupErrors.length >= 1">
								<h5 class="text-h6">
									Sorry, there
									<span v-if="signupErrors.length === 1">was a problem</span>
									<span v-else-if="signupErrors.length >= 2"
										>were problems</span
									>
									with your signup request:
								</h5>
								<span v-html="signupFeedback"></span>
							</span>
						</v-card>
						<v-card class="elevation-6 mt-5 pa-4">
							<span class="text-subtitle-1">
								The good news is we won't spam you and we'll never share your
								data with anyone.<br />
								<a @click="showMoreInfo">Click here for more info.</a>
							</span>
						</v-card>
					</v-col>
				</v-row>
			</div>
		</v-container>
		<DataStatementDialog
			:moreInfoOpen="moreInfoOpen"
			@closeMoreInfo="closeMoreInfo"
		/>
	</div>
</template>
<script>
//import _ from "lodash";
//import U from "@/lib/util/U.js";
import DataStatementDialog from "../components/DataStatementDialog.vue";
export default {
	name: "SignupForm",
	components: {
		DataStatementDialog
	},
	data() {
		return {
			signupSubmitted: false,
			submittedEmail: "",
			showLoading: false,
			emailRegex: this.getEmailRegex(),
			noSpecialCharRegex: this.getNoSpecialCharRegex(),
			containsSpecialCharRegex: this.getContainsSpecialCharRegex(),
			beginsWithNumberRegex: this.getBeginsWithNumberRegex(),
			noSpecialCharMsg: "Can only contain: [ A-Z, a-z, 0-9, . and _ ].",
			invalidBeginMsg: "Can't begin with . or _ characters.",
			invalidDotScoreMsg: "Can't contain: [..],[._],[_.] or [__].",
			invalidEndMsg: "Can't end with . or _ characters.",
			invalidStartNumberMsg: "Can't begin with a number.",
			requiredMsgPrefix: "Required: ",
			lowerCaseLetterMsg: "one lowercase letter",
			upperCaseLetterMsg: "one uppercase letter",
			containsNumberMsg: "one number",
			containsSpecialCharMsg: "one special character",
			usernameTakenMsg: "That username is taken",
			signupValid: true,
			signupFeedback: "",
			signupErrors: [],
			moreInfoOpen: false,
			newEmail: "",
			newUsername: "",
			newPassword: "",
			newRepeatPassword: "",
			emailTakenMsg: "",
			emailValidationMsg: "",
			usernameValidationMsg: "",
			usernameIsUnique: true,
			usernameUniqueMsg: "",
			passwordValidationMsg: "",
			passwordMatchMsg: "",
			rules: {
				required: (value) => !!value || "This can't be blank.",
				emailValid: (value) =>
					this.emailRegex.test(value) || "A valid Email is required.",
				usernameLength: (value) =>
					(value.length >= 3 && value.length <= 20) ||
					"Must be between 3 and 20 characters.",
				usernameValid: (value) =>
					this.isValidUsername(value) || this.usernameValidationMsg,
				passwordLength: (value) =>
					(value.length >= 6 && value.length <= 32) ||
					"Must be between 6 and 32 characters.",
				passwordValid: (value) =>
					this.isValidPassword(value) || this.passwordValidationMsg,
				passwordMatch: (value) =>
					value === this.newPassword || "Both passwords must match."
			}
		};
	},
	watch: {
		async newUsername(newV, oldV) {
			if (newV !== oldV) {
				this.validateUsernameExistence(newV);
			}
		}
	},
	methods: {
		openDashboard() {
			this.$router.push("dashboard");
		},
		showMoreInfo() {
			this.moreInfoOpen = true;
		},
		closeMoreInfo() {
			this.moreInfoOpen = false;
		},
		async submitSignup() {
			console.log("sign up submitted");

			this.showLoading = true;
			await this.$store
				.dispatch({
					type: "auth/submitSignup",
					signupData: {
						username: this.newUsername,
						password: this.newPassword,
						repeatPassword: this.newRepeatPassword,
						email: this.newEmail
					}
				})
				.then((user) => {
					if (this.isEmpty(user)) {
						this.signupFeedback = "<ul style='list-style:none; padding:0;'>";
						this.signupFeedback +=
							"<li style='color:red;'><strong>There was a problem</strong></li>";
						this.signupFeedback += "</ul>";
						/*
						this.signupErrors = errors;
						this.signupFeedback = "<ul style='list-style:none; padding:0;'>";
						for (let msg of this.signupErrors) {
							this.signupFeedback +=
								"<li style='color:red;'><strong>" + msg + "</strong></li>";
						}
						this.signupFeedback += "</ul>";
						*/
					} else {
						this.submittedEmail = this.newEmail;
						this.signupSubmitted = true;
						this.resetSignupForm();
					}
					this.showLoading = false;
				});
		},
		isValidUsername(username) {
			if (!username) return false;
			this.usernameValidationMsg = "";
			const formValid = this.usernameContainsNoSpecialChars(username);
			const startValid = this.usernameStartIsValid(username);
			const dotScoreValid = this.usernameDotScoreIsValid(username);
			const endValid = this.usernameEndIsValid(username);
			const startNumberValid = this.usernameStartNumberIsValid(username);
			return (
				formValid && startValid && dotScoreValid && endValid && startNumberValid
			);
		},
		async validateUsernameExistence(username) {
			if (this.isEmpty(this.$refs.usernameField) || this.newUsername === "")
				return;
			//if username isn't valid, don't bother
			// TODO: still need to find regex to handle
			//	triggering invalidation with % in the name
			//	in time to hit this if with errorMessages.
			if (
				(this.$refs.usernameField.errorMessages.length > 0 &&
					this.$refs.usernameField.errorMessages.findIndex(
						(x) => x === this.usernameTakenMsg
					) === -1) ||
				username.includes("%")
			)
				return;

			let isUnique = true;

			//ensure the app is done setting up, then see if
			//	username is unique
			if (this.$store.getters.setupDone)
				isUnique = await this.isUniqueUsername(username);

			// if it isn't unique
			if (!isUnique) {
				// but the username field is not invalidated
				if (this.$refs.usernameField.error === false) {
					this.usernameIsUnique = false; // update rule boolean
					// check to see if this error message is present
					let errorIdx = this.$refs.usernameField.errorMessages.findIndex(
						(x) => x === this.usernameTakenMsg
					);
					// if its not present, then display this error message
					if (errorIdx === -1)
						this.$refs.usernameField.errorMessages.push(this.usernameTakenMsg);
				}
			} else {
				// if it IS unique, check if there are error messages
				if (this.$refs.usernameField.errorMessages.length > 0) {
					// check if this error message is present
					let errorIdx = this.$refs.usernameField.errorMessages.findIndex(
						(x) => x === this.usernameTakenMsg
					);
					// if it is, then remove it
					if (errorIdx !== -1)
						this.$refs.usernameField.errorMessages.splice(errorIdx, 1);
				}
				this.usernameIsUnique = true; // update rule boolean
			}
		},
		async isUniqueUsername(username) {
			if (!username) return false;
			this.usernameUniqueMsg = "";
			const usernameExists = await this.$store.dispatch({
				type: "auth/userExists",
				username: this.newUsername
			});
			return !usernameExists;
		},
		usernameContainsNoSpecialChars(str) {
			if (this.noSpecialCharRegex.test(str)) {
				return true;
			} else {
				this.checkUsernameForDelimAdd();
				this.usernameValidationMsg += this.noSpecialCharMsg;
				return false;
			}
		},
		usernameStartIsValid(str) {
			if (!str.startsWith(".") && !str.startsWith("_")) {
				return true;
			} else {
				this.checkUsernameForDelimAdd();
				this.usernameValidationMsg += this.invalidBeginMsg;
				return false;
			}
		},
		usernameDotScoreIsValid(username) {
			if (
				!username.includes("..") &&
				!username.includes("__") &&
				!username.includes("._") &&
				!username.includes("_.")
			) {
				return true;
			} else {
				this.checkUsernameForDelimAdd();
				this.usernameValidationMsg += this.invalidDotScoreMsg;
				return false;
			}
		},
		usernameEndIsValid(username) {
			if (!username.endsWith(".") && !username.endsWith("_")) {
				return true;
			} else {
				this.checkUsernameForDelimAdd();
				this.usernameValidationMsg += this.invalidEndMsg;
				return false;
			}
		},
		usernameStartNumberIsValid(username) {
			if (!this.beginsWithNumberRegex.test(username)) {
				return true;
			} else {
				this.checkUsernameForDelimAdd();
				this.usernameValidationMsg += this.invalidStartNumberMsg;
				return false;
			}
		},
		checkUsernameForDelimAdd() {
			this.usernameValidationMsg +=
				this.usernameValidationMsg !== "" ? "; " : "";
		},
		isValidPassword(password) {
			this.passwordValidationMsg = "";
			const containsLower = this.passwordContainsLower(password);
			const containsUpper = this.passwordContainsUpper(password);
			const containsNumber = this.passwordContainsNumber(password);
			const containsSpecial = this.passwordContainsSpecialChar(password);

			return (
				containsLower && containsUpper && containsNumber && containsSpecial
			);
		},
		passwordContainsLower(password) {
			if (password.match(/(?=.*[a-z])/g)) {
				return true;
			} else {
				this.checkPasswordForRequired();
				this.checkPasswordForDelimAdd();
				this.passwordValidationMsg += this.lowerLetterCaseMsg;
				return false;
			}
		},
		passwordContainsUpper(password) {
			if (password.match(/(?=.*[A-Z])/g)) {
				return true;
			} else {
				this.checkPasswordForRequired();
				this.checkPasswordForDelimAdd();
				this.passwordValidationMsg += this.upperCaseLetterMsg;
				return false;
			}
		},
		passwordContainsNumber(password) {
			if (password.match(/(?=.*\d)/g)) {
				return true;
			} else {
				this.checkPasswordForRequired();
				this.checkPasswordForDelimAdd();
				this.passwordValidationMsg += this.containsNumberMsg;
				return false;
			}
		},
		passwordContainsSpecialChar(password) {
			if (password.match(this.containsSpecialCharRegex)) {
				return true;
			} else {
				this.checkPasswordForRequired();
				this.checkPasswordForDelimAdd();
				this.passwordValidationMsg += this.containsSpecialCharMsg;
			}
		},
		checkPasswordForDelimAdd() {
			this.passwordValidationMsg +=
				this.passwordValidationMsg !== "" &&
				this.passwordValidationMsg !== this.requiredMsgPrefix
					? "; "
					: "";
		},
		checkPasswordForRequired() {
			this.passwordValidationMsg += !this.passwordValidationMsg.startsWith(
				this.requiredMsgPrefix
			)
				? this.requiredMsgPrefix
				: "";
		},
		resetSignupForm() {
			this.newEmail = "";
			this.newUsername = "";
			this.newPassword = "";
			this.newRepeatPassword = "";
			this.signupFeedback = "";
			this.signupErrors = [];
		}
		/*,
		closeDialog() {
			this.$emit("closeDialog");
		}*/
	}
};
</script>
