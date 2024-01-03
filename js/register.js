let email = document.getElementById('email')
let password = document.getElementById('password')
let nickname = document.getElementById('nickname')
let passwordRepeat = document.getElementById('passwordRepeat')
let emailHelp = document.getElementById('emailHelp')
let passwordHelp = document.getElementById('passwordHelp')
let nicknameHelp = document.getElementById('nicknameHelp')
let passwordRepeatHelp = document.getElementById('passwordRepeatHelp')
let elArr = document.querySelectorAll('input')
let button = document.getElementById('submit')
let iconHide = document.getElementById('hide')
let iconShow = document.getElementById('show')

const xhttp = new XMLHttpRequest();

const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/gm

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
    if (nicknameLength.length > 2 && email.value.match(emailPattern) && password.value.match(passwordPattern) && password.value === passwordRepeat.value){
        button.disabled = false
    } else {
        button.disabled = true
    }
}

elArr.forEach((element) => {
    element.addEventListener('change', validateForm)
    element.addEventListener('keyup', validateForm)
})

// async function checkDuplicate() {
//     const apiUrl = "http://localhost:3000/validateDuplicate"

//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json()
//       console.log(data)
//     } catch (error) {
//       console.log(`Error: ${error}`)
//     }
//   }

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
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            console.log(xhttp.responseText)
        }
    }
    xhttp.open("POST", "http://localhost:3000/validateDuplicate", true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`email=${email.value}`)

    // xhttp.open("POST", "http://localhost:3000/", true)
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    // xhttp.send(`nickname=${nickname.value}&email=${email.value}&password=${password.value}`)
})