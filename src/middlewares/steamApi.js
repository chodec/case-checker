const path = require('path')
const fs = require('fs')

const jsonPath = path.join(__dirname, '../')
var obj

// fs.open(jsonPath + '/db/json/Chroma%20Case.json', 'r', (err, data) =>{
//     if (err) console.log(err)

// })

fs.readFile(jsonPath + '/db/json/Chroma%20Case.json', 'utf8', (err, data) => {
  if (err) throw err
  obj = JSON.parse(data)
  console.log(obj)
})
