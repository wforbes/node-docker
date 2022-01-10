<template>
	<v-container>
		<v-row class="text-center">
			<v-col cols="12">
				<v-row class="text-center">
					<v-col class="mt-5 mb-4">
						<h1 class="display-2 font-weight-bold mb-5">node-docker</h1>
						<p class="subheading font-weight-regular">
							Sample web application using Docker
							<br />Node.js, Express.js, MongoDB, and Redis on the back-end
							<br />Vue.js and Vuetify.js on the front-end
						</p>
						<p class="subheading font-weight-bold">
							<a href="https://github.com/wforbes/node-docker" target="_blank">
								Source code on Github.com
							</a>
						</p>
					</v-col>
				</v-row>
				<v-row class="justify-center">
					<v-col v-for="(item, i) of tech_items" :key="i" cols="2" sm="1">
						<a :href="item.href" target="_blank">
							<v-img
								:alt="item.alt"
								class="shrink mr-2 tech-logo"
								contain
								:src="item.srcReq"
								transition="scale-transition"
								:width="item.width"
							/>
						</a>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<v-row class="text-center">
			<v-col class="mb-5" cols="12">
				<h2 class="headline font-weight-bold mb-3">What's it do?</h2>

				<v-row justify="center">
					<a
						v-for="(item, i) in whatsItDo"
						:key="i"
						:href="item.href"
						class="subheading mx-3"
					>
						{{ item.text }}
					</a>
				</v-row>
			</v-col>

			<v-col class="mb-5" cols="12">
				<h2 class="headline font-weight-bold mb-3">Important Links</h2>

				<v-row justify="center">
					<a
						v-for="(link, i) in importantLinks"
						:key="i"
						:href="link.href"
						class="subheading mx-3"
						target="_blank"
					>
						{{ link.text }}
					</a>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "HelloWorld",

	data: () => ({
		tech_items: [
			{
				href: "https://vuejs.org/",
				alt: "Vue Logo",
				srcReq: require("@/assets/vue-logo.png"),
				width: "40"
			},
			{
				href: "https://vuetifyjs.com/",
				alt: "Vuetify Logo",
				srcReq: require("@/assets/vuetify-logo.svg"),
				width: "40"
			},
			{
				href: "https://nodejs.org/",
				alt: "Nodejs Logo",
				srcReq: require("@/assets/nodejs-icon.svg"),
				width: "60"
			},
			{
				href: "https://expressjs.com/",
				alt: "Expressjs Logo",
				srcReq: require("@/assets/expressjs-icon.svg"),
				width: "60"
			},
			{
				href: "https://mongodb.com/",
				alt: "Mongo Logo",
				srcReq: require("@/assets/mongodb-icon.svg"),
				width: "60"
			},
			{
				href: "https://redis.io/",
				alt: "Redis Logo",
				srcReq: require("@/assets/redis-icon.svg"),
				width: "60"
			}
		],
		whatsItDo: [
			{
				href: "/auth-module-info",
				text: "Account System"
			},
			{
				href: "/blog-module-info",
				text: "Blog System"
			},
			{
				href: "/kanban-module-info",
				text: "Kanban Board"
			},
			{
				href: "/chat-module-info",
				text: "Instant Message Chat System"
			}
		],
		importantLinks: [
			{
				href: "https://www.freecodecamp.org/news/learn-docker-by-building-a-node-express-app/",
				text: "'Learn Docker by Building a Node / Express App' by Sanjeev Thiyagarjan"
			},
			{
				href: "https://www.youtube.com/channel/UC2sYgV-NV6S5_-pqLGChoNQ",
				text: "Sanjeev Thiyagarajan's YouTube Channel"
			}
		]
	})
};
</script>
<style>
.tech-logo {
	display: inline-block;
}
</style>
