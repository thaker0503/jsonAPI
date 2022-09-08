const user = "yatharth"
const url = `https://internapp.vercel.app/${user}/todos/`

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes();


today = dd + '/' + mm + '/' + yyyy ;
// today = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    
    let pending = [],
        completed = [];

    function pendingDiv() {
        $(".pendingtask").empty()
        pending.forEach((item) => {
            // console.log("Pending For Each")
            const card = `<div class='list' > 
                            <div class="div1">
                            <input type="checkbox"  onclick="checkBoxClick('${item.id}')" id="checkBox"/> 
                            <div>
                                <span class="title">${item.title}</span> 
                                <span class="desc">${item.description}</span> 
                            </div>
                            <span>Created on: ${today}</span>
                            <button id="${item.id}" class='deleteBtn' onclick="del('${item.id}')""><i  class="fa-solid fa-trash-can close"></i></button>
                            </div>    
                            </div>
                            `
                            $(".pendingtask").append(card)
        })
    }
                    
    function completedDiv() {
            $(".completedtask").empty()
            completed.forEach((item) => {
            
                // console.log("completed For Each")
                const card = `<div class='list' > 
                        <div class="div2">
                            <input type="checkbox"  onclick="checkBoxClick('${item.id}')" id="checkBox" checked/> 
                            <div>
                            <span class="title">${item.title}</span> 
                            <span class="desc">${item.description}</span> 
                            </div>
                            <span>Created on: ${today}</span>
                            <button id="${item.id}" class='deleteBtn' onclick="del('${item.id}')""><i  class="fa-solid fa-trash-can close"></i></button>
                        </div>    
                        </div>
                    `
                $(".completedtask").append(card)
        })
    }

        

        function trueValue(final) {
            // console.log("True Value")
            $.ajax({
                url: final,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    completed: true
                }),
                success:
                    function () {
                        // console.log("Success")
                        // console.log(data)
                        getList()
                        // completedDiv()
                        // pendingDiv()
                        // window.location.reload()
                    }
            })
        }

        function falseValue(final) {
            // console.log("False")
            $.ajax({
                url: final,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    completed: false
                }),
                success:
                    function () {
                        // console.log("Success")
                        // console.log(data)
                        getList()
                        // pendingDiv()
                        // completedDiv()
                        // window.location.reload()
                    }


            })
        }


        function checkBoxClick(id) {
            // console.log("Function Called")
            // console.log(url + id)
            const final = url + id
            // var param
            $.get({
                url: url + id,
                success: function (data) {
                    // console.log(data)
                    // param = data
                    // console.log(param.title)
                    // console.log(param.description)
                    // console.log(param.id)
                    // console.log(data.completed)
                    data.completed ? falseValue(final) : trueValue(final)
                    
                }
            })
            

        }



        




        
    // $(document).ready(function(){
        $(".error").hide()
        // $(".list").children().sortable()

            function del(id) {
                // console.log("Function Called")
                // console.log(url + id)
                const final = url + id
                $.ajax({
                    url: final,
                    type: 'DELETE',
                    success: function (data) {
                        // console.log(data)
                        
                        pendingDiv()
                        completedDiv()
                        getList();
                        // window.location.reload();
                    }
                })
            }
            
            // $(`<a href='${url}'>Link</a>`).appendTo("#todo")

            // $("#todoList").tabs({
            //     active: 0
            // });
            // $(".div1").sortable({ axis: "y", containment: '.pendingtask' })
            $("#datepicker").datepicker({
                showOn: "button",
                buttonImage: "./images/calendar.jpg",
                buttonImageWidth : "30px",
                buttonImageOnly: true,
                buttonText: "Select date"
            })
            $(".ui-datepicker-trigger").css({
                width: '25px',
                position: 'absolute',
                right: '0',
                top: '6px',
                cursor : 'pointer'
                
            });

            

            getList();
            


            function getList() {

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
                            
                            
                            // console.log(item.completed)
                            if (item.completed) {
                                completed.unshift(item)
                                // console.log("Completed Task:" + JSON.stringify(completed))
                                // $("<p>No tasks pending...</p>").appendTo(".pending")
                                // $(".completedtask").empty()
                                // $(card1).appendTo(".completedtask")
                                // $(".desc").hide()
                                // $(".div2").click(function(){
                                    //     $(this).siblings().toggle("slow")
                                    // })
                                } else {
                                    
                                    pending.push(item)
                                    // console.log("Pending Task:" + JSON.stringify(pending))
                                    // $("<p>Complete your pending tasks</p>").appendTo(".completed")
                                    // $(".pending").append(`<li><input id='checkBox' type='checkbox' onclick="checkBoxClick('${item.id}')"/> <p>Title: ${item.title} <br> Description: ${item.description}</p></li>`)
                                    // $(".pendingtask").empty()
                                    // $(".pendingtask").append(card)
                                    // $(".desc").hide()
                                    // $(".div1").click(function () {
                                        //     // $(this).siblings().toggle("slow")
                                        // })
                                    }
                                })
                                pendingDiv()
                                completedDiv()
                    }
                })
            }

            



            $("#addTask").click(function (e) {
                e.preventDefault();
                let product = {
                    title: $("#title").val(),
                    description: $("#description").val(),
                    completed: false
                };
                // console.log(product);
                var newProduct = JSON.stringify(product);
                if (product.title != "" && product.description != "") {
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: newProduct,
                        contentType: "application/json",
                        success: function () {
                            // console.log(data);
                            // $("form").dialog("close");
                            $("#title").val("").focus()
                            $("#description").val("")
                            
                                // $(".pendingtask").empty()
                                // $(".completedtask").empty()
                            getList();
                            // window.location.reload()
                            // $("ul").append(`<li>Name: ${data.name},<br/>Price: ${data.price},<br/>Description: ${data.desc}<br/><button>Edit</button></li><br/>`);
                        }
                    });
                } else {
                    // alert("Enter Values")
                    $(".error").show("slow")
                }
            }).css({
                width: '50%',
                cursor: 'pointer'

            })
        // })


            // $("input[type=checkbox]").prop(":checked",function(){

            // })

        












        // function notifyMe() {
        //         if (!("Notification" in window)) {
        //             alert("This browser does not support desktop notification");
        //         } else if (Notification.permission !== "denied") {
        //             Notification.requestPermission().then((permission) => {
        //                 if (permission === "granted") {
        //                     const notification = new Notification("Hi there!");
        //                 }
        //             });
        //         }
        //     }