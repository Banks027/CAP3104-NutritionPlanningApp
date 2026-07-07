// Foods
setupConfig();

// Foods
function deleteFood() {
    let first = currentFood ? currentFood.FirstName : document.getElementById("FoodAddFirst").value;
    let last = currentFood ? currentFood.LastName : document.getElementById("FoodAddLast").value;
    if (!first || !last) {
        document.getElementById("FoodDelResult").innerHTML = "Food not found. Please search for a valid Food first or fill in the first and last name.";
        return;
    }
 
    document.getElementById("FoodDelResult").innerHTML = "";
 
    let tmp = { FirstName: first, LastName: last, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/Foods/DeleteFood.' + extension;
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("FoodDelResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("FoodDelResult").innerHTML = "Food deleted";
                    currentFood = null;
                    document.getElementById("FoodAddFirst").value = "";
                    document.getElementById("FoodAddLast").value = "";
                    document.getElementById("FoodAddPhone").value = "";
                    document.getElementById("FoodAddEmail").value = "";
                    document.getElementById("FoodList").innerHTML = "";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("FoodDelResult").innerHTML = err.message;
    }
}
 
function editFood() {
    if (!currentFood) {
        document.getElementById("FoodAddResult").innerHTML = "Please search for a valid Food first.";
        return;
    }
 
    let newFirstName = document.getElementById("FoodAddFirst").value;
    let newLastName = document.getElementById("FoodAddLast").value;
    let Phone = document.getElementById("FoodAddPhone").value;
    let Email = document.getElementById("FoodAddEmail").value;
    document.getElementById("FoodAddResult").innerHTML = "";
 
    if (newFirstName == "" || newLastName == "" || Phone == "") {
        document.getElementById("FoodAddResult").innerHTML = "Please fill in all required fields.";
        return;
    }
 
    let url = urlBase + '/Foods/EditFood.' + extension;
 
    let tmp = {
        oldFirstName: currentFood.FirstName,
        oldLastName: currentFood.LastName,
        FirstName: newFirstName,
        LastName: newLastName,
        Phone: Phone,
        Email: Email,
        userId: userId
    };
    let jsonPayload = JSON.stringify(tmp);
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
 
                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("FoodAddResult").innerHTML = "Error: " + jsonObject.error;
                } else {
                    document.getElementById("FoodAddResult").innerHTML = "Food updated successfully";
                    currentFood = null;
                    document.getElementById("FoodAddFirst").value = "";
                    document.getElementById("FoodAddLast").value = "";
                    document.getElementById("FoodAddPhone").value = "";
                    document.getElementById("FoodAddEmail").value = "";
                    document.getElementById("FoodList").innerHTML = "";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("FoodAddResult").innerHTML = err.message;
    }
}
 
function addFood() {
    let FirstName = document.getElementById("FoodAddFirst").value;
    let LastName = document.getElementById("FoodAddLast").value;
    let Phone = document.getElementById("FoodAddPhone").value;
    let Email = document.getElementById("FoodAddEmail").value;
    document.getElementById("FoodAddResult").innerHTML = "";
 
    if (FirstName == "" || LastName == "" || Phone == "") {
        document.getElementById("FoodAddResult").innerHTML = "Please fill in all required fields.";
        return;
    }
 
    document.getElementById("FoodAddResult").innerHTML = "";
 
    let tmp = { FirstName: FirstName, LastName: LastName, Phone: Phone, Email: Email, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/Foods/AddFood.' + extension;
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("FoodAddResult").innerHTML = "Food has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("FoodAddResult").innerHTML = err.message;
    }
}
