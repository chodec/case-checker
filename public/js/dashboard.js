const sidebar = document.getElementById('sidebar')
const sidebarCollapse = document.getElementById('sidebarCollapse')
const sidebarCollapseChild = sidebarCollapse.querySelector('i')
const main = document.getElementById('main')
const hiddenSmall = document.getElementsByClassName('hiddenSmall')
let toggled = true
const toggleNav = () => {
    if (toggled) {
        sidebar.style.width = '40px'
        for (let i = 0; i < hiddenSmall.length; i++) {
            hiddenSmall[i].style.display = 'none' 
        }
        sidebarCollapse.style.marginLeft = '20px'
        sidebarCollapseChild.classList.remove = 'fa-chevron-left'
        sidebarCollapseChild.className = 'fa-solid  fa-chevron-right'
        toggled = false
    } else if(!toggled){
        sidebar.style.width = '250px'
        for (let i = 0; i < hiddenSmall.length; i++) {
            hiddenSmall[i].style.display = 'inline'
        }
        sidebarCollapse.style.marginLeft = '230px'
        sidebarCollapseChild.classList.remove = 'fa-chevron-right'
        sidebarCollapseChild.className = 'fa-solid  fa-chevron-left'
        toggled = true
    }
}