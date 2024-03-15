const session = require('express-session')
const { v4: uuidv4} = require('uuid')
require('dotenv').config()

const sessions = session({
    genid: (req) => {
      return  uuidv4()
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, 
      maxAge: 60000 * 60 * 24 * 28
    }
  })

  module.exports = sessions