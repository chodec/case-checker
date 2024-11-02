const { Pool  } = require("pg")
const user = 'postgres'
const host = 'localhost'
const dbUsers = 'users'
const password =  process.env.DB_PASS
const port = '5432'

const pool = new Pool({
  user: user,
  host: host,
  database: dbUsers,
  password: password,
  port: port,
})

const insertUser = async (username, email, pass, id) => {
  const client = await pool.connect()
  try {
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
    client.release() // Always release the client back to the pool
  }
}

const getUser = async (email) => {
  const client = await pool.connect()
  try {
    const userData = await client.query(
      `SELECT * FROM users 
              WHERE email=($1)`,
      [email]
    )
    return userData
  } catch (error) {
    console.error(error.stack)
    return false
  } finally {
    client.release()
  }
}

const validateDuplicate = async (email) => {
  const client = await pool.connect()
  try {
    const queryDuplicate = await client.query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    )
    return queryDuplicate.rowCount >= 1
  } catch (error) {
    console.error(error.stack)
    return false
  } finally {
    client.release()
  }
}

const insertAsset = async (email, asset_type, asset_name, asset_count, bought_date, assetId) => {
  const client = await pool.connect()
  try {
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
  } finally {
    client.release()
  }
}
const getUserAssets = async (email, limit = 10, offset = 0) => {
  const client = await pool.connect()
  try {
    const userData = await client.query(
      `SELECT * FROM assets 
              WHERE user_id=(SELECT id FROM users WHERE email = $1)
              LIMIT $2 OFFSET $3`,
      [email, limit, offset]
    )
    return userData.rows
  } catch (error) {
    console.error(error.stack)
    return false
  } finally {
    client.release()
  }
}

const countUserAssets = async (email) => {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT COUNT(*) AS total_assets 
       FROM assets 
       WHERE user_id=(SELECT id FROM users WHERE email = $1)`,
      [email]
    )
    return result.rows[0].total_assets
  } catch (error) {
    console.error(error.stack)
    return false
  } finally {
    client.release()
  }
}

const deleteUserAsset = async (assetId) => {
  const client = await pool.connect()
  try {
      const result = await client.query(
          `DELETE FROM assets WHERE id = $1 RETURNING *`,
          [assetId]
      )
      return result.rowCount > 0
  } catch (error) {
      console.error(error.stack)
      return false
  } finally {
      client.release()
  }
}

module.exports = { insertUser, getUser, validateDuplicate, insertAsset, insertAsset, getUserAssets, countUserAssets, deleteUserAsset }
