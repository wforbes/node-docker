const express = require('express')
const mongoose = require('mongoose')
const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mydb?authSource=admin`;
mongoose.connect(mongoURL)
	.then(() => console.log("successfully connected to DB!")).catch((e) => console.log(e));


app.get('/', (req, res) => {
	res.send("<h2>Simple API to learn docker with node/express.</h2><p>Testing prod!</p>")
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))