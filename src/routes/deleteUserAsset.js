const express = require('express')
const { deleteUserAsset } = require('../db/query.js')
const router = express.Router()

router.delete('/asset/deleteUserAsset', (req, res) => {
    const { assetId } = req.body

    deleteUserAsset(assetId)
        .then(result => {
            if (result) {
                res.status(200).send({ message: "Asset deleted successfully" })
            } else {
                res.status(404).send({ error: "Asset not found" })
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({ error: "An error occurred while deleting the asset" })
        })
})

module.exports = router