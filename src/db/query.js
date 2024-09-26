const { Client } = require("pg")
const user = 'postgres'
const host = 'localhost'
const dbUsers = 'users'
const password =  process.env.DB_PASS
const port = '5432'

const client = new Client({
  user: user,
  host: host,
  database: dbUsers,
  password: password,
  port: port,
})

const insertUser = async (username, email, pass, id) => {
  try {
    await client.connect()
    await client.query(
      `INSERT INTO users (username, email, pass, id) 
             VALUES ($1, $2, $3, $4)`,
      [username, email, pass, id]
    )
    return true;
  } catch (error) {
    console.error(error.stack)
    return false
  }
}

const getUser = async (email) => {
  try {
    await client.connect()
    userData = await client.query(
      `SELECT * FROM users 
              WHERE email=($1)`,
      [email]
    )
    return userData
  } catch (error) {
    console.error(error.stack)
    return false
  }
}

const validateDuplicate = async (email) => {
  try {
    await client.connect()
    queryDuplicate = await client.query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    )
    if (queryDuplicate.rowCount >= 1) {
      return true
    } else if (queryDuplicate.rowCount === 0) {
      return false
    }
  } catch (error) {
    console.error(error.stack)
    return false
  }
}

const insertAsset = async (email, asset_type, asset_name, asset_count, bought_date, assetId) => {
  try {
    await client.connect()
    await client.query(
      `INSERT INTO assets (id, user_id, asset_type, asset_name, asset_count, bought_date)
       VALUES (
         $1, 
         (SELECT id FROM users WHERE email = $2), 
         $3, $4, $5, $6
       )`,       
      [assetId, email, asset_type, asset_name, asset_count, bought_date]
    )
    console.log(assetId, email, asset_type, asset_name, asset_count, bought_date)
    return true
  } catch (error) {
    console.error(error.stack)
    return false
  }
}

module.exports = { insertUser, getUser, validateDuplicate, insertAsset, insertAsset }
