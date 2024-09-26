const sidebar = document.getElementById('sidebar')
const sidebarCollapse = document.getElementById('sidebarCollapse')
const sidebarCollapseChild = sidebarCollapse.querySelector('i')
const main = document.getElementById('main')
const hiddenSmall = document.getElementsByClassName('hiddenSmall')
const displayCases = document.getElementById('displayCases')
const openModal = document.getElementById('openModal')
const dropdownMenuButton = document.getElementById('dropdownMenuButton')
const confirmAddCase = document.getElementById('confirmAddCase')
const startDate = document.getElementById('startDate')
const count = document.getElementById('count')
const userName = document.getElementById('userName')
const cookie = Object.fromEntries(document.cookie.split('; ').map(v=>v.split(/=(.*)/s).map(decodeURIComponent)))

let toggle = true
let url = 'https://steamcommunity.com/market/pricehistory/?country=us&currency=3&appid=730&market_hash_name=Kilowatt%20Case'
let caseValid = false
let countValid = false

startDate.value = new Date().toISOString().substring(0, 10)

const setWelcomeText = () =>{
    userName.innerHTML = cookie.username
}

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
const editCaseName = (name) => {
    return name.toString().replaceAll("%20", " ").replaceAll("%26", "&").replaceAll("%3AGO", ":GO")
}

const reverseEditCaseName = (name) => {
    return name.toString().replaceAll(" ", "%20").replaceAll("&", "%26").replaceAll(":GO", "%3AGO")
}

const createDropDownItem = (data, index) => {
    const itemData = Object.values(data)[index]
                
    const item = document.createElement("div")
    item.className = "dropdown-item d-flex align-items-center"
    item.id = itemData.case_name
    item.style.cursor = "pointer"

    const img = document.createElement("img")
    img.src = itemData.image_url
    img.style.width = "30px"
    img.style.height = "30px"
    img.className = "me-2"

    const textNode = document.createTextNode(editCaseName(itemData.case_name))

    item.appendChild(img)
    item.appendChild(textNode)

    displayCases.appendChild(item)

    item.addEventListener('click', caseTypeHandler)
}

const showCases = () => {
    fetch('../img/items/cases/data.json')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < Object.values(data).length; i++) {
                createDropDownItem(data,i)
            }          
        }).catch(error => console.log(error))
}

displayCases.addEventListener('click', (e) => {
    let shorterName = e.target.id
    if (e.target.id.length > 15) {
        shorterName = e.target.id.substring(0,15) + '...'
    }
    dropdownMenuButton.innerHTML = editCaseName(shorterName)
})

const formValid = () => {
    if (caseValid === true && countValid === true) {
        confirmAddCase.disabled = false
    } else {
        confirmAddCase.disabled = true
    }
}

const caseTypeHandler = () => {
    let initCaseVal = JSON.stringify(dropdownMenuButton.innerHTML.split(''))
    if(initCaseVal.split('"')[1] === "\n"){
        caseValid = false
    } else {
        caseValid = true
        formValid()
    }
}

const countHandler = () => { 
    if(count.value === '0'){
        countValid = false
    } else {
        countValid = true
        formValid()
    }
}

confirmAddCase.addEventListener('click', (e) => {

})

openModal.addEventListener('click', (e) =>{
    showCases()
    confirmAddCase.disabled = true
})

count.addEventListener('keyup', countHandler)
count.addEventListener('click', countHandler)
setWelcomeText()

//Vyvoj ceny na marketu konkretniho itemu
//https://steamcommunity.com/market/pricehistory/?country=CZ&currency=3&appid=730&market_hash_name=P250%20%7C%20Cartel%20%28Battle-Scarred%29

//Konkretni item na steam marketu
//https://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=P250%20%7C%20Cartel%20%28Battle-Scarred%29
