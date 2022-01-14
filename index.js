const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
let RedisStore = require("connect-redis")(session);


const app = express();

const { 
	MONGO_USER,
	MONGO_PASSWORD,
	MONGO_IP,
	REDIS_URL,
	REDIS_PORT,
	SESSION_SECRET,
	MONGO_PORT
} = require("./config/config");

let redisClient = redis.createClient({
	host: REDIS_URL,
	port: REDIS_PORT
});


const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mydb?authSource=admin`;
const connectWithRetry = () => {
	mongoose.connect(mongoURL)
		.then(() => console.log("successfully connected to DB!"))
		.catch((e) => {
			console.log(e)
			setTimeout(connectWithRetry, 5000)
		});
};
connectWithRetry();

app.enable("trust proxy");
const whitelist = ["http://localhost", "http://localhost:8080"]
app.use(
	cors({ 
		origin: (origin, callback) => {
			if (whitelist.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed CORS origin"));
			}
		},
		credentials: true
	})
);
app.use(express.json());
app.use(session({
	store: new RedisStore({ client: redisClient }),
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: { // TODO: change these later
		secure: false,	
		httpOnly: true, //means that javascript on browser can't access
		maxAge: 60000 * 30 // 30 mins
	},
	rolling: true,
	resave: true
}))

app.get("/api/v1", (req, res) => {
	res.send("<h2>Starter API to learn docker with node/express, mongo, and redis.</h2><p>Check out the development notes at: <a href='https://github.com/wforbes/node-docker'>https://github.com/wforbes/node-docker</a></p>");
});
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));