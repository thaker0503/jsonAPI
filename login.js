
const users = []
import { App } from "./todo.js"


export var currentUser
export class Users {
    constructor(userurl) {
        $.get(userurl, function (data) {
            $.each(data, function (i, item) {
                users.push(item)
                console.log(users)
            })
        })
    }

    getUsers(userurl) {
        $.get(userurl, function (data) {
            $.each(data, function (i, item) {
                users.push(item)
                console.log(users)
            })
        })
    }

    signIn(email, password) {
        users.forEach(item => {
            if (item.email === email && item.password === password) {
                console.log("Log In SuccessFul")
                // currentUser = item.id
                // localStorage.setItem("currentUser", currentUser)
                currentUser = item.name.toLowerCase()
                console.log(currentUser)
                const url = `https://internapp.vercel.app/${currentUser}/todos/`
                const app = new App(url)
                app.getTodos(url)
                $("#afterLogin").show()
                $("#loggedInUser").text(currentUser)
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
            url: user,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                console.log(data)
                app.getUsers(user);
            }
        })
    }
};


