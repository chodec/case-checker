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
const table = document.getElementById('table')
const tableFirstChild = document.getElementById('tableFirstChild')
const cookie = Object.fromEntries(document.cookie.split('; ').map(v=>v.split(/=(.*)/s).map(decodeURIComponent)))

const urlAssetInsert = 'http://localhost:3000/asset/insert'
const urlGetUserAssets = 'http://localhost:3000/asset/getUserAssets'

let toggle = true
let url = 'https://steamcommunity.com/market/pricehistory/?country=us&currency=3&appid=730&market_hash_name=Kilowatt%20Case'
let caseValid = false
let countValid = false
let assetType

startDate.value = new Date().toISOString().substring(0, 10)

const setWelcomeText = () => {
    userName.innerHTML = cookie.username
}

const getCaseImg = (caseName) => {
    let arr = []
    return fetch('../img/items/cases/data.json')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < Object.values(data).length; i++) {
                if (caseName === Object.values(data)[i].case_name) {
                    arr.push(Object.values(data)[i].case_name)
                    arr.push(Object.values(data)[i].image_url)
                    return arr
                }
            }
            return null
        })
        .catch(error => {
            console.log(error)
            return null
        })
}

const createTableRow = (caseName, caseImg, dateBought, caseCount) => {
    const tr = document.createElement('tr')
    const th = document.createElement('th')
    th.setAttribute('scope', 'row')
    const img = document.createElement('img')
    img.src = caseImg
    img.classList.add('caseSmall')
    img.alt = ''
    th.appendChild(img)
    tr.appendChild(th)
  
    const tdName = document.createElement('td')
    tdName.textContent = editCaseName(caseName)
    tr.appendChild(tdName)
  
    const tdDate = document.createElement('td')
    tdDate.textContent = dateBought
    tr.appendChild(tdDate)
  
    const tdCount = document.createElement('td')
    
    const spanCount = document.createElement('span')
    spanCount.classList.add('caseCount')
    spanCount.textContent = caseCount
    
    const spanEdit = document.createElement('span')
    spanEdit.classList.add('caseCountEdit')
  
    const trashIcon = document.createElement('i')
    trashIcon.classList.add('fa-regular', 'fa-trash-can')
  
    spanEdit.appendChild(trashIcon)
  
    tdCount.appendChild(spanCount)
    tdCount.appendChild(spanEdit)
  
    tr.appendChild(tdCount)
  
    return tr
  }

const loadCases = () => {
    fetch(urlGetUserAssets, {
        method: "POST",
        body: new URLSearchParams({
          email: cookie.email
        }),
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: "include"
    })
    .then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        throw "failed"
    })
    .then((data) => {
            for (let i = 0; i < data.length; i++) {
                getCaseImg(data[i].asset_name).then(res => {
                    let newRow = createTableRow(res[0],res[1], data[i].bought_date, data[i].asset_count)
                    table.insertBefore(newRow, tableFirstChild)
                })
            }
    })
    .catch((err) => {
        console.log(err)
    })
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
    item.name = itemData.case_name

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
    dropdownMenuButton.name = e.target.id
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

openModal.addEventListener('click', (e) =>{
    e.preventDefault()
    showCases()
    startDate.max = new Date().toISOString().substring(0, 10)
    confirmAddCase.disabled = true
})

const setAssetType = (assetName) => {
    if (assetName.includes('case')) {
        assetType = 'case'
    }
}

confirmAddCase.addEventListener('click', (e) => {
    e.preventDefault()
    console.log(dropdownMenuButton.name)
    console.log(count.value)
    console.log(startDate.value)
    console.log(cookie.email)
    setAssetType(dropdownMenuButton.name)
    fetch(urlAssetInsert, {
        method: "POST",
        body: new URLSearchParams({
          email: cookie.email,
          asset_name: dropdownMenuButton.name,
          bought_date: startDate.value,
          asset_count: count.value,
          asset_type: assetType
        }),
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: "include"
        })
      .then((res) => {
        if (res.status === 200) {
            if (res.status !== 200) {
                throw "failed"
            }
            return res.json()
        }
        throw "failed"
      })
      .then((data) => {
        console.log(data)
        loadCases()
      })
      .catch((err) => {
        console.log(err)
      })
})
count.addEventListener('keyup', countHandler)
count.addEventListener('click', countHandler)
setWelcomeText()
loadCases()


//Vyvoj ceny na marketu konkretniho itemu
//https://steamcommunity.com/market/pricehistory/?country=CZ&currency=3&appid=730&market_hash_name=P250%20%7C%20Cartel%20%28Battle-Scarred%29

//Konkretni item na steam marketu
//https://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=P250%20%7C%20Cartel%20%28Battle-Scarred%29
