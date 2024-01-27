require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())

const port = process.env.PORT || 4000

const axios = require("axios")

const initializeTransaction = async (email, amount) => {
	const url = "https://api.paystack.co/transaction/initialize"
	const secretKey = process.env.TEST_SECRET
	const params = { email, amount }

	try {
		const response = await axios.post(url, params, {
			headers: {
				Authorization: `Bearer ${secretKey}`,
				"Content-Type": "application/json",
			},
		})
		return response.data
	} catch (error) {
		console.error(error.response ? error.response.data : error.message)
	}
}

app.get("/paystack", async (req, res) => {
	const { amount, email } = req.query

	const response = await initializeTransaction(email, parseInt(amount))
	res.send(response)
})

app.listen(port, () => {
	console.log("App is listening on port " + port)
})
