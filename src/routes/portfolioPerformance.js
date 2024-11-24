const express = require('express')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { getUserAssets } = require('../db/query.js')
const { verifyToken } = require('../middlewares/auth.js')
const router = express.Router()

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const loadJson = (relativePath) => {
  try {
    const filePath = path.join('', 'C:\\Users\\DomLe\\OneDrive\\Plocha\\case-checker\\src\\db\\json\\' + relativePath)
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading JSON:', error)
    return null
  }
}

const calculatedPrice = (assetName, boughtDate) => {
  const itemHistory = loadJson(assetName + '.json')
  const formatedDate = formatDate(boughtDate)
  const date = itemHistory.prices[0][0]
  const firstDate = new Date(date)
  const formattedBoughtDate = new Date(formatedDate)

  if (isNaN(firstDate.getTime()) || isNaN(formattedBoughtDate.getTime())) {
    console.error("Invalid date format in input or JSON")
    return null
  }

  const msPerDay = 24 * 60 * 60 * 1000 
  const daysDifference = Math.floor((formattedBoughtDate - firstDate) / msPerDay)

  if (daysDifference < 0 || daysDifference >= itemHistory.prices.length) {
    console.error("The bought date is out of range for the item's history")
    return null
  }
  const priceAtBoughtDate = itemHistory.prices[daysDifference][1]
  
  return priceAtBoughtDate
}

const parseIntInitialPrice = (caseJson) => {
  const casePrice = caseJson.lowest_price
  let removeCasePriceChar = parseFloat(casePrice.replace('$', ''))
  return removeCasePriceChar
}

const fetchSteamPrice = async (caseName) => {
  try {
      if (!caseName || typeof caseName !== 'string') {
          throw new Error('Invalid or missing case name')
      }

      const steamLoginSecure = process.env.STEAM_LOGIN_SECURE
      if (!steamLoginSecure) {
          throw new Error('Missing STEAM_LOGIN_SECURE environment variable')
      }

      const decodedCaseName = decodeURIComponent(caseName)
      const encodedFileName = encodeURIComponent(decodedCaseName)

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
              return data
          }

          throw new Error('Steam API returned success=false')
      }

      throw new Error(`Steam API error: ${response.status} ${response.statusText}`)
  } catch (error) {
      console.error('Error fetching Steam price:', error.message)
      return null
  }
}

router.post('/portfolioPerformance', verifyToken, async (req, res) => {
  const { email } = req.body
  let resultVal = 0
  const batchSize = 10

  try {
      const fetchAllAssets = async (email) => {
          let allAssets = []
          let offset = 0
          let hasMore = true

          while (hasMore) {
              const assetsBatch = await getUserAssets(email, batchSize, offset)
              if (assetsBatch && assetsBatch.length > 0) {
                  allAssets = allAssets.concat(assetsBatch)
                  offset += batchSize
              } else {
                  hasMore = false
              }
          }
          return allAssets
      }

      const assets = await fetchAllAssets(email)

      if (!assets || assets.length === 0) {
          return res.status(404).json({ error: 'No assets found for the user' })
      }
      for (let i = 0; i < assets.length; i++) {
          const initialPrice = await fetchSteamPrice(assets[i].asset_name)
          const initialPriceEdit = parseIntInitialPrice(initialPrice)
          if (initialPrice === null) {
              console.error(`Failed to fetch price for asset: ${assets[i].asset_name}`)
              continue
          }
          const calculatedInitialPriceValue = initialPriceEdit * assets[i].asset_count
          const calculatedPriceValue = calculatedPrice(assets[i].asset_name, assets[i].bought_date) * assets[i].asset_count
         resultVal += calculatedInitialPriceValue - calculatedPriceValue
      }

      res.send({ resultVal: Math.round(resultVal * 100) / 100 })
  } catch (error) {
      console.error('Error calculating portfolio performance:', error.message)
      res.status(500).json({ error: 'Error calculating portfolio performance' })
  }
})

module.exports = router