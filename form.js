
const users = []
const userurl = "https://internapp.vercel.app/users/"

class Users {
    constructor(userurl) {
        $.get(userurl, function (data) {
            $.each(data, function (i, item) {
                users.push(item)
            })
            console.log(users)
        })
    }

    getUsers(userurl) {
        $.get(userurl, function (data) {
            $.each(data, function (i, item) {
                users.push(item)
            })
            console.log(users)
        })
    }

    signIn(email, password) {
        users.forEach(item => {
            if (item.email === email && item.password === password) {
                console.log("Log In SuccessFul")
                window.location.replace("   ")
            } else {
                console.log("Please Register First")
            }
        })
    }

    isPassSame(pass1, pass2) {
        if (pass1 === pass2) {
            alert("Password Same")
            return true
        }
        alert("Password Not Same")
        return false
    }

    signUp(name, email, password) {
        var data = {
            id: "",
            name: name,
            email: email,
            password: password,
            loggedIn: false
        }
        $.ajax({
            url: userurl,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                console.log(data)
            }
        })
    }
};

const user = new Users(userurl)
$("#signInBtn").click(function (e) {
    e.preventDefault()
    var email = $("#loginEmail").val()
    var password = $("#loginPassword").val()
    user.signIn(email, password)
})
$("#signUpBtn").click(function (e) {
    e.preventDefault()
    var userName = $("#userName").val()
    var regEmail = $("#regEmail").val()
    var regPassword = $("#regPassword").val()
    var regPasswordValid = $("#regPasswordValid").val()
    if (user.isPassSame(regPassword, regPasswordValid)) {
        user.signUp(userName,regEmail,regPassword)
    }
})