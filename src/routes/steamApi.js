const express = require('express')
const { verifyToken } = require('../middlewares/auth.js')
require('dotenv').config()

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

        const response = await fetch(steamApiUrl, {
            method: 'GET',
            headers: {
                Cookie: `steamLoginSecure=${steamLoginSecure}`
            }
        })

        if (response.ok) {
            const data = await response.json()
            if (data.success) {
                return res.status(200).json(data)
            }
            return res.status(500).json({
                error: 'Steam API returned success=false',
                details: data
            })
        }

        return res.status(response.status).json({
            error: `Steam API returned an error: ${response.statusText}`,
            status: response.status
        })
    } catch (error) {
        console.error('Error with fetch request:', error.message)
        return res.status(500).json({
            error: 'Error fetching data from Steam API',
            message: error.message
        })
    }
})

module.exports = router
