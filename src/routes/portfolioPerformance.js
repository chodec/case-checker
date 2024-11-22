const express = require('express')
const fs = require('fs')
const path = require('path')
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

const initialPrice = (assetName, boughtDate) => {
  const itemHistory = loadJson(assetName + '.json')
  const formatedDate = formatDate(boughtDate)
  let tmp = itemHistory.prices[0][0]
  const firstDate = new Date(tmp)
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

router.post('/portfolioPerformance', verifyToken, async (req, res) => {
  const { email } = req.body
  let result = 0
  try {
    const assets = await getUserAssets(email)
    if (!assets || assets.length === 0) {
      return res.status(404).json({ error: 'No assets found for the user' })
    }
    else {
      for (let i = 0; i < assets.length; i++) {
        result += initialPrice(assets[i].asset_name, assets[i].bought_date)
      }
      res.send({result: Math.round(result * 100) / 100})
    }
  } catch (error) {
   
  }
})

module.exports = router
