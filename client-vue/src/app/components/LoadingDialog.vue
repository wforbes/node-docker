<template>
	<v-dialog v-model="showLoading" height="180px" width="42%">
		<v-card style="padding: 3em" class="text-xs-center elevation-3">
			<v-row>
				<v-col cols="12" class="justify-center">
					<v-progress-circular indeterminate color="primary" :size="50" />
				</v-col>
				<v-col cols="12">
					<span class="headline font-weight-light">
						{{ loadingTitle }}
					</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<div>
						<p v-html="loadingStatus"></p>
					</div>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<div
						v-if="!isEmpty(loadingMessage)"
						id="message-container"
						style="max-height: 150px; overflow-y: scroll"
					>
						<p id="message-content" v-html="loadingMessage"></p>
					</div>
				</v-col>
			</v-row>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	name: "LoadingDialog",
	props: ["showLoading", "loadingTitle", "loadingStatus", "loadingMessage"],
	data() {
		return {};
	},
	watch: {
		/*
		loadingMessage(newV, oldV) {
			if (newV && !oldV) {
				const content = document.getElementById("message-content");
				const container = document.getElementById("message-container");
				container.scrollTop = Math.floor(content.offsetHeight);
			}
		}*/
	}
};
</script>
