<template>
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
		<v-btn @click="openAuthPage()">Signup</v-btn>
		<v-btn href="https://wforbes.net/" target="_blank" text>
			<span class="mr-2">Author's Site</span>
			<v-icon>mdi-open-in-new</v-icon>
		</v-btn>
	</v-app-bar>
</template>

<script>
import NavMenu from "@/app/components/NavMenu.vue";
export default {
	name: "AppBar",
	components: {
		NavMenu
	},
	data() {
		return {
			navMenuIsOpen: null
		};
	},
	methods: {
		closeNavMenu() {
			this.navMenuIsOpen = false;
		},
		openAuthPage() {
			this.$router.push("signup");
		}
	}
};
</script>
