const { Client } = require("pg")

//Create user
const insertUser = async (username, email, pass, id) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "users",
    password: process.env.DB_PASS,
    port: "5432",
  });
  try {
    await client.connect();
    await client.query(
      `INSERT INTO users (username, email, pass, id) 
             VALUES ($1, $2, $3, $4)`,
      [username, email, pass, id]
    )
    return true;
  } catch (error) {
    console.error(error.stack)
    return false
  } finally {
    await client.end()
  }
}

//Get users email from DB
const getUser = async (email) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "users",
    password: process.env.DB_PASS,
    port: "5432",
  })
  try {
    await client.connect()
    userData = await client.query(
      `SELECT email, pass, id FROM users 
              WHERE email=($1)`,
      [email]
    )
    return userData
  } catch (error) {
    console.error(error.stack)
    return false
  } finally {
    await client.end()
  }
}

//Check if users email already exists in DB
const validateDuplicate = async (email) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "users",
    password: process.env.DB_PASS,
    port: "5432",
  })
  try {
    await client.connect()
    queryDuplicate = await client.query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    )
    await client.end()
    if (queryDuplicate.rowCount >= 1) {
      return true
    } else if (queryDuplicate.rowCount === 0) {
      return false
    }
  } catch (error) {
    console.error(error.stack)
    return false
  } finally {
    await client.end()
  }
}

module.exports = { insertUser, getUser, validateDuplicate}
