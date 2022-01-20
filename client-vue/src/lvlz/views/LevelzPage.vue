<!--
https://stackoverflow.com/questions/65921975/remove-the-clicking-effect-from-a-vuetifys-v-card-when-it-has-a-link-associated
https://stackoverflow.com/questions/56473731/how-to-focus-v-textarea-programatically-in-vuetify-and-typescript
-->
<template>
	<v-container>
		<v-row>
			<v-col cols="6">
				<v-btn icon @click="activateField('newItem')">
					<v-icon>mdi-plus</v-icon>
				</v-btn>
				<div style="border: 0.1em solid #aaa; border-radius: 0.25em">
					<v-list>
						<v-list-item-group v-model="selectedItem">
							<v-list-item
								v-if="fieldActive('newItem')"
								class="elevation-2 input-list-item"
								style="margin: 0.25em; padding: 0.5em"
								:ripple="false"
							>
								<v-text-field
									ref="newItemInput"
									outlined
									dense
									placeholder="New Item"
									@blur="clearActiveField"
								></v-text-field>
							</v-list-item>
							<v-list-item
								v-if="listItems.length === 0"
								class="elevation-2 empty-list-item"
								style="margin: 0.25em; padding: 0.5em"
								@click="activateField('newItem')"
								two-line
							>
								<v-list-item-content>
									<v-list-item-title>No items</v-list-item-title>
									<v-list-item-subtitle>
										Click the
										<span>
											<v-icon aria-hidden="false" class="ma-0 pa">
												mdi-plus
											</v-icon>
										</span>
										button to add a new one.
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-list-item v-for="(item, i) of listItems" :key="i">
								<v-card>
									{{ item }}
								</v-card>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
export default {
	name: "LevelzPage",
	data() {
		return {
			activeField: "",
			newItem: "",
			listItems: [],
			selectedItem: undefined
		};
	},
	watch: {
		selectedItem() {
			this.selectedItem = undefined;
		}
	},
	methods: {
		fieldActive(field) {
			return field === this.activeField;
		},
		activateField(field) {
			if (!this.fieldActive(field)) {
				this.activeField = field;
				this.$nextTick(() => {
					if (field === "newItem") this.$refs.newItemInput.$refs.input.focus();
				});
			}
		},
		setActiveField(field) {
			this.activeField = field;
		},
		clearActiveField() {
			this.activeField = "";
		}
	}
};
</script>
<style>
/* remove grey background from input-list-item when clicked */
.empty-list-item.v-list-item--link:before,
.input-list-item.v-list-item--link:before {
	background: none;
}
</style>
