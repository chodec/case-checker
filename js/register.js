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

const nicknameHandler = function() {
    let nicknameLength = nickname.value
    
    if (nicknameLength.length > 2) {
        changeBorder(nickname, "green", "3px 3px green")
        nicknameHelp.classList.add('hidden')
    } else {
        changeBorder(nickname, "red", "3px 3px red")
        nicknameHelp.classList.remove('hidden')
    }
}
const emailHandler = function() {
    let emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    
    if (email.value.match(emailPattern)) {
        changeBorder(email, "green", "3px 3px green")
        emailHelp.classList.add('hidden')
    } else {
        changeBorder(email, "red", "3px 3px red")
        emailHelp.classList.remove('hidden')
    }
}


const passwordHandler = function() {
    let passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/gm
    console.log(password.length);
    if (password.value.match(passwordPattern)) {
        changeBorder(password, "green", "3px 3px green")
        passwordHelp.classList.add('hidden')
    } else {
        changeBorder(password, "red", "3px 3px red")
        passwordHelp.classList.remove('hidden')
    }
}

nickname.addEventListener('change', nicknameHandler)
nickname.addEventListener('keydown', nicknameHandler)
email.addEventListener('change', emailHandler)
email.addEventListener('keydown', emailHandler)
password.addEventListener('change', passwordHandler)
password.addEventListener('keydown', passwordHandler)