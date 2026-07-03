setupConfig();

function addFood() {
    let newFood = document.getElementById("foodText").value;
    document.getElementById("foodAddResult").innerHTML = "";
 
    let tmp = { Food: newFood, UserId: userId };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/food/AddFood.' + extension;
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("foodAddResult").innerHTML = "Food has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("foodAddResult").innerHTML = err.message;
    }
}
 
function searchFood() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("foodSearchResult").innerHTML = "";
 
    let foodList = "";
 
    if (!Number.isInteger(userId) || userId < 1) {
        document.getElementById("foodSearchResult").innerHTML = "You must be logged in to search foods.";
        document.getElementById("foodSearchResult").style.display = "block";
        return;
    }

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/food/SearchFood.' + extension;
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
     xhr.onerror = function () {
        document.getElementById("contactSearchResult").innerHTML = "Network error while searching contacts.";
        document.getElementById("contactSearchResult").style.display = "block";
    };
    xhr.ontimeout = function () {
        document.getElementById("contactSearchResult").innerHTML = "Request timed out while searching contacts.";
        document.getElementById("contactSearchResult").style.display = "block";
    };
    
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
 
                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("foodSearchResult").innerHTML = jsonObject.error;
                    document.getElementById("foodList").innerHTML = "";
                    return;
                }
 
                if (!jsonObject.results || jsonObject.results.length === 0) {
                    document.getElementById("foodSearchResult").innerHTML = "No results found.";
                    document.getElementById("foodList").innerHTML = "";
                    return;
                }
 
                document.getElementById("foodSearchResult").innerHTML = "Food item(s) have been retrieved.";
 
                for (let i = 0; i < jsonObject.results.length; i++) {
                    foodList += jsonObject.results[i].Food;
                    if (i < jsonObject.results.length - 1) {
                        foodList += "<hr />";
                    }
                
                    document.getElementById("ContactList").innerHTML = contactList;
                        if (jsonObject.results.length >= 1) {
                            currentContact = jsonObject.results[0];
                            document.getElementById("contactAddFirst").value = currentContact.FirstName;
                            document.getElementById("contactAddLast").value = currentContact.LastName;
                            document.getElementById("contactAddPhone").value = currentContact.Phone;
                            document.getElementById("contactAddEmail").value = currentContact.Email;
                        
                            document.getElementById("ContactBook").style.display = "block";
                            return true;
                    
                        } else {
                            document.getElementById("contactSearchResult").innerHTML = "Server error: " + this.status;
                            document.getElementById("contactSearchResult").style.display = "block";
                            return false;
                                }
           
                            } 
        };
 
        xhr.send(jsonPayload);
    
        }
     } catch (err) {
       
        document.getElementById("foodSearchResult").innerHTML = "Server error: " + this.status;
        document.getElementById("foodSearchResult").style.display = "block";
        return false;
        
    }
}
