<!--
https://stackoverflow.com/questions/65921975/remove-the-clicking-effect-from-a-vuetifys-v-card-when-it-has-a-link-associated
https://stackoverflow.com/questions/56473731/how-to-focus-v-textarea-programatically-in-vuetify-and-typescript
-->
<template>
	<div>
		<v-container>
			<v-row>
				<v-col cols="6">
					<v-row>
						<v-col>
							<v-btn icon @click="activateField('newActivity')">
								<v-icon x-large color="success">mdi-plus-circle</v-icon>
							</v-btn>
						</v-col>
						<v-col class="d-flex justify-end">
							<v-btn icon @click="openSettingsDialog()">
								<v-icon x-large>mdi-cog</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
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
												<v-list-item-subtitle>
													{{
														isEmpty(activity.category)
															? "(No category)"
															: activity.category.name
													}}
												</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-list-item-group>
								</v-list>
							</div>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="6">
					<v-card class="pa-2">
						<div v-if="isEmpty(focusActivity)">
							<h1>No Activities</h1>
							<p>
								Begin by adding new activity to your list with the
								<span><v-icon>mdi-plus</v-icon></span> button!
							</p>
						</div>
						<div v-else>
							<h1>{{ focusActivity.name }}</h1>
						</div>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<settings-dialog
			:dialogOpen="settingsDialogOpen"
			@closeDialog="closeSettingsDialog"
		></settings-dialog>
	</div>
</template>
<script>
import SettingsDialog from "@/lvlz/components/SettingsDialog.vue";
export default {
	name: "LevelzPage",
	components: {
		SettingsDialog
	},
	data() {
		return {
			activeField: "",
			emptyActivity: {
				name: "",
				category: {}
			},
			newActivity: {},
			activityList: [],
			selectedActivity: undefined,
			focusActivity: {},
			settingsDialogOpen: false
		};
	},
	created() {
		this.$store.dispatch({
			type: "lvlz/setCategoryList",
			categoryList: [
				{
					name: "Chores"
				},
				{
					name: "Schoolwork"
				},
				{
					name: "Dayjob"
				},
				{
					name: "Skateboarding"
				},
				{
					name: "Software Development"
				}
			]
		});
	},
	watch: {
		selectedActivity(newV) {
			if (newV === undefined) this.focusActivity = {};

			this.focusActivity = this.cloneDeep(this.activityList[newV]);
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
					if (field === "newActivity") {
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
		},
		openSettingsDialog() {
			this.settingsDialogOpen = true;
		},
		closeSettingsDialog() {
			this.settingsDialogOpen = false;
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
