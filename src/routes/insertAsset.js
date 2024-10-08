const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { insertAsset } = require('../db/query.js')
const router = express.Router()

//Create asset and insert him into DB
router.post('/asset/insert', (req, res) => {
    const data = req.body
    const assetId = uuidv4()

    insertAsset(data.email, data.asset_type, data.asset_name, data.asset_count, data.bought_date, assetId).then(result => {
        if(result){
            res.send(`${data.asset_count} ${data.asset_type} ${data.asset_name} bought ${data.bought_date} has been added to the ${data.email}`)
        }
    }).catch(err =>{
        res.status(500).send(err)
    })
})

module.exports = router