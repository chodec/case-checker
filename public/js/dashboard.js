const sidebar = document.getElementById('sidebar')
const sidebarCollapse = document.getElementById('sidebarCollapse')
const sidebarCollapseChild = sidebarCollapse.querySelector('i')
const main = document.getElementById('main')
const hiddenSmall = document.getElementsByClassName('hiddenSmall')
const displayCases = document.getElementById('displayCases')

let toggle = true
let url = 'https://steamcommunity.com/market/pricehistory/?country=us&currency=3&appid=730&market_hash_name=Kilowatt%20Case'
const cases = ['Kilowatt%20Case', 'Dreams%20%26%20Nightmares%20Case', 'Fracture%20Case', 'Recoil%20Case', 'Revolution%20Case', 'Chroma%20Case', 'Chroma%202%20Case', 'Chroma%203%20Case', 'Clutch%20Case', 'CS%3AGO%20Weapon%20Case', 'CS%3AGO%20Weapon%20Case%202', 'CS%3AGO%20Weapon%20Case%203', 'CS20%20Case', 'Danger%20Zone%20Case', 'eSports%202013%20Case', 'eSports%202013%20Winter%20Case', 'eSports%202014%20Summer%20Case', 'Falchion%20Case','Gamma%20Case', 'Gamma%202%20Case', 'Glove%20Case', 'Horizon%20Case', 'Huntsman%20Weapon%20Case', 'Operation%20Bravo%20Case', 'Operation%20Breakout%20Weapon%20Case','Operation%20Broken%20Fang%20Case', 'Operation%20Hydra%20Case', 'Operation%20Phoenix%20Weapon%20Case', 'Operation%20Riptide%20Case', 'Operation%20Vanguard%20Weapon%20Case','Operation%20Wildfire%20Case', 'Prisma%20Case', 'Prisma%202%20Case', 'Revolver%20Case', 'Shadow%20Case', 'Shattered%20Web%20Case', 'Snakebite%20Case', 'Spectrum%20Case','Spectrum%202%20Case', 'Winter%20Offensive%20Weapon%20Case']

const toggleNav = () => {
    if (toggle) {
        sidebar.style.width = '50px'
        for (let i = 0; i < hiddenSmall.length; i++) {
            hiddenSmall[i].style.display = 'none' 
        }
        sidebarCollapse.style.marginLeft = '30px'
        sidebarCollapseChild.classList.remove = 'fa-chevron-left'
        sidebarCollapseChild.className = 'fa-solid  fa-chevron-right'
        toggle = false
    } else if(!toggle){
        sidebar.style.width = '250px'
        for (let i = 0; i < hiddenSmall.length; i++) {
            hiddenSmall[i].style.display = 'inline'
        }
        sidebarCollapse.style.marginLeft = '230px'
        sidebarCollapseChild.classList.remove = 'fa-chevron-right'
        sidebarCollapseChild.className = 'fa-solid  fa-chevron-left'
        toggle = true
    }
}

const showCases = () => {
    fetch('../img/items/cases/data.json')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < Object.values(data).length; i++) {
                const node = document.createElement("option");
                const textnode = document.createTextNode(Object.values(data)[i].case_name)
                node.appendChild(textnode)
                displayCases.appendChild(node)
                console.log(Object.values(data)[i])
            }
        })
        .catch(error => console.log(error))
}

showCases()

//Vyvoj ceny na marketu konkretniho itemu
//https://steamcommunity.com/market/pricehistory/?country=CZ&currency=3&appid=730&market_hash_name=P250%20%7C%20Cartel%20%28Battle-Scarred%29

//Konkretni item na steam marketu
//https://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=P250%20%7C%20Cartel%20%28Battle-Scarred%29

//Might be helpful
//https://www.npmjs.com/package/steam-market-fetcher