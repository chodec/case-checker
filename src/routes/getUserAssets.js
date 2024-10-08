const express = require('express')
const { getUserAssets } = require('../db/query.js')
const router = express.Router()

router.get('/asset/getUserAssets', (req, res) => {
    const data = req.body

    getUserAssets(data.email).then(result => {
        if(result){
            res.send(`${JSON.stringify(result)}`)
        }
    }).catch(err =>{
        res.status(500).send(err)
    })
})

module.exports = router