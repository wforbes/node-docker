const express = require('express')
const app = express()

app.get('/', (req, res) => {
	res.send("<h2>Simple API to learn docker with node/express.</h2><p>Bind mount is working.</p>")
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))