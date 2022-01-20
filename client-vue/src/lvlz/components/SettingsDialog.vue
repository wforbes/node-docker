<template>
	<v-dialog
		transition="dialog-bottom-transition"
		max-width="600"
		v-model="dialogOpen"
		persistent
	>
		<v-card>
			<v-toolbar color="primary" dark>Settings</v-toolbar>
			<v-card-text class="mt-5">
				<div class="text-h4">Activity Categories</div>
				<v-list>
					<v-list-item v-for="(category, i) of categoryList" :key="i">
						{{ category.name }}
					</v-list-item>
				</v-list>
			</v-card-text>
			<v-card-actions class="justify-end">
				<v-btn text @click="closeDialog">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	name: "SettingsDialog",
	props: ["dialogOpen"],
	data() {
		return {};
	},
	computed: {
		categoryList() {
			return [...this.$store.getters["lvlz/categoryList"]];
		}
	},
	methods: {
		closeDialog() {
			this.$emit("closeDialog");
		}
	}
};
</script>
