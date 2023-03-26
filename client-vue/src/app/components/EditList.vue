<template>
	<div>
		<v-text-field outlined></v-text-field>
		<div style="border: 0.1em solid #aaa; border-radius: 0.25em">
			<v-list>
				<v-list-item v-for="(item, i) of items" :key="i">
					{{ item }}
				</v-list-item>
			</v-list>
		</div>
	</div>
</template>
<script>
export default {
	name: "EditList",
	props: ["items"],
	data: () => ({
		listItems: [],
		newItem: ""
	})
};
</script>
