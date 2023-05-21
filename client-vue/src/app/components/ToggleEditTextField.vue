<template>
	<v-text-field
		outlined
		dense
		:readonly="!fieldActive(field)"
		:class="fieldActive(field) ? 'field-active' : ''"
		v-model="editValue"
		:label="!isEmpty(label) ? label : ucFirst(field)"
		@click="activateField(field)"
		:placeholder="currentValue"
	>
		<template v-slot:append>
			<div v-if="fieldActive(field)" class="d-inline-flex justify-end">
				<v-btn
					icon
					class="mt-2 d-inline-flex"
					@click="saveField(field, editValue)"
				>
					<v-icon color="success">mdi-content-save</v-icon>
				</v-btn>
				<v-btn icon class="mt-2 d-inline-flex" @click="clearActiveField()">
					<v-icon color="error">mdi-cancel</v-icon>
				</v-btn>
			</div>
			<div v-else-if="fieldLoading">
				<v-progress-circular indeterminate class="mt-2"></v-progress-circular>
			</div>
			<div v-else class="d-flex justify-end">
				<v-btn icon class="mt-2" @click="setActiveField(field)">
					<v-icon>mdi-pencil</v-icon>
				</v-btn>
			</div>
		</template>
	</v-text-field>
</template>
<script>
export default {
	name: "ToggleEditTextField",
	props: [
		"subObject",
		"activeField",
		"label",
		"field",
		"currentValue",
		"fieldLoading"
	],
	data() {
		return {
			editValue: ""
		};
	},
	created() {
		this.editValue = this.currentValue.slice();
	},
	watch: {
		currentValue(newV, oldV) {
			if (newV !== oldV) this.editValue = newV;
		}
	},
	methods: {
		fieldActive(field) {
			return field === this.activeField;
		},
		activateField(field) {
			if (!this.fieldActive(field)) {
				this.$emit("activateField", field);
			}
		},
		setActiveField(field) {
			this.$emit("setActiveField", field);
		},
		clearActiveField() {
			this.$emit("clearActiveField");
		},
		saveField(field, value) {
			if (!this.isEmpty(this.subObject)) field = [this.subObject, field];
			this.$emit("saveField", field, value);
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
