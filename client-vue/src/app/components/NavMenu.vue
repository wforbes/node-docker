<template>
	<v-navigation-drawer
		v-model="isOpen"
		app
		:clipped-left="true"
		hide-overlay
		temporary
		dark
	>
		<v-list dense>
			<v-list-item class="white--text norm-link">
				<v-list-item-action style="display: inline-block">
					<img
						:src="require('@/assets/nd-icon.png')"
						height="35"
						alt="node-docker icon"
					/>
				</v-list-item-action>
				<v-list-item-content style="display: inline-block">
					<v-list-item-title>node-docker</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
			<v-list-item
				v-for="item in navItems"
				:key="item.id"
				:to="item.path"
				v-show="item.visible"
				link
				ripple
			>
				<v-tooltip right>
					<template v-slot:activator="{ on }">
						<v-list-item-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-item-action>
						<v-list-item-content v-on="on">
							<v-list-item-title>{{ item.name }}</v-list-item-title>
						</v-list-item-content>
					</template>
					<span>{{ item.tooltip }}</span>
				</v-tooltip>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>
<script>
export default {
	name: "NavMenu",
	props: ["navMenuIsOpen"],
	data() {
		return {
			navItems: [
				{
					id: 0,
					route: { name: "About" },
					name: "About",
					path: "/about",
					icon: "mdi-information",
					tooltip: "View info about the app",
					selected: "",
					visible: true
				}
			]
		};
	},
	computed: {
		isOpen: {
			get: function () {
				return this.navMenuIsOpen;
			},
			set: function (newValue) {
				if (!newValue) {
					this.$emit("closeNavMenu", newValue);
				}
			}
		}
	},
	watch: {
		isOpen(newVal, oldVal) {
			if (!newVal && oldVal) {
				this.$emit("closeNavMenu");
			}
			if (newVal && !oldVal && this.setupDone) {
				//this.checkPermissions();
			}
		}
	}
};
</script>
