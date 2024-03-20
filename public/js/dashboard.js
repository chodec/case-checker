const sidebar = document.getElementById('sidebar')
const main = document.getElementById('main')
let toggled = true
const toggleNav = () => {
    if (toggled) {
        sidebar.style.width = '10px'
    }
}