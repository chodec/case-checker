const email = document.getElementById('email')
const pass = document.getElementById('password')
const iconHide = document.getElementById('hide')
const iconShow = document.getElementById('show')
const button = document.getElementById('submit')
const elArr = document.querySelectorAll('input')

const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/gm

let passValid = false
let emailValid = false

const xhttp = new XMLHttpRequest()

const urlLogin = 'http://localhost:3000/account/login'

const emailHandler = () => {
    email.value.match(emailPattern) ? emailValid = true : emailValid = false
}

const passwordHandler = () => {
    password.value.match(passwordPattern) ?  passValid = true : passValid = false
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

const validateForm = () => {
    if(email.value.match(emailPattern) && password.value.match(passwordPattern)){
        button.disabled = false
    } else {
        button.disabled = true
    }
}

elArr.forEach((element) => {
    element.addEventListener('change', validateForm)
    element.addEventListener('keyup', validateForm)
})

email.addEventListener('change', emailHandler)
email.addEventListener('keyup', emailHandler)
password.addEventListener('change', passwordHandler)
password.addEventListener('keyup', passwordHandler)
iconHide.addEventListener('click', showHide)
iconShow.addEventListener('click', showHide)
button.addEventListener('click', (e) =>{
    e.preventDefault()
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            console.log(xhttp.response)
        }
    }
    xhttp.open("POST", urlLogin, true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`email=${email.value}&password=${password.value}`)
})