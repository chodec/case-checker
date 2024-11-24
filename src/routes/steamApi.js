const express = require('express')
const axios = require('axios')
const { verifyToken } = require('../middlewares/auth.js')
require('dotenv').config() // Load environment variables

const router = express.Router()

router.post('/currentprice/case/:filename', verifyToken, async (req, res) => {
    try {
        const { filename } = req.params

        if (!filename || typeof filename !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing filename parameter' })
        }

        const steamLoginSecure = process.env.STEAM_LOGIN_SECURE
        if (!steamLoginSecure) {
            return res.status(500).json({ error: 'Missing STEAM_LOGIN_SECURE environment variable' })
        }

        const encodedFileName = encodeURIComponent(filename)

        const steamApiUrl = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${encodedFileName}&currency=1`

        const response = await axios.get(steamApiUrl, {
            headers: {
                Cookie: `steamLoginSecure=${steamLoginSecure}`
            }
        })

        if (response.status === 200 && response.data.success) {
            return res.status(200).json(response.data)
        } else {
            return res.status(500).json({
                error: 'Error fetching current price data from Steam API',
                details: response.data,
            })
        }
    } catch (error) {
        console.error('Error with axios request:', error.message)

        return res.status(500).json({
            error: 'Error fetching data from Steam API',
            message: error.message,
            ...(error.response && { steamError: error.response.data }), 
        })
    }
})

module.exports = router
