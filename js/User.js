var urlBase = window.urlBase || 'https://lampsxyz.online/LAMPAPI';
var extension = window.extension || 'php';
var userId = window.userId || 0;
var FirstName = window.FirstName || "";
var LastName = window.LastName || "";
var currentContact = window.currentContact || null;
var currentFood = window.currentFood || null;

setupConfig();

function addUser() { // puts user info into database, then takes user to login page
    let FirstName = document.getElementById("FirstName").value;
    let LastName = document.getElementById("LastName").value;
    let User = document.getElementById("User").value;
    let Password = document.getElementById("Password").value;
    document.getElementById("NewAccount").innerHTML = "";

    // if fields are empty, then we show error message and do not add user to database
    if (FirstName == "" || LastName == "" || User == "" || Password == "") {
        document.getElementById("NewAccount").innerHTML = "Please fill in all required fields.";
        return;
    }

    if (Password.length < 8) {
        document.getElementById("NewAccount").innerHTML = "Password must be at least 8 characters long.";
        return;
    }

    let hash = md5(Password);
    let tmp = {FirstName:FirstName, LastName:LastName, Login:User, Password:hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/auth/Signup.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
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
        xhr.onerror = function() {
            document.getElementById("NewAccount").innerHTML = "Network error. Please try again.";
        };
        xhr.send(jsonPayload);
    } catch(err) {
        document.getElementById("NewAccount").innerHTML = err.message;
    }
}
