// url of the API
const url = "https://internapp.vercel.app/yatharth/todos/"

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
var mm = today.getMinutes() < 12 ? "0" + today.getMinutes() : today.getMinutes()
var time = hh + ":" + mm
today = dd + '/' + mm + '/' + yyyy

// hiding the error message that is to be shown when user tries to submit empty task
$(".error").hide()

// creating class App that is to be instantiated to manipulate the application
class App {
    // creating constructor for 
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
                pendingDiv()
                completedDiv()
            }
        })  
    }

    getTodos(url) {
        console.log("Getting Todoss")
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
                pendingDiv()
                completedDiv()
            }
        })  
    }


    sendTodos(url, product) {
        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(product),
            contentType: "application/json",
            success: function () {
                $("#title").val("").focus()
                $("#description").val("")
                $("#time").val("")
                app.getTodos(url)
            }
        });
    }

    delTodo(id) {
        const final = url + id
        $.ajax({
            url: final,
            type: 'DELETE',
            success: function () {
                app.getTodos(url)
                pendingDiv()
                completedDiv()
            }
        })
    }

    falseValue(final) {
        $.ajax({
            url: final,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                completed: false
            }),
            success:
                function () {
                    app.getTodos(url)
                }
        })
    }

    trueValue(final) {
        $.ajax({
            url: final,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                completed: true
            }),
            success:
                function () {
                    app.getTodos(url)
                }
        })
    }

    elapsedTime(taskTimer) {
        // const taskTimer = "14:22:00";
        const currentTime = new Date();
        const newTime = new Date();
        const [hr, mm, ss] = taskTimer.split(":");
        newTime.setHours(+hr, +mm, +ss);
        console.log("HOURS", newTime.getHours(), newTime.getMinutes());
        const elapsedMs = newTime - currentTime;
        console.log("Elasped", elapsedMs);
        if (elapsedMs > 0) {
            setTimeout(() => {
                // alert("TImer reached")
                app.notifyMe("Reminder", "This is the reminder for your task...")

            }, [elapsedMs])
        }
    }

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
                }
            });
        }
    }
}



const app = new App(url)



$("#addTask").click(function (e) {
    e.preventDefault();
    var product = {
        title: $("#title").val(),
        description: $("#description").val(),
        reminder: $("#time").val(),
        completed: false
    };
    console.log(product)
    if (product.title === "" || product.description === "") {
        console.log("If ran")
        $(".error").show("slow")
    } else {
        console.log("Else ran")
        app.sendTodos(url, product)
    }
}).css({
    width: '50%',
    cursor: 'pointer'
})


function del(id) {
    app.delTodo(id)
}

function checkBoxClick(id) {
    const final = url + id
    $.get({
        url: url + id,
        success: function (data) {
            data.completed ? app.falseValue(final) : app.trueValue(final)
        }
    })
}

function pendingDiv() {
    $(".pendingtask").empty()
    pending.forEach((item) => {
        const card = `<div class='list' > 
                            <div class="div1">
                            <input type="checkbox"  id="checkBox" onclick="checkBoxClick('${item.id}')"/> 
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
        $(".pendingtask").append(card)
    })
}

function completedDiv() {
    $(".completedtask").empty()
    completed.forEach((item) => {
        const card = `<div class='list' > 
                        <div class="div2">
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
        $(".completedtask").append(card)
    })
}