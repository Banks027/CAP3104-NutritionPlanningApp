<<<<<<< HEAD

=======
>>>>>>> b42e6e5cbdde0aa879ed8f412dbd6b1dc66640d8
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
 
    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/food/SearchFood.' + extension;
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
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
                        foodList += "<br />\r\n";
                    }
                }
                const foodListElem = document.getElementById("foodList");
                if (foodListElem) {
                    foodListElem.innerHTML = foodList;
                }
            }
        };
 
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("foodSearchResult").innerHTML = err.message;
    }
}
