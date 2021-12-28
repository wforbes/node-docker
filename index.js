const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect("mongodb://wforbes:thepassword@mongo:27017/mydb?authSource=admin")
	.then(() => console.log("successfully connected to DB!")).catch((e) => console.log(e));


app.get('/', (req, res) => {
	res.send("<h2>Simple API to learn docker with node/express.</h2><p>Testing prod!</p>")
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))