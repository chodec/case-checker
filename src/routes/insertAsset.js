const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { insertAsset } = require('../db/query.js')
const router = express.Router()

//Create asset and insert him into DB
router.post('/asset/insert/:asset_type/:user_id/:asset_name/:asset_count/:bought_date', (req, res) => {
    const asset_type = req.params.asset_type
    const asset_name = req.params.asset_name
    const asset_count = req.params.asset_count
    const bought_date = req.params.bought_date
    const user_id = req.params.user_id
    const id = uuidv4()
    insertAsset(id, user_id, asset_type, asset_name, asset_count, bought_date).then(result => {
        if(result){
            res.send(`${asset_count} ${asset_type} ${asset_name} bought ${bought_date} has been added to the ${user_id}`)
        }
    }).catch(err =>{
        res.status(500).send(err)
    })
})

module.exports = router