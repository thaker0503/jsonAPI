const url = "https://internapp.vercel.app/users/"
const users = []
class Todo {
    constructor(url) {
        $.get(url, function (data) {
            $.each(data, function (key, value) {
                users.push(value)
            })
            Todo.loggedIn()
        })
    }

    getUsers(url) {
        $.get(url, function (data) {
            $.each(data, function (key, value) {
                users.push(value)
            })
            
        })
    }

    signIn(email,password) {
        users.forEach(item => {
            if (item.email === email && item.password === password) {
                console.log("Log In SuccessFul")
                var id = item.id
                
                var final = url + id
                console.log(final)
                $.ajax({
                    url: url + id,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        loggedIn: true
                    }),
                    success: function (data) {
                        console.log(data)
                        alert("Success...")
                        todo.closeNav()
                        $("#afterLogin").show()
                        Todo.loggedIn()
                         

                        
                    }
                })
                return true
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
            url: url,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                console.log(data)
                todo.getUsers(url);
            }
        })
    }

    static loggedIn() {
        console.log("Log In Called ==>")
        
        users.forEach(item => {
            console.log("Running...")
            if (item.loggedIn) {
                console.log(item.name)
                var currentUser = item.id
                localStorage.setItem("currentUser", currentUser)
                // $("#afterLogin").empty().html(`<h1> Hello ${currentUser}</h1 >`)
            } else {
                console.log("No Log In")
            }
        })
    }

    openNav() {
        document.getElementById("myNav").style.height = "100%";
    }

    closeNav() {
        document.getElementById("myNav").style.height = "0%";
    }
}

const todo = new Todo(url)

$("#signInBtn").click(function (e) {
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();
    todo.signIn(email, password) 
        
    
        
    
    e.preventDefault();
})

$("#signUpBtn").click(function (e) {
    const name = $("#userName").val();
    const email = $("#regEmail").val();
    const password = $("#regPassword").val();
    const pass = $("#regPasswordValid").val();
    if (todo.isPassSame(pass, password)) {
        todo.signUp(name,email,password)
    }
    e.preventDefault();
})

$("#afterLogin").hide()

// $("#btn").click(function () {
//     $(".container").css({
//         display: "flex"
//     })
//     $("<form id='signIn'></form >").appendTo(".rightDiv")
//     $("#signIn").html(`
//                 <img src="../images/calendar.jpg" />
//                 <h1>Hello Again</h1>
//                 <input type="text" id="loginEmail" placeholder="Enter registered email" />
//                 <input type="password" id="loginPassword" placeholder="Enter your password"/>
//                 <button id="signInBtn">Sign In</button>
//                 `).animate({
//                     opacity: 1
//                     // WebkitTransition: 'opacity 10s ease-in-out',
//                     // transition: 'opacity 10s ease-in-out'
//     })
// })

todo.openNav()

// $(".closebtn").click(function () {
//     todo.closeNav()
// })
console.log(users)
