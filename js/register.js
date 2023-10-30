let email = document.getElementById('email')
let password = document.getElementById('password')
let nickname = document.getElementById('nickname')
let passwordRepeat = document.getElementById('passwordRepeat')

const nicknameHandler = function(e) {
    let nicknameLength = nickname.value
    
    if (nicknameLength.length > 3) {
        nickname.style.borderColor = "green"
        nickname.style.boxShadow = "3px 3px green"
    }
}

nickname.addEventListener('keydown', nicknameHandler)