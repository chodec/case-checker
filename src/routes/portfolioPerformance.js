const express = require('express')
const axios = require('axios')
const { getUserAssets } = require('../db/query.js')
const router = express.Router()

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

async function fetchPriceHistoryWithRetry(assetName, retries = 3) {
  const priceHistoryUrl = `https://steamcommunity.com/market/pricehistory/?country=CZ&currency=3&appid=730&market_hash_name=${assetName}`
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(priceHistoryUrl)
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`Rate limited for ${assetName}. Retrying after 1 second...`)
        await delay(1000)
      } else {
        console.error(`Error fetching price history for ${assetName}:`, error)
        return null
      }
    }
  }
  console.error(`Failed to fetch price history for ${assetName} after ${retries} retries`)
  return null
}

async function fetchCurrentPrice(assetName) {
  const priceOverviewUrl = `https://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=${assetName}`
  try {
    const response = await axios.get(priceOverviewUrl)
    const priceText = response.data.lowest_price
    return priceText ? parseFloat(priceText.replace(/[^\d.-]/g, '')) : null
  } catch (error) {
    console.error(`Error fetching current price for ${assetName}:`, error)
    return null
  }
}

async function calculatePortfolioPerformance(assets) {
  let totalPerformance = 0
  for (const asset of assets) {
    const assetName = decodeURIComponent(asset.asset_name)
    const priceHistory = await fetchPriceHistoryWithRetry(assetName)
    if (!priceHistory || !priceHistory.prices) {
      console.log(`No price history data for ${assetName}`)
      continue
    }
    const formattedDate = formatDate(asset.bought_date)
    const priceEntry = priceHistory.prices.find(entry => entry[0].includes(formattedDate))
    if (!priceEntry) {
      console.log(`No matching date found in price history for ${assetName} on ${formattedDate}`)
      continue
    }
    const boughtPrice = parseFloat(priceEntry[1])
    const currentPrice = await fetchCurrentPrice(assetName)
    if (currentPrice === null) {
      console.log(`No current price data for ${assetName}`)
      continue
    }
    const performance = currentPrice - boughtPrice
    totalPerformance += performance
    console.log(`Performance for ${assetName}: ${performance}`)
    await delay(500)
  }
  return totalPerformance
}

router.post('/asset/portfolioPerformance', async (req, res) => {
  const { email } = req.body
  try {
    const assets = await getUserAssets(email)
    if (!assets || assets.length === 0) {
      return res.status(404).json({ error: 'No assets found for the user' })
    }
    const totalPerformance = await calculatePortfolioPerformance(assets)
    res.json({ totalPerformance })
  } catch (error) {
    console.error('Error calculating portfolio performance:', error)
    res.status(500).json({ error: 'An error occurred while calculating portfolio performance' })
  }
})

module.exports = router
