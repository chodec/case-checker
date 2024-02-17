const email = document.getElementById('email')
const password = document.getElementById('password')
const nickname = document.getElementById('nickname')
const passwordRepeat = document.getElementById('passwordRepeat')
const emailHelp = document.getElementById('emailHelp')
const passwordHelp = document.getElementById('passwordHelp')
const nicknameHelp = document.getElementById('nicknameHelp')
const passwordRepeatHelp = document.getElementById('passwordRepeatHelp')
const emailDuplicate = document.getElementById('emailDuplicate')
const elArr = document.querySelectorAll('input')
const button = document.getElementById('submit')
const iconHide = document.getElementById('hide')
const iconShow = document.getElementById('show')

let duplicate = false

const xhttp = new XMLHttpRequest()

const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/gm

const urlValidate = "http://localhost:3000/account/register/validateDuplicate"
const urlRegister = "http://localhost:3000/account/register"

const changeBorder =  (dom, domHelper, status) => {
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

const emailHandlerDuplicate = (email) => {
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            email === xhttp.responseText.substring(1, xhttp.responseText.length - 1) ?
                duplicate = true :
                 duplicate = false
        }
    }
    xhttp.open("POST", urlValidate, true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`email=${email}`)
}
const showHide = () => {
    if (iconShow.classList.contains('hidden')) {
        iconHide.classList.add('hidden')
        iconShow.classList.remove('hidden')
        password.type = 'nickname'
    } else {
        iconHide.classList.remove('hidden')
        iconShow.classList.add('hidden')
        password.type = 'password'
    }
}
const nicknameHandler = () => {
    let nicknameLength = nickname.value
    nicknameLength.length > 2 ?
     changeBorder(nickname, nicknameHelp, 'passed') :
      changeBorder(nickname, nicknameHelp, 'failed')
}

const emailHandler = () => {
    changeBorder(email,emailDuplicate, "passed")
    emailDuplicate.style.display = "none"
    email.value.match(emailPattern) ?
     changeBorder(email, emailHelp, 'passed') :
      changeBorder(email, emailHelp, 'failed')
}

const passwordHandler = () => {
    password.value.match(passwordPattern) ?
     changeBorder(password, passwordHelp, 'passed') :
      changeBorder(password, passwordHelp, 'failed')
}

const matchingPasswordHandler = () => {
    password.value === passwordRepeat.value ?
     changeBorder(passwordRepeat, passwordRepeatHelp, 'passed') :
      changeBorder(passwordRepeat, passwordRepeatHelp, 'failed')
}

const validateForm = () => {
    let nicknameLength = nickname.value
    if(nicknameLength.length > 2 && email.value.match(emailPattern) && password.value.match(passwordPattern) && password.value === passwordRepeat.value){
        button.disabled = false
    } else {
        button.disabled = true
    }
}

elArr.forEach((element) => {
    element.addEventListener('change', validateForm)
    element.addEventListener('keyup', validateForm)
})

nickname.addEventListener('change', nicknameHandler)
nickname.addEventListener('keyup', nicknameHandler)
email.addEventListener('change', emailHandler)
email.addEventListener('keyup', emailHandler)
password.addEventListener('change', passwordHandler)
password.addEventListener('keyup', passwordHandler)
passwordRepeat.addEventListener('change', matchingPasswordHandler)
passwordRepeat.addEventListener('keyup', matchingPasswordHandler)
iconHide.addEventListener('click', showHide)
iconShow.addEventListener('click', showHide)
button.addEventListener('click', (e) =>{
    e.preventDefault()
    emailHandlerDuplicate(email.value)
    setTimeout ( () => {
        if (duplicate === true) {
            changeBorder(email,emailDuplicate, "failed")
            emailDuplicate.style.display = "table"
            emailHelp.style.display = "none"
            button.disabled = true
            duplicate = false
        } 
        else if (duplicate === false) {     
            xhttp.open("POST", urlRegister, true)
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            xhttp.send(`nickname=${nickname.value}&email=${email.value}&password=${password.value}`)
        }
    },500)
})
