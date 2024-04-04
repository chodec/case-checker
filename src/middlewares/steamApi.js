const path = require('path')
const fs = require('fs')

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
