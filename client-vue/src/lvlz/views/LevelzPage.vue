<!--
https://stackoverflow.com/questions/65921975/remove-the-clicking-effect-from-a-vuetifys-v-card-when-it-has-a-link-associated
https://stackoverflow.com/questions/56473731/how-to-focus-v-textarea-programatically-in-vuetify-and-typescript
-->
<template>
	<v-container>
		<v-row>
			<v-col cols="6">
				<v-btn icon @click="activateField('newActivity')">
					<v-icon>mdi-plus</v-icon>
				</v-btn>
				<div style="border: 0.1em solid #aaa; border-radius: 0.25em">
					<v-list>
						<v-list-item-group v-model="selectedActivity">
							<v-list-item
								v-if="fieldActive('newActivity')"
								class="pa-3 elevation-2 new-activity-list-item"
								style="margin: 0.25em"
								:ripple="false"
							>
								<v-text-field
									v-model="newActivity.name"
									ref="newActivityInput"
									outlined
									dense
									placeholder="New Activity"
									@keyup.enter="addActivity"
									@blur="clearActiveField"
								></v-text-field>
							</v-list-item>
							<v-list-item
								v-if="activityList.length === 0"
								class="pa-3 elevation-2 empty-activity-list-item"
								style="margin: 0.25em"
								@click="activateField('newActivity')"
								two-line
							>
								<v-list-item-content>
									<v-list-item-title>No Activities</v-list-item-title>
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
							<v-list-item
								v-for="(activity, i) of activityList"
								:key="i"
								style="margin: 0.25em"
								class="pa-3 elevation-2"
							>
								<v-list-item-content>
									<v-list-item-title>
										{{ activity.name }}
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</div>
			</v-col>
			<v-col cols="6">
				<v-card class="pa-2">
					<h1>No Activities</h1>
					<p>
						Begin by adding new activity to your list with the
						<span><v-icon>mdi-plus</v-icon></span> button!
					</p>
				</v-card>
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
			emptyActivity: {
				name: ""
			},
			newActivity: {},
			activityList: [],
			selectedActivity: undefined
		};
	},
	methods: {
		fieldActive(field) {
			return field === this.activeField;
		},
		activateField(field) {
			if (!this.fieldActive(field)) {
				this.activeField = field;
				this.$nextTick(() => {
					if (field === "newItem") {
						this.newActivity = this.cloneDeep(this.emptyActivity);
						this.$refs.newActivityInput.$refs.input.focus();
					}
				});
			}
		},
		setActiveField(field) {
			this.activeField = field;
		},
		clearActiveField() {
			this.activeField = "";
		},
		addActivity(event) {
			event.preventDefault();
			this.activityList.unshift(this.cloneDeep(this.newActivity));
			this.newActivity = this.cloneDeep(this.emptyActivity);
			this.clearActiveField();
		}
	}
};
</script>
<style>
/* remove grey background from input-list-item when clicked */
.empty-activity-list-item.v-list-item--link:before,
.activity-list-item.v-list-item--link:before {
	background: none;
}
</style>
