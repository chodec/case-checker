const { Client } = require("pg")

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: process.env.DB_PASS,
  port: "5432",
})

//Create user
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

//Get users email from DB
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

//Check if users email already exists in DB
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

const insertAsset = async (id, user_id, asset_type, asset_name, asset_count, bought_date) => {
  try {
    await client.connect();
    await client.query(
      `INSERT INTO assets (id, user_id, asset_type, asset_name, asset_count, bought_date) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, user_id, asset_type, asset_name, asset_count, bought_date]
    )
    return true;
  } catch (error) {
    console.error(error.stack)
    return false
  }
}

module.exports = { insertUser, getUser, validateDuplicate, insertAsset}
