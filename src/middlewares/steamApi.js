const axios = require('axios')

const cases = ['Kilowatt%20Case', 'Dreams%20%26%20Nightmares%20Case', 'Fracture%20Case', 'Recoil%20Case', 'Revolution%20Case', 'Chroma%20Case', 'Chroma%202%20Case', 
                'Chroma%203%20Case', 'Clutch%20Case', 'CS%3AGO%20Weapon%20Case', 'CS%3AGO%20Weapon%20Case%202', 'CS%3AGO%20Weapon%20Case%203', 'CS20%20Case',
                'Danger%20Zone%20Case', 'eSports%202013%20Case', 'eSports%202013%20Winter%20Case', 'eSports%202014%20Summer%20Case', 'Falchion%20Case',
                'Gamma%20Case', 'Gamma%202%20Case', 'Glove%20Case', 'Horizon%20Case', 'Huntsman%20Weapon%20Case', 'Operation%20Bravo%20Case', 'Operation%20Breakout%20Weapon%20Case',
                'Operation%20Broken%20Fang%20Case', 'Operation%20Hydra%20Case', 'Operation%20Phoenix%20Weapon%20Case', 'Operation%20Riptide%20Case', 'Operation%20Vanguard%20Weapon%20Case',
                'Operation%20Wildfire%20Case', 'Prisma%20Case', 'Prisma%202%20Case', 'Revolver%20Case', 'Shadow%20Case', 'Shattered%20Web%20Case', 'Snakebite%20Case', 'Spectrum%20Case',
                'Spectrum%202%20Case', 'Winter%20Offensive%20Weapon%20Case']
const getCase = async () => {
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
}

module.exports = getCase