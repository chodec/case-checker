const express = require('express')
const { getUserAssets } = require('../db/query.js')
const router = express.Router()

router.post('/asset/getUserAssets', (req, res) => {
    const data = req.body

    getUserAssets(data.email).then(result => {
        if(result){
            res.json(result.rows)
        }
    }).catch(err =>{
        res.status(500).send(err)
    })
})

module.exports = router