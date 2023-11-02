let email = document.getElementById('email')
let password = document.getElementById('password')
let nickname = document.getElementById('nickname')
let passwordRepeat = document.getElementById('passwordRepeat')
let emailHelp = document.getElementById('emailHelp')
let passwordHelp = document.getElementById('passwordHelp')
let nicknameHelp = document.getElementById('nicknameHelp')
let passwordRepeatHelp = document.getElementById('passwordRepeatHelp')
let rowRegister = document.getElementsByClassName('row-register')[0]

const changeBorder =  (dom, domHelper, status) => {
    let registerPadding = window.getComputedStyle(rowRegister,null).getPropertyValue('padding')
    rowRegister.style.padding = parseFloat(registerPadding) - 8
    if (status === 'failed') {
        dom.style.borderColor = "red"
        dom.style.boxShadow = "0.25rem 0.25rem red"
        dom.style.color = "white"
        domHelper.classList.remove('hidden')
    } else if (status === 'passed') {
        dom.style.borderColor = "green"
        dom.style.boxShadow = "0.25rem 0.25rem green"
        dom.style.color = "white"
        domHelper.classList.add('hidden')
    }
}

const nicknameHandler = function() {
    let nicknameLength = nickname.value
    nicknameLength.length > 2 ?
     changeBorder(nickname, nicknameHelp, 'passed') :
      changeBorder(nickname, nicknameHelp, 'failed')
}
const emailHandler = function() {
    let emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    email.value.match(emailPattern) ?
     changeBorder(email, emailHelp, 'passed') :
      changeBorder(email, emailHelp, 'failed')
}

const passwordHandler = function() {
    let passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/gm
    password.value.match(passwordPattern) ?
     changeBorder(password, passwordHelp, 'passed') :
      changeBorder(password, passwordHelp, 'failed')
}

const matchingPasswordHandler = function () {
    password.value === passwordRepeat.value ?
     changeBorder(passwordRepeat, passwordRepeatHelp, 'passed') :
      changeBorder(passwordRepeat, passwordRepeatHelp, 'failed')
}

nickname.addEventListener('change', nicknameHandler)
nickname.addEventListener('keyup', nicknameHandler)
email.addEventListener('change', emailHandler)
email.addEventListener('keyup', emailHandler)
password.addEventListener('change', passwordHandler)
password.addEventListener('keyup', passwordHandler)
passwordRepeat.addEventListener('change', matchingPasswordHandler)
passwordRepeat.addEventListener('keyup', matchingPasswordHandler)