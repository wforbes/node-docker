<template>
	<v-container>
		<v-row>
			<v-col>
				<div v-if="isLoggedIn">
					<v-card class="pa-5" min-height="420">
						<v-row>
							<v-col cols="3">
								<v-btn color="primary" @click="navigateTo('dashboard')">
									<v-icon>mdi-arrow-left</v-icon>
									Dashboard
								</v-btn>
							</v-col>
							<v-col>
								<span class="text-h3"> Edit Profile </span>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12" sm="8" md="6">
								<!--
								<ToggleEditTextField 
									:activeField="activeField"
									:editObject="editUser"
									:editField="username"
									@activateField="activateField"
									@setActiveField="setActiveField"
									@saveField="saveField"
									@clearActiveField="clearActiveField"
								/>
								-->
								<v-text-field
									outlined
									:readonly="!fieldActive('username')"
									:class="fieldActive('username') ? 'field-active' : ''"
									v-model="editUser.username"
									label="Username"
									@click="activateField('username')"
									:placeholder="user.username"
								>
									<template v-slot:append>
										<div
											v-if="fieldActive('username')"
											class="d-inline-flex justify-end"
										>
											<v-btn
												icon
												class="mt-2 d-inline-flex"
												@click="saveField('username')"
											>
												<v-icon color="success">mdi-content-save</v-icon>
											</v-btn>
											<v-btn
												icon
												class="mt-2 d-inline-flex"
												@click="clearActiveField()"
											>
												<v-icon color="error">mdi-cancel</v-icon>
											</v-btn>
										</div>
										<div v-else class="d-flex justify-end">
											<v-btn
												icon
												class="mt-2"
												@click="setActiveField('username')"
											>
												<v-icon>mdi-pencil</v-icon>
											</v-btn>
										</div>
									</template>
								</v-text-field>
							</v-col>
							<v-col cols="12" sm="8" md="6">
								<v-text-field
									:readonly="fieldActive('email')"
									outlined
									label="Email"
									:placeholder="user.email"
								>
									<template v-slot:append>
										<v-btn icon class="mt-2" @click="setActiveField('email')">
											<v-icon>mdi-pencil</v-icon>
										</v-btn>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row v-if="user.profile">
							<v-col>
								<v-text-field
									:readonly="fieldActive('firstName')"
									outlined
									label="First Name"
									:placeholder="user.profile.firstName"
								>
									<template v-slot:append>
										<v-btn
											icon
											class="mt-2"
											@click="setActiveField('firstName')"
										>
											<v-icon>mdi-pencil</v-icon>
										</v-btn>
									</template>
								</v-text-field>
							</v-col>
							<v-col>
								<v-text-field
									:readonly="fieldActive('lastName')"
									outlined
									label="Last Name"
									:placeholder="user.profile.lastName"
								>
									<template v-slot:append>
										<v-btn
											icon
											class="mt-2"
											@click="setActiveField('lastName')"
										>
											<v-icon>mdi-pencil</v-icon>
										</v-btn>
									</template>
								</v-text-field>
							</v-col>
							<v-col>
								<v-text-field
									:readonly="fieldActive('phone')"
									outlined
									label="Phone Number"
									:placeholder="user.profile.phone"
								>
									<template v-slot:append>
										<v-btn icon class="mt-2" @click="setActiveField('phone')">
											<v-icon>mdi-pencil</v-icon>
										</v-btn>
									</template>
								</v-text-field>
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
		return {
			activeField: "",
			editUser: {}
		};
	},
	created() {
		this.editUser = this.cloneDeep(this.user);
	},
	computed: {
		isLoggedIn() {
			return this.$store.getters["auth/isLoggedIn"];
		},
		user() {
			return this.$store.getters["user/user"];
		}
	},
	methods: {
		fieldActive(field) {
			return field === this.activeField;
		},
		activateField(field) {
			if (!this.fieldActive(field)) {
				this.activeField = field;
			}
		},
		setActiveField(field) {
			this.activeField = field;
		},
		clearActiveField() {
			this.activeField = "";
		},
		saveField(field) {
			this.$store
				.dispatch({
					type: "user/updateMyUserField",
					field,
					value: this.editUser[field]
				})
				.then((response) => {
					console.log(response);
				});
		},
		navigateTo(routeName) {
			return this.$router.push({ path: routeName });
		}
	}
};
</script>

<style>
.v-input__append-inner {
	margin-top: 0 !important;
	padding: 0 !important;
}
.field-active .v-input__append-inner {
	width: 20%;
}
</style>
