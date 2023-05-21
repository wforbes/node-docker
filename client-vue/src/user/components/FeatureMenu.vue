<template>
	<v-container>
		<v-row>
			<v-col
				class="pa-1"
				cols="3"
				v-for="(item, i) in featureMenuItems"
				:key="i"
			>
				<v-card
					ripple
					rounded="xl"
					width="100%"
					class="pa-0 ma-0 elevation-5"
					color="primary"
					:disabled="!item.active"
					@click="navigateTo(item.pathName)"
				>
					<div
						style="
							padding-top: 0.5em;
							padding-bottom: 0.5em;
							border-radius: 1em;
						"
					>
						<v-container class="ma-0 pa-0">
							<v-row class="ma-0 pa-0">
								<v-col cols="12" class="ma-0 pa-0" align="center">
									<v-icon size="72" color="white">
										{{ item.icon }}
									</v-icon>
								</v-col>
								<v-col cols="12" class="ma-0 pa-0" align="center">
									<span style="color: white" class="text-subtitle-1">
										{{ item.text }}
									</span>
								</v-col>
							</v-row>
						</v-container>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
export default {
	name: "FeatureMenu",
	data() {
		return {
			featureMenuItems: [
				{
					icon: "mdi-card-account-phone",
					text: "Contacts",
					pathName: "contacts",
					active: false
				},
				{
					icon: "mdi-post-outline",
					text: "Blog",
					pathName: "blog",
					active: false
				},
				{
					icon: "mdi-cards-outline",
					text: "Kanban Board",
					pathName: "kanban-board",
					active: false
				},
				{
					icon: "mdi-chat-processing",
					text: "Messages",
					pathName: "messages",
					active: false
				}
			]
		};
	},
	methods: {
		navigateTo(path) {
			console.log(path);
		}
	}
};
</script>
