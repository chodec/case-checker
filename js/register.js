let email = document.getElementById('email')
let password = document.getElementById('password')
let nickname = document.getElementById('nickname')
let passwordRepeat = document.getElementById('passwordRepeat')
let emailHelp = document.getElementById('emailHelp')
let passwordHelp = document.getElementById('passwordHelp')
let nicknameHelp = document.getElementById('nicknameHelp')
let passwordRepeatHelp = document.getElementById('passwordRepeatHelp')

const changeBorder = function (dom, borderColor, boxShadow) {
    dom.style.borderColor = borderColor
    dom.style.boxShadow = boxShadow
    dom.style.color = "white" 
}

const nicknameHandler = function(e) {
    let nicknameLength = nickname.value
    
    if (nicknameLength.length > 2) {
        changeBorder(nickname, "green", "3px 3px green")
        nicknameHelp.classList.add('hidden')
    } else {
        changeBorder(nickname, "red", "3px 3px red")
        nicknameHelp.classList.remove('hidden')
    }
}
const emailHandler = function(e) {
    let emailpattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    
    if (email.value.match(emailpattern)) {
        changeBorder(email, "green", "3px 3px green")
        emailHelp.classList.add('hidden')
    } else {
        changeBorder(email, "red", "3px 3px red")
        emailHelp.classList.remove('hidden')
    }
}

nickname.addEventListener('change', nicknameHandler)
email.addEventListener('change', emailHandler)
