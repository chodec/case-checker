const path = require('path')
const express = require('express')
const fs = require('fs')
const router = express.Router()

const jsonPath = path.join(__dirname, '../')
let caseName = 'Prisma%202%20Case.json'

const getAllCases = () => {
    fs.readdir(`${jsonPath}/db/json/`, (err, files) => {
        files.forEach(file => {
            console.log(file)
        })
    })    
}

const getCase = (caseName) => {
    fs.readFile(`${jsonPath}/db/json/${caseName}`, 'utf8', (err, data) => {
        if (err) throw err
        obj = JSON.parse(data)
        console.log(data)
    })  
}

router.get('/market/:filename', (req, res) => {
    const filename = req.params.filename
    const encodedFileName = encodeURIComponent(filename)
    const pathToFile = `./src/db/json/${encodedFileName}.json`
    fs.readFile(pathToFile, 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`)
            res.status(500).send('Error reading file')
        } else {
            const jsonData = JSON.parse(data)
            res.json(jsonData)
        }
    })
})

module.exports = router