//Yum yum cookies but overall the save and read of the login session

<<<<<<< HEAD
setupConfig();
//Yum yum cookies but overall the save and read of the login session

=======
>>>>>>> b42e6e5cbdde0aa879ed8f412dbd6b1dc66640d8
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    let expires = ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "firstName=" + FirstName + expires;
    document.cookie = "lastName=" + LastName + expires;
    document.cookie = "userId=" + userId + expires;
}
 
function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(";");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            FirstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            LastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim(), 10);
        }
    }
    if (!Number.isInteger(userId) || userId < 1) {
        window.location.href = "index.html";
    }
    else {
        let userNameElem = document.getElementById("userName");
        if (userNameElem) {
            userNameElem.innerHTML = "Welcome " + FirstName + " " + LastName;
        }
    }
}
 
