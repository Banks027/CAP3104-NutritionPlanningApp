// Contacts

function searchContact() {
    let srchFirst = document.getElementById("ContactFirstSearch").value;
    let srchLast = document.getElementById("ContactLastSearch").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    document.getElementById("contactSearchResult").style.display = "block";
 
    let contactList = "";
 
    if (!Number.isInteger(userId) || userId < 1) {
        document.getElementById("contactSearchResult").innerHTML = "You must be logged in to search contacts.";
        document.getElementById("contactSearchResult").style.display = "block";
        return;
    }
 
    let tmp = { SearchF: srchFirst, SearchL: srchLast, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/contacts/SearchContacts.' + extension;
 
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
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error && jsonObject.error !== "") {
                        document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                        document.getElementById("contactSearchResult").style.display = "block";
                        document.getElementById("ContactList").innerHTML = "";
                        currentContact = null;
                    } else if (!jsonObject.results || jsonObject.results.length === 0) {
                        document.getElementById("contactSearchResult").innerHTML = "No results found.";
                        document.getElementById("contactSearchResult").style.display = "block";
                        document.getElementById("ContactList").innerHTML = "";
                        currentContact = null;
                    } else {
                        for (let i = 0; i < jsonObject.results.length; i++) {
                            let contact = jsonObject.results[i];
                            contactList += "<h3>" + contact.FirstName + " " + contact.LastName + "</h3>";
                            contactList += "<p>Phone: " + contact.Phone + "</p>";
                            contactList += "<p>Email: " + contact.Email + "</p>";
                            if (i < jsonObject.results.length - 1) {
                                contactList += "<hr />";
                            }
                        }
                        document.getElementById("ContactList").innerHTML = contactList;
                        if (jsonObject.results.length >= 1) {
                            currentContact = jsonObject.results[0];
                            document.getElementById("contactAddFirst").value = currentContact.FirstName;
                            document.getElementById("contactAddLast").value = currentContact.LastName;
                            document.getElementById("contactAddPhone").value = currentContact.Phone;
                            document.getElementById("contactAddEmail").value = currentContact.Email;
                        }
                        document.getElementById("ContactBook").style.display = "block";
                        return true;
                    }
                } else {
                    document.getElementById("contactSearchResult").innerHTML = "Server error: " + this.status;
                    document.getElementById("contactSearchResult").style.display = "block";
                    return false;
                }
            }
        };
 
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
        document.getElementById("contactSearchResult").style.display = "block";
    }
}
 
function deleteContact() {
    let first = currentContact ? currentContact.FirstName : document.getElementById("contactAddFirst").value;
    let last = currentContact ? currentContact.LastName : document.getElementById("contactAddLast").value;
    if (!first || !last) {
        document.getElementById("contactDelResult").innerHTML = "Contact not found. Please search for a valid contact first or fill in the first and last name.";
        return;
    }
 
    document.getElementById("contactDelResult").innerHTML = "";
 
    let tmp = { FirstName: first, LastName: last, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/contacts/DeleteContact.' + extension;
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("contactDelResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("contactDelResult").innerHTML = "Contact deleted";
                    currentContact = null;
                    document.getElementById("contactAddFirst").value = "";
                    document.getElementById("contactAddLast").value = "";
                    document.getElementById("contactAddPhone").value = "";
                    document.getElementById("contactAddEmail").value = "";
                    document.getElementById("ContactList").innerHTML = "";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactDelResult").innerHTML = err.message;
    }
}
 
function editContact() {
    if (!currentContact) {
        document.getElementById("contactAddResult").innerHTML = "Please search for a valid contact first.";
        return;
    }
 
    let newFirstName = document.getElementById("contactAddFirst").value;
    let newLastName = document.getElementById("contactAddLast").value;
    let Phone = document.getElementById("contactAddPhone").value;
    let Email = document.getElementById("contactAddEmail").value;
    document.getElementById("contactAddResult").innerHTML = "";
 
    if (newFirstName == "" || newLastName == "" || Phone == "") {
        document.getElementById("contactAddResult").innerHTML = "Please fill in all required fields.";
        return;
    }
 
    let url = urlBase + '/contacts/EditContact.' + extension;
 
    let tmp = {
        oldFirstName: currentContact.FirstName,
        oldLastName: currentContact.LastName,
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
                    document.getElementById("contactAddResult").innerHTML = "Error: " + jsonObject.error;
                } else {
                    document.getElementById("contactAddResult").innerHTML = "Contact updated successfully";
                    currentContact = null;
                    document.getElementById("contactAddFirst").value = "";
                    document.getElementById("contactAddLast").value = "";
                    document.getElementById("contactAddPhone").value = "";
                    document.getElementById("contactAddEmail").value = "";
                    document.getElementById("ContactList").innerHTML = "";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}
 
function addContact() {
    let FirstName = document.getElementById("contactAddFirst").value;
    let LastName = document.getElementById("contactAddLast").value;
    let Phone = document.getElementById("contactAddPhone").value;
    let Email = document.getElementById("contactAddEmail").value;
    document.getElementById("contactAddResult").innerHTML = "";
 
    if (FirstName == "" || LastName == "" || Phone == "") {
        document.getElementById("contactAddResult").innerHTML = "Please fill in all required fields.";
        return;
    }
 
    document.getElementById("contactAddResult").innerHTML = "";
 
    let tmp = { FirstName: FirstName, LastName: LastName, Phone: Phone, Email: Email, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
 
    let url = urlBase + '/contacts/AddContact.' + extension;
 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactAddResult").innerHTML = "Contact has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}
