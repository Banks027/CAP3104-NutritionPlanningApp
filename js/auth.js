// Login sign up and logout

function doLogin() {
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    var hash = md5(password);
    document.getElementById("loginResult").innerHTML = "";
 
    let tmp = { Login: login, Password: hash };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/auth/Login.' + extension;
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
 
                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }
 
                FirstName = jsonObject.FirstName;
                LastName = jsonObject.LastName;
                saveCookie();
                window.location.href = "menu.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}
 
function doLogout() {
    userId = 0;
    FirstName = "";
    LastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}
 //Taking the user to sign up page
function doSignup() { 
    window.location.href = "SignUp.html";
}
 
  //Putting user info into a database, then takes user to login page
function addUser() {
    let FirstName = document.getElementById("FirstName").value;
    let LastName = document.getElementById("LastName").value;
    let User = document.getElementById("User").value;
    let Password = document.getElementById("Password").value;
    document.getElementById("NewAccount").innerHTML = "";
 
    //If field is empty show error message and doesn't add to database
    if (FirstName == "" || LastName == "" || User == "" || Password == "") {
        document.getElementById("NewAccount").innerHTML = "Please fill in all required fields.";
        return;
    }
 
    if (Password.length < 8) {
        document.getElementById("NewAccount").innerHTML = "Password must be at least 8 characters long.";
        return;
    }
 
    let hash = md5(Password);
    let tmp = { FirstName: FirstName, LastName: LastName, Login: User, Password: hash };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/auth/Signup.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log('Signup response status:', this.status);
                console.log('Signup response body:', xhr.responseText);
                if (this.status == 200) {
                    try {
                        let jsonObject = JSON.parse(xhr.responseText);
                        if (jsonObject.error && jsonObject.error !== "") {
                            document.getElementById("NewAccount").innerHTML = jsonObject.error;
                        } else {
                            document.getElementById("NewAccount").innerHTML = "User has been added";
                        }
                    } catch (parseErr) {
                        document.getElementById("NewAccount").innerHTML = "Invalid server response: " + xhr.responseText;
                    }
                } else {
                    document.getElementById("NewAccount").innerHTML = "Server error: " + this.status + " - " + xhr.responseText;
                }
            }
        };
        xhr.onerror = function () {
            document.getElementById("NewAccount").innerHTML = "Network error. Please try again.";
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("NewAccount").innerHTML = err.message;
    }
}
