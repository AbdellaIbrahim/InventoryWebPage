const url = "http://localhost:3000/post";
activeSession = {
    FirstName : '',
    UserName : ''
}

window.onload = function (){
    // Sending a Request to the server.
    $.post(url+'?data='+JSON.stringify({
        'actionType' : 'loadUsersDatabase'}));
}

function login(){
    var username = document.getElementById("usernameLogin").value;
    var password = document.getElementById("passwordLogin").value;
// Whenever a user attempts a login, a request goes to the server with username and password.
    $.post(url+'?data='+JSON.stringify({
        'actionType' : 'userLogin',
        'Username' : username,
        'Password' : password,
        'loginStatus' : ''
    }),response => {
        if(response.Status == 'Success'){
            Navigate();
        }else if(response.Status == 'Failed'){
            alert("Wrong Passowrd");
        }
    });
}
function Navigate(){
    window.location = "index2.html";
}


function signupAction(requestType){
    if(requestType == 'show'){
        document.getElementById("signupDiv").style.display = "block";
        document.getElementById("wrapper").style.filter = "blur(7px)";
    }else if(requestType == "hide"){
        document.getElementById("signupDiv").style.display = "none";
        document.getElementById("wrapper").style.filter = "initial";
    }
}

function infoVerification(sectionVerifi){
    var username = document.getElementById("usernameLogin").value;
    var passoword = document.getElementById("passwordLogin").value;
    var newUser  =  document.getElementById("username").value;
    if(sectionVerifi == 'login'){
        if(typeof(username) != 'undefined' && typeof(passoword) != 'undefined'){
            console.log("THIS WAS FIRST");
            return true;
        }else {
            return false;
        }
    }else if(sectionVerifi == 'signup'){
        // First test is to check if all fields are filled.
        var usernamesignup  =  document.getElementById("username").value;
        var password  =  document.getElementById("pswd").value;
        var password1  =  document.getElementById("pswd1").value;
        var firstName =  document.getElementById("fName").value;
        var lastName  =  document.getElementById("lName").value;
        if(usernamesignup == "undefined" || password == "undefined" || firstName == "undefined" || lastName == 'undefined' || password1 == 'undefined'){
            console.log(firstName,lastName,passoword,usernamesignup);
            return true;
        }else{
            return false;
        }
    }
}

function userNameCheck(newUserID){
    return new Promise((resolve,reject) => {
        $.post(url+'?data='+JSON.stringify({
            'actionType' : 'newUserCheck',
            'newUser' : newUserID
            }), response =>{
                console.log(response.Status);
                if(response.Status == true){
                    resolve(true);
                }else if(response.Status == false){
                    resolve(false);
                }else{
                    resolve(1);
                }
            })
            
    })
}

function newUser(){ // Grabbing new user Information.

    var userInfo = {
        Username : document.getElementById("username").value,
        Password : document.getElementById("pswd").value,
        FirstName : document.getElementById("fName").value,
        LastName : document.getElementById("lName").value,
        AcessLevel : '',
    }

    // Running new user verification.
    var infoverifi1 = infoVerification('signup');
    infov = Promise.all([userNameCheck(userInfo.Username)]);
    infov.then((value) => {
        console.log(value);
        if(infoverifi1 == false && value[0] == false){
            $.post(url+'?data='+JSON.stringify({
                'actionType' : 'addNewUser',
                userInfo})); // Finally, send new user information to server and make a signup attempt.
            alert("New user was made sucessfully.");
        }else{
            alert("Check your Input");
        }
    });
    
}
function forceNewUser(){
    var userInfo = {
        Username : document.getElementById("username").value,
        Password : document.getElementById("pswd").value,
        FirstName : document.getElementById("fName").value,
        LastName : document.getElementById("lName").value,
        AccessLevel : '',
    }
    $.post(url+'?data='+JSON.stringify({
        'actionType' : 'addNewUser',
        userInfo})); // Finally, send new user information to server and make a signup attempt.
    alert("New user was made sucessfully.");
}

// INDEX 2 JS CODE!!
