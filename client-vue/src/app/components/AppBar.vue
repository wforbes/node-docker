<template>
	<div>
		<v-app-bar app color="primary" dark>
			<nav-menu :navMenuIsOpen="navMenuIsOpen" @closeNavMenu="closeNavMenu" />
			<v-app-bar-nav-icon
				style="display: inline"
				@click.stop="navMenuIsOpen = !navMenuIsOpen"
			></v-app-bar-nav-icon>
			<div class="d-flex align-center pt-2">
				<router-link class="text-h4 white--text norm-link" :to="'/'">
					<v-img
						alt="Node-Docker icon"
						class="shrink mr-2 tech-logo"
						contain
						:src="require('@/assets/nd-icon.png')"
						transition="scale-transition"
						width="45"
					/>
				</router-link>
			</div>

			<v-spacer></v-spacer>
			<v-btn
				v-if="$store.getters['auth/isLoggedIn']"
				@click="openUserDialog()"
				icon
			>
				<v-icon>mdi-account</v-icon>
			</v-btn>
			<div v-else>
				<v-btn @click="openAuthPage('signup')" text>Signup</v-btn>
				<v-btn @click="openAuthPage('login')" text>Login</v-btn>
			</div>
			<v-btn href="https://wforbes.net/" target="_blank" text>
				<span class="mr-2">Author's Site</span>
				<v-icon>mdi-open-in-new</v-icon>
			</v-btn>
		</v-app-bar>
		<UserDialog :dialogOpen="userDialogIsOpen" @closeDialog="closeUserDialog" />
	</div>
</template>

<script>
import NavMenu from "@/app/components/NavMenu.vue";
import UserDialog from "@/app/components/UserDialog.vue";
export default {
	name: "AppBar",
	components: {
		NavMenu,
		UserDialog
	},
	data() {
		return {
			navMenuIsOpen: null,
			userDialogIsOpen: false
		};
	},
	methods: {
		closeNavMenu() {
			this.navMenuIsOpen = false;
		},
		openAuthPage(form) {
			if (this.$router.currentRoute.path !== `/${form}`)
				this.$router.push(`/${form}`);
		},
		openUserDialog() {
			this.userDialogIsOpen = true;
		},
		closeUserDialog() {
			this.userDialogIsOpen = false;
		}
	}
};
</script>
