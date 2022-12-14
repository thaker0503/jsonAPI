
// let currentUser = "yatharth";
const url = "https://internapp.vercel.app/yatharth/todos/"


Notification.requestPermission()

// declaring the arrays globally for different types of tasks and also storing the values of the timer in the reminder array
var pending = [],
    completed = [],
    reminder = [];

// getting the current date and time
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var hh = today.getHours() < 12 ? "0" + today.getHours() : today.getHours()
var mmm = today.getMinutes() < 12 ? "0" + today.getMinutes() : today.getMinutes()
var time = hh + ":" + mmm
today = dd + '/' + mm + '/' + yyyy

// hiding the error message that is to be shown when user tries to submit empty task
$(".error1").hide()
$(".error2").hide()
$(".error3").hide()



// creating class App that is to be instantiated to manipulate the application
class App {
    // creating constructor for the App class
    constructor(url) {
        $.get(url, function (data) {
            if (data == '' || data == null) {
                $(".pendingtask").empty()
                $(".completedtask").empty()
                $("<p>Add new task...</p>").appendTo(".pendingtask")
                $("<p>Add new task...</p>").appendTo(".completedtask")
            } else {
                pending = []
                completed = []
                $.each(data, function (i, item) {

                    if (item.completed) {
                        completed.push(item)
                    } else {
                        reminder.push(item.reminder)
                        pending.push(item)
                        reminder.forEach(item => {
                            var newTime = item + ":00"
                            app.elapsedTime(newTime)
                        })
                    }
                })
                // console.log(pending)
                // console.log(completed)
                pendingDiv(pending)
                completedDiv(completed)
            }
        })  
        
    }

    // this method helps to get the ToDos from the API and calls the pendingDiv() and completedDiv() functions to display data on the webpage
    getTodos(url) {
        console.log("Getting Todoss")
        console.log(url)
        $.get(url, function (data) {
            if (data == '' || data == null) {
                $(".pendingtask").empty()
                $(".completedtask").empty()
                $("<p>Add new task...</p>").appendTo(".pendingtask")
                $("<p>Add new task...</p>").appendTo(".completedtask")
            } else {
                pending = []
                completed = []
                $.each(data, function (i, item) {
                    
                    if (item.completed) {
                        completed.push(item)
                    } else {
                        reminder.push(item.reminder)
                        pending.push(item)
                        reminder.forEach(item => {
                            var newTime = item + ":00"
                            app.elapsedTime(newTime)
                        })
                    }
                })
                pendingDiv(pending)
                completedDiv(completed)
            }
        })  
        
    }

    // this method of the App class helps in sending the todos entered by user to the API to store it and then calls the getTodos() method to get the POSTed data from the API
    sendTodos(url, product) {
        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(product),
            contentType: "application/json",
            success: function (data) {
                $("#title").val("").focus()
                $("#description").val("")
                $("#time").val("")
                // app.getTodos(url)
                pending = [...pending, data]
                pendingDiv(pending)
                completedDiv(completed)
            }
        });
    }

    // this method of the App class deletes the specific Todo from the API and then calls the getTodos() method to get the POSTed data from the API
    delTodo(id) {
        const final = url + id
        $.ajax({
            url: final,
            type: 'DELETE',
            success: function (data) {
                // app.getTodos(url)
                const index = pending.findIndex(item => item.id == data.id)
                pending.splice(index, 1)
                const index2 = completed.findIndex(item => item.id == data.id)
                completed.splice(index2, 1)
                // pending = [...pending,data]
                pendingDiv(pending)
                completedDiv(completed)
            }
        })
    }

    // this method of App class is used to display the data inside the pendingDiv() if its completed key is false in the API data
    falseValue(final) {
        $.ajax({
            url: final,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                completed: false
            }),
            success:
                function (data) {
                    // app.getTodos(url)
                    const index = completed.findIndex(item => item == data)
                    completed.splice(index, 1)
                    completed = [...completed]
                    pending = [...pending, data]
                    console.log("False ==> Pending ==>",pending)
                    console.log("False ==> Completed ==>",completed)
                    pendingDiv(pending)
                    completedDiv(completed)
                    // $(`.${id}`).addClass("animation")
                }
        })
    }

    // this method of App class is used to display the data inside the pendingDiv() if its completed key is true in the API data
    trueValue(final) {
        $.ajax({
            url: final,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                completed: true
            }),
            success:
                function (data) {
                    // app.getTodos(url)
                    const index = pending.findIndex(item => item == data)
                    pending.splice(index, 1)
                    pending = [...pending]
                    completed = [...completed, data]
                    console.log("True ==> Pending ==>", pending)
                    console.log("True ==> Completed ==>", completed)
                    completedDiv(completed)
                    pendingDiv(pending)
                    // $(`.${id}`).addClass("animation")
                }
        })
    }

    // this method of the App class is used for setting timer and whenever it is called it starts the timer and whenever the timer ends it calls notifyMe() method to send notification
    elapsedTime(taskTimer) {
        const currentTime = new Date();
        const newTime = new Date();
        const [hr, mm, ss] = taskTimer.split(":");
        newTime.setHours(+hr, +mm, +ss);
        console.log("HOURS", newTime.getHours(), newTime.getMinutes());
        const elapsedMs = newTime - currentTime;
        if (elapsedMs > 0) {
            setTimeout(() => {
                app.notifyMe("Reminder", "This is the reminder for your task...")
            }, [elapsedMs])
        }
    }

    // this method of App class is used to send notification to the user
    notifyMe(title, body) {
        var executed = false;
        if (!executed) {
            executed = true
            console.log("Notify Me Called ==>")
            Notification.requestPermission().then((permission) => {
                console.log(permission)
                if (permission === "granted") {
                    let icon = './images/calendar.jpg';
                    var notification = new Notification(title, { body, icon });
                    notification.addEventListener('click', (e) => {
                        // console.log("NOtification Clicked....")
                        e.preventDefault();
                        window.open('https://thaker0503.github.io/jsonAPI/TASK2.html', '_blank');
                    })
                }
            });
        }
    }
    
}


