const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { insertAsset } = require('../db/query.js')
const { verifyToken } = require('../middlewares/auth.js')
const router = express.Router()

router.post('/insert', verifyToken, (req, res) => {
    const data = req.body
    const assetId = uuidv4()

    insertAsset(data.email, data.asset_type, data.asset_name, data.asset_count, data.bought_date, assetId).then(result => {
        if(result){
            res.json({
                message: `${data.asset_count} ${data.asset_type} ${data.asset_name} bought ${data.bought_date} has been added to ${data.email}`,
                asset_count: data.asset_count,
                asset_type: data.asset_type,
                asset_name: data.asset_name,
                bought_date: data.bought_date,
                email: data.email
            })
        }
    }).catch(err =>{
        res.status(500).send(err)
    })
})

module.exports = router