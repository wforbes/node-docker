<template>
	<v-dialog v-model="moreInfoOpen" max-width="800" scrollable>
		<v-card class="">
			<v-toolbar dark dense flat>
				<v-card-title>Email and Data Statement</v-card-title>
				<v-spacer></v-spacer>
				<v-btn icon @click="closeMoreInfo">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>
			<v-card class="px-5" max-height="80vh" style="overflow-y: auto">
				<h3 class="mt-5">We don't spam. Period.</h3>
				<ul class="pb-3">
					<li>
						We won't send you emails you can't unsubscribe from or turn off.
					</li>
					<li>
						We won't send you emails from sources other than addresses at
						{placeholder}.com.
					</li>
					<li>
						We won't send you emails that you haven't specifically agreed to
						wanting to get.
					</li>
				</ul>
				<h3>We don't share your data with Third-Parties. Period.</h3>
				<p>
					We don't agree with sharing your data with any other entity outside of
					{placeholder.com}, in principle and practice.
				</p>

				<p>
					Not only do we value your privacy and security, but we also find it
					very important to keep you from experiencing the intrusive ads and
					solicitation that come from third-party data companies when they get
					ahold of your data and spread it around to all their friends.
				</p>
				<p>
					If we do ever need to share your data, you'll be the first to know. It
					will be because you specifically requested it, or within your full
					control to limit it!
				</p>
				<h4>Analytics and Usage Data</h4>
				<p>
					Although we do use your browsing data to make {placeholder.com} better
					when we can, and a part of that may involve using the Google Analytics
					service, we'll always do our best to keep whatever analytics data we
					have about you as private as possible.
				</p>
				<h4>Third-Party Login Services</h4>
				<p>
					Although we may offer log in services from companies like Google or
					Facebook to provide you the convience of logging in to
					{placeholder.com} using your accounts on those other platforms, we'll
					always do our best to limit our data sharing with those platforms so
					that we can conserve your privacy.
				</p>
				<h4>Goals For Offline Features</h4>
				<p>
					In our general development plan for {placeholder.com} we've outlined
					various ways that we can offer offline, private, non-connected,
					self-contained versions of our features so that you may use
					{placeholder.com} without even being connected to the internet, and
					thus not even sharing your data with us, unless you want to. We will
					continue to pursue paradigms like this because we support your desire
					to keep your data private.
				</p>
				<h4>We'll keep getting better at this.</h4>
				<p>
					This is a very young app and we're interested in finding new ways to
					improve this statement.<br />
					Email me with your thoughts at
					<a href="">{mail@placeholder.com}</a>.
				</p>
				<p>Thanks, Will</p>
			</v-card>
		</v-card>
	</v-dialog>
</template>
<style>
.v-dialog > .v-card > .v-toolbar {
	position: sticky;
	top: 0;
	z-index: 999;
}
</style>
<script>
export default {
	name: "DataStatementDialog",
	props: ["moreInfoOpen"],
	data() {
		return {};
	},
	methods: {
		closeMoreInfo() {
			this.$emit("closeMoreInfo");
		}
	}
};
</script>