// instatiating the App class
const app = new App(url)



// creating event listener on click and calling the sendtodos method
$("#addTask").click(function (e) {
    e.preventDefault();
    var task = {
        title: $("#title").val(),
        description: $("#description").val(),
        reminder: $("#time").val(),
        completed: false
    };
    console.log(task)
    if (task.title === "" && task.description === "") {
        $(".error1").show()
        $(".error2").show()
    } else if (task.title === "") {
        $(".error1").show()
        $(".error2").hide()
    } else if (task.description === "") {
        $(".error2").show()
        $(".error1").hide()
    }else {
        $(".error1").hide()
        $(".error2").hide()
        app.sendTodos(url, task)
    }
    // app.sendTodos(url, task)
}).css({
    width: '50%',
    cursor: 'pointer'
})


// function to call the delTodo() method of the App class
function del(id) {
    app.delTodo(id)
}


// function to call the falseValue() or trueValue() method of the App class
function checkBoxClick(id) {
    const final = url + id
    $.get({
        url: final,
        success: function (data) {
            data.completed ? app.falseValue(final, id) : app.trueValue(final, id)
        }
    })
}


function pendingDiv(pending) {
    $(".pendingtask").empty()
    pending.forEach((item) => {
        if (item.reminder === "") {
            var card = `<div class='list ' > 
                            <div class="div1 ">
                                <input type="checkbox"  id="checkBox" onclick="checkBoxClick('${item.id}')"/> 
                                <div>
                                    <span class="title">${item.title}</span> 
                                    <span class="desc">${item.description}</span> 
                                </div>
                                <span>Created on: ${today}</span>
                                <button id="${item.id}" class='deleteBtn' onclick="del('${item.id}')" ><i  class="fa-solid fa-trash-can close"></i></button>
                            </div>    
                            </div>
                            `   
        } else {
            var card = `<div class='list ' > 
                            <div class="div1 ">
                                <input type="checkbox"  id="checkBox" data-id='${item.id}'/> 
                                <div>
                                    <span class="title">${item.title}</span> 
                                    <span class="desc">${item.description}</span> 
                                </div>
                                <span>Reminder at: ${item.reminder}</span>
                                <span>Created on: ${today}</span>
                                <button id="${item.id}" class='deleteBtn' onclick="del('${item.id}')"><i  class="fa-solid fa-trash-can close"></i></button>
                            </div>    
                            </div>
                            `  
            // card.classList.add('list', 'new-list');
        }
        
        $(".pendingtask").append(card)
    })
    
}

function completedDiv(completed) {
    $(".completedtask").empty()
    completed.forEach((item) => {
        if (item.reminder === "") {
            var card = `<div class='list ' > 
                        <div class="div2 ">
                            <input type="checkbox"   id="checkBox" onclick="checkBoxClick('${item.id}')" checked/> 
                            <div>
                            <span class="title">${item.title}</span> 
                            <span class="desc">${item.description}</span> 
                            </div>
                            <span>Created on: ${today}</span>
                            <button id="${item.id}" class='deleteBtn' onclick="del('${item.id}')" ><i  class="fa-solid fa-trash-can close"></i></button>
                        </div>    
                        </div>
                    `
        } else {
            var card = `<div class='list ' > 
                        <div class="div2 ">
                            <input type="checkbox"   id="checkBox" onclick="checkBoxClick('${item.id}')" checked/> 
                            <div>
                            <span class="title">${item.title}</span> 
                            <span class="desc">${item.description}</span> 
                            </div>
                            <span>Reminder at: ${item.reminder}</span>
                            <span>Created on: ${today}</span>
                            <button id="${item.id}" class='deleteBtn' onclick="del('${item.id}')" ><i  class="fa-solid fa-trash-can close"></i></button>
                        </div>    
                        </div>
                    `
        }
        $(".completedtask").append(card)
    })
}

$(".closebtn").click(function () {
    App.closeNav()
})
