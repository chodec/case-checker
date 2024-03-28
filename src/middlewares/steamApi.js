const axios = require('axios')
const getCase = async () => {
    try {
        // Specify the Steam API endpoint
        const apiUrl = 'https://steamcommunity.com/market/pricehistory/?country=us&currency=1&appid=730&market_hash_name=Kilowatt%20Case'
    
        // Specify the parameters for the API request (change as per your requirements)
        
        // const params = {
        //     appid: '730', 
        //     currency: '1',
        // }
    
        // Make a GET request to the Steam API
        const res = await axios.get(apiUrl)
    
        // Send the response data back to the client
        console.log(res)
    } catch (error) {
        console.error('Error fetching data from Steam API:', error.message)
        res.status(500).json({ error: 'Failed to fetch data from Steam API' })
    }
}

module.exports = getCase