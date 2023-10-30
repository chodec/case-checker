let email = document.getElementById('email')
let password = document.getElementById('password')
let nickname = document.getElementById('nickname')
let passwordRepeat = document.getElementById('passwordRepeat')

const nicknameHandler = function(e) {
    console.log(nickname.value);
}

nickname.addEventListener('keydown', nicknameHandler)