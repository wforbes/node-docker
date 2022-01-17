<template>
	<v-container>
		<v-row>
			<v-col>
				<div v-if="isLoggedIn">
					<v-card class="pa-5" min-height="420">
						<v-row>
							<v-col cols="5" sm="4" md="3">
								<v-btn color="primary" @click="navigateTo('dashboard')">
									<v-icon>mdi-arrow-left</v-icon>
									Dashboard
								</v-btn>
							</v-col>
							<v-col>
								<span class="text-h4"> Edit Profile </span>
							</v-col>
						</v-row>
						<v-row>
							<v-col
								v-for="([key, val], i) of userFields"
								:key="i"
								cols="12"
								sm="8"
								md="6"
							>
								<ToggleEditTextField
									:activeField="activeField"
									:field="key"
									:currentValue="val"
									:fieldLoading="fieldLoading.find((f) => f.name === key)"
									@activateField="activateField"
									@setActiveField="setActiveField"
									@saveField="saveField"
									@clearActiveField="clearActiveField"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="8" sm="5" md="5">
								<ToggleEditTextField
									:subObject="'profile'"
									:activeField="activeField"
									:field="'firstName'"
									:label="'First Name'"
									:currentValue="user.profile.firstName"
									:fieldLoading="fieldLoading.find((f) => f.name === key)"
									@activateField="activateField"
									@setActiveField="setActiveField"
									@saveField="saveField"
									@clearActiveField="clearActiveField"
								/>
							</v-col>
							<v-col cols="4" sm="3" md="2">
								<ToggleEditTextField
									:subObject="'profile'"
									:activeField="activeField"
									:field="'middleInitial'"
									:label="'M.I.'"
									:currentValue="user.profile.middleInitial"
									:fieldLoading="fieldLoading.find((f) => f.name === key)"
									@activateField="activateField"
									@setActiveField="setActiveField"
									@saveField="saveField"
									@clearActiveField="clearActiveField"
								/>
							</v-col>
							<v-col cols="12" sm="8" md="5">
								<ToggleEditTextField
									:subObject="'profile'"
									:activeField="activeField"
									:field="'lastName'"
									:label="'Last Name'"
									:currentValue="user.profile.lastName"
									:fieldLoading="fieldLoading.find((f) => f.name === key)"
									@activateField="activateField"
									@setActiveField="setActiveField"
									@saveField="saveField"
									@clearActiveField="clearActiveField"
								/>
							</v-col>
						</v-row>
						<!--
						<v-row>
							<v-col
								v-for="([key, val], i) of contactFields"
								:key="i"
								cols="12"
								sm="8"
								md="6"
							>
								<EditList
									v-if="!Array.isArray(val)"
									:subObject="'contact'"
									:activeField="activeField"
									:field="key"
									:currentValue="val"
									@activateField="activateField"
									@setActiveField="setActiveField"
									@saveField="saveField"
									@clearActiveField="clearActiveField"
								/>
							</v-col>
						</v-row>
						-->
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
import ToggleEditTextField from "@/app/components/ToggleEditTextField.vue";
export default {
	name: "EditProfilePage",
	components: {
		NotLoggedInView,
		ToggleEditTextField
	},
	data() {
		return {
			activeField: "",
			editUser: {},
			fieldLoading: []
		};
	},
	created() {
		this.editUser = this.setup(this.user);
	},
	watch: {
		user(newV, oldV) {
			if (!this.isEqual(newV, oldV)) this.setup(newV);
			console.log(Array.isArray(this.contactFields.phone));
		}
	},
	computed: {
		isLoggedIn() {
			return this.$store.getters["auth/isLoggedIn"];
		},
		user() {
			return this.$store.getters["user/user"];
		},
		userFields() {
			return Object.entries(this.user).filter(
				([key, val]) => key !== "id" && !this.isObject(val)
			);
		},
		profileFields() {
			return Object.entries(this.user.profile).filter(
				([key, val]) => key !== "_id" && !this.isObject(val)
			);
		},
		contactFields() {
			return Object.entries(this.user.contactInfo).filter(
				([key, val]) => key !== "_id" && !this.isObject(val)
			);
		}
	},
	methods: {
		setup(obj) {
			this.editUser = this.cloneDeep(obj);
			this.fieldLoading = [];
		},
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
		saveField(field, value) {
			this.fieldLoading[Array.isArray(field) ? field[1] : field] = true;
			this.$store
				.dispatch({
					type: "user/updateMyUserField",
					field,
					value
				})
				.then((success) => {
					this.fieldLoading[Array.isArray(field) ? field[1] : field] = false;
					if (success) {
						this.clearActiveField();
					}
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
