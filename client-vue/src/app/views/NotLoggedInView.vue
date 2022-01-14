<template>
	<div>
		<v-card class="pa-3">
			<h2>You aren't logged in!</h2>
			<br />
			<p>
				Sorry, either your login session has expired or you haven't logged in
				yet.
			</p>
			<v-container>
				<v-row>
					<v-col sm="6" cols="12" align="center">
						<v-btn x-large to="/"
							><v-icon medium>mdi-home</v-icon> Go Back Home
						</v-btn>
					</v-col>
					<v-col sm="6" cols="12" align="center">
						<v-btn x-large @click="openAuthPage"
							><v-icon medium>mdi-key</v-icon>Signup or Login</v-btn
						>
					</v-col>
				</v-row>
			</v-container>
		</v-card>
	</div>
</template>
<script>
export default {
	name: "NotLoggedInView",
	data() {
		return {};
	},
	methods: {
		openAuthPage() {
			this.$router.push("auth");
		}
	}
};
</script>
