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

//Change input CSS if fail or success
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

//Check if email has right pattern
const emailHandler = () => {
    email.value.match(emailPattern) ? emailValid = true : emailValid = false
}

//Check if password has right pattern
const passwordHandler = () => {
    password.value.match(passwordPattern) ?  passValid = true : passValid = false
}

//Show or Hide users given password
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

//Check if user fill every input value
const validateForm = () => {
    if(email.value.match(emailPattern) && password.value.match(passwordPattern)){
        button.disabled = false
    } else {
        button.disabled = true
    }
}

//Check if user fill every input value
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
    fetch(urlLogin, {
        method: "POST",
        body: new URLSearchParams({
          email: email.value,
          password: password.value
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
        // window.location.href = 'http://localhost:3000/dashboard'
      })
      .catch(() => {
        changeBorder(email, emailHelp, 'failed')
        changeBorder(password, passwordHelp, 'failed')
      })
})