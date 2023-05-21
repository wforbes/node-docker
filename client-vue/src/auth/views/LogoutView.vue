<template>
	<v-container>
		<v-row>
			<v-col>
				<v-row>
					<v-col>
						<h1>Bye!</h1>
						<br />
						<h4>You are now logged out.</h4>
						<br />
						<p>Thanks for using Node-Docker, have a great day.</p>
					</v-col>
				</v-row>
				<v-row>
					<v-col align="center">
						<v-btn to="/">Return to the Home page</v-btn>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "LogoutView",
	data() {
		return {};
	}
};
</script>
