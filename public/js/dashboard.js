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
const paginationContainer = document.querySelector(".pagination")

const urlAssetInsert = 'http://localhost:3000/asset/insert'
const urlGetUserAssets = 'http://localhost:3000/asset/getUserAssets'
const itemsPerPage = 10
const token = localStorage.getItem('token')
if (!token) {
  window.location.href = '/login'
}
console.log(localStorage.getItem('token'))

let currentPage = 1
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

const refreshTable = () => {
    const table = document.getElementById('table')
    const rows = table.getElementsByTagName('tr')
    
    for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].id !== 'tableFirstChild') {
            rows[i].remove()
        }
    }
}

const transformDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getUTCDate().toString().padStart(2, '0')
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const year = date.getUTCFullYear()

    return `${day}. ${month}. ${year}`
}

const createTableRow = (caseName, caseImg, dateBought, caseCount, assetId) => {
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
    tdDate.textContent = transformDate(dateBought)
    tr.appendChild(tdDate)
  
    const tdCount = document.createElement('td')
    
    const spanCount = document.createElement('span')
    spanCount.classList.add('caseCount')
    spanCount.textContent = caseCount
    
    const spanEdit = document.createElement('span')
    spanEdit.classList.add('caseCountEdit')
  
    const trashIcon = document.createElement('i')
    trashIcon.classList.add('fa-regular', 'fa-trash-can')
    trashIcon.dataset.assetId = assetId 

    trashIcon.addEventListener('click', deleteAsset)

    spanEdit.appendChild(trashIcon)
  
    tdCount.appendChild(spanCount)
    tdCount.appendChild(spanEdit)
  
    tr.appendChild(tdCount)
  
    return tr
}

const deleteAsset = (e) => {
    const assetId = e.target.dataset.assetId

    fetch(`/asset/deleteUserAsset`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ assetId })
    })
    .then(response => {
        if (response.ok) {
            initializePagination(currentPage)
        } else if (response.status === 401) {
            alert('Session expired. Please log in again.')
            window.location.href = 'http://localhost:3000/login'
        } else {
            console.error('Failed to delete asset')
        }
    })
    .catch(error => console.error('Error deleting asset:', error))
}


const loadCases = (offset = 0, limit = itemsPerPage) => {
    fetch(urlGetUserAssets, {
        method: "POST",
        body: new URLSearchParams({
            email: cookie.email,
            limit: limit,
            offset: offset
        }),
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`  
        },
        credentials: "include"
    })
    .then((res) => {
        if (res.status === 200) {
            return res.json() 
        }
        throw "failed to fetch user assets"
    })
    .then((jsonData) => {
        refreshTable()
        for (let i = 0; i < jsonData.length; i++) {
            getCaseImg(jsonData[i].asset_name).then(res => {
                if (res) {
                    let newRow = createTableRow(
                        jsonData[i].asset_name, 
                        res[1], 
                        jsonData[i].bought_date, 
                        jsonData[i].asset_count, 
                        jsonData[i].id
                    )
                    table.insertBefore(newRow, tableFirstChild)
                } else {
                    console.error('Image not found for case:', jsonData[i].asset_name)
                }
            })
        }
    })
    .catch((err) => {
        console.error('Error loading cases:', err)
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
const createPagination = async () => {
    const totalAssets = await fetchTotalAssetsCount()
    const pageCount = Math.ceil(totalAssets / itemsPerPage)
    paginationContainer.innerHTML = ''

    for (let i = 1; i <= pageCount; i++) {
        const pageItem = document.createElement('li')
        pageItem.classList.add('page-item')
        if (i === 1) pageItem.classList.add('active')

        const pageLink = document.createElement('a')
        pageLink.classList.add('page-link')
        pageLink.href = '#'
        pageLink.innerText = i

        pageLink.addEventListener('click', function (e) {
            e.preventDefault()
            setPage(i)
        })

        pageItem.appendChild(pageLink)
        paginationContainer.appendChild(pageItem)
    }
}

const setPage = (pageNumber) => {
    const offset = (pageNumber - 1) * itemsPerPage
    loadCases(offset, itemsPerPage)
    setActivePage(pageNumber)
    currentPage = pageNumber 
}

const setActivePage = (pageNumber) => {
    const pageItems = paginationContainer.querySelectorAll('.page-item')
    pageItems.forEach((item, index) => {
        if (index + 1 === pageNumber) {
            item.classList.add('active')
        } else {
            item.classList.remove('active')
        }
    })
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

const fetchTotalAssetsCount = () => {
    return fetch('/asset/countUserAssets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ email: cookie.email })
    })
    .then(response => response.json())
    .then(data => data.total_assets)
    .catch(error => {
        console.error('Error fetching assets count:', error)
        return 0
    })
}

const initializePagination = (pageNumber = 1) => {
    paginationContainer.innerHTML = ''
    createPagination()
    const offset = (pageNumber - 1) * itemsPerPage
    loadCases(offset, itemsPerPage)
    setActivePage(pageNumber)
    currentPage = pageNumber
}

confirmAddCase.addEventListener('click', (e) => {
    e.preventDefault()
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
            "Content-type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`
        },
        credentials: "include"
    })
    .then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        throw new Error("Failed to insert asset")
    })
    .then((data) => {
        initializePagination(currentPage) 
    })
    .catch((err) => {
        console.error('Error in confirmAddCase:', err)
    })
})    

count.addEventListener('keyup', countHandler)
count.addEventListener('click', countHandler)
setWelcomeText()
initializePagination()

//Vyvoj ceny na marketu konkretniho itemu
//https://steamcommunity.com/market/pricehistory/?country=CZ&currency=3&appid=730&market_hash_name=P250%20%7C%20Cartel%20%28Battle-Scarred%29

//Konkretni item na steam marketu
//https://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=P250%20%7C%20Cartel%20%28Battle-Scarred%29
