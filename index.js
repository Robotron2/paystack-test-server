require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()
app.use(
	cors({
		origin: process.env.CLIENT,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
)

const port = process.env.PORT || 4000

const axios = require("axios")

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Server running properly",
	})
})

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
		return res.json({
			success: false,
			error: error.response ? error.response.data : error.message,
		})
	}
}

const verifyTransaction = async (reference) => {
	const url = `https://api.paystack.co/transaction/verify/${reference}`
	const secretKey = process.env.TEST_SECRET

	try {
		const response = await axios.get(url, params, {
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
	try {
		if (!amount || !email) throw Error("Details need to be provided")
		const response = await initializeTransaction(email, parseInt(amount))
		if (response.status !== true) {
			console.log(response)
			throw Error("Transaction not initialized.")
		}
		console.group
		console.log(`Response from the /paystack route:`)
		console.log(response)
		console.groupEnd
		const authUrl = response.data.authorization_url

		return res.json({
			success: true,
			authUrl,
		})
	} catch (error) {
		console.error(error.message)
		return res.json({
			success: false,
			error: error.response ? error.response.data : error.message,
		})
	}
})

app.get("/paystack/verify", async (req, res) => {
	const { ref } = req.query
	try {
		const response = await verifyTransaction(ref)
		console.log(response)
		// if (response.status !== true) {
		// 	console.log(response)
		// 	throw Error("Transaction not verified.")
		// }
		// const authUrl = response.data.authorization_url
		// console.log("Done")
		// return res.json({
		// 	success: true,
		// 	authUrl,
		// })
	} catch (error) {
		console.error(error.message)
	}
})

app.listen(port, () => {
	console.log("App is listening on port " + port)
})
