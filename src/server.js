const express = require('express')
const path = require('path')
const cors = require('cors')
const axios = require('axios')

const sessionsMiddleware = require('./middlewares/sessions.js')
//const getCase = require('./middlewares/steamApi.js')

const registerRouter = require('./routes/register.js')
const validateRouter = require('./routes/validate.js')
const loginRouter = require('./routes/login.js')

const app = express()
const port = 3000
const url = 'https://steamcommunity.com/market/pricehistory/?country=cz&currency=1&appid=730&market_hash_name=Kilowatt%20Case'

let fePath = path.join(__dirname, '../')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(fePath + '/public'))

//Setup session
app.use(sessionsMiddleware)
//Setup routes
app.use(validateRouter)
app.use(registerRouter)
app.use(loginRouter)

//Check user session
const requireAuth = (req, res, next) => {
  console.log(req.session.userId)
  if (req.session.userId) {
      next()
  } else {
      res.sendFile(path.join(fePath,'/public/html/login.html'))
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(fePath,'/public/html/index.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(fePath,'/public/html/login.html'))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(fePath,'/public/html/register.html'))
})

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(fePath,'/public/html/dashboard.html'))
})

app.get('/price-history', async (req, res) => {
  try {
    const { country, currency, appid, market_hash_name } = req.query;
    const apiUrl = `https://steamcommunity.com/market/pricehistory/?country=${country}&currency=${currency}&appid=${appid}&market_hash_name=${encodeURIComponent(market_hash_name)}`;
    
    const response = await axios.get(apiUrl);

    if (response.status === 200) {
        res.json(response.data);
    } else {
        console.error('Error fetching price history:', response.statusText);
        res.status(response.status).json({ error: response.statusText });
    }
} catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
}
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
