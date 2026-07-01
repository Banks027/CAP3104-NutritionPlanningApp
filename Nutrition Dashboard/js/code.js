const urlBase = 'https://lampsxyz.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let FirstName = "";
let LastName = "";
let currentContact = null; // Store the currently selected contact for editing
//--------------------------------------------------------------------
function colorsMenu(){
        window.location.href = "color.html";
}
function contactsMenu(){
        window.location.href = "contacts.html";
}

function goHome()
{
        window.location.href = "index.html";
        }
 function goBack()
{
        window.location.href = "menu.html";
}
//--------------------------------------------------------------------
function doLogin()
{

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    var hash = md5(password);
    document.getElementById("loginResult").innerHTML = "";


    let tmp = {Login:login,Password:hash};

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/auth/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function()  {

            if (this.readyState == 4 && this.status == 200){
        let jsonObject= JSON.parse(xhr.responseText);
        userId= jsonObject.id;

      if (userId<1){
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                 }

                    FirstName = jsonObject.FirstName;
                    LastName = jsonObject.LastName;
                    saveCookie();
                    window.location.href="menu.html";
      }
    };
    xhr.send(jsonPayload);

    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}



function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    let expires = ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "firstName=" + FirstName + expires;
    document.cookie = "lastName=" + LastName + expires;
    document.cookie = "userId=" + userId + expires;
}


function readCookie()
{
    userId = -1;
    let data = document.cookie;
    let splits = data.split(";");
    for (var i = 0; i < splits.length; i++)
    {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName")
        {
            FirstName = tokens[1];
        }
        else if (tokens[0] == "lastName")
        {
            LastName = tokens[1];
        }
        else if (tokens[0] == "userId")
        {
            userId = parseInt(tokens[1].trim(), 10);
        }
    }
    if (!Number.isInteger(userId) || userId < 1)
    {
        window.location.href = "index.html";
    }
    else
    {
        let userNameElem = document.getElementById("userName");
        if (userNameElem) {
            userNameElem.innerHTML = "Welcome " + FirstName + " " + LastName;
        }
    }
}


function doLogout()
{
    userId = 0;
    FirstName = "";
    LastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}



function addColor() {
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    let tmp = {Color:newColor,UserId:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/colors/AddColor.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                document.getElementById("colorAddResult").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }
    }

function searchColor() {

    let srch = document.getElementById("searchText").value;
    document.getElementById("colorSearchResult").innerHTML = "";
    //document.getElementById("colorList").innerHTML = "";

    let colorList = "";

    let tmp = {search:srch,userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/colors/SearchColors.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("colorSearchResult").innerHTML = jsonObject.error;
                    document.getElementById("colorList").innerHTML = "";
                    return;
                }

                if (!jsonObject.results || jsonObject.results.length === 0) {
                    document.getElementById("colorSearchResult").innerHTML = "No results found.";
                    document.getElementById("colorList").innerHTML = "";
                    return;
                }

                document.getElementById("colorSearchResult").innerHTML = "Color(s) have been retrieved.";

                for (let i = 0; i < jsonObject.results.length; i++) {
                    colorList += jsonObject.results[i].Colors;
                    if (i < jsonObject.results.length - 1) {
                        colorList += "<br />\r\n";
                    }
                }
                const colorListElem = document.getElementById("colorList");
                if (colorListElem) {
                    colorListElem.innerHTML = colorList;
                }
            }
        };

        xhr.send(jsonPayload);
    } catch(err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }

}
//--------------------------------------------------------------------
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

    let tmp = {SearchF:srchFirst,SearchL:srchLast,userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/contacts/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onerror = function() {
        document.getElementById("contactSearchResult").innerHTML = "Network error while searching contacts.";
        document.getElementById("contactSearchResult").style.display = "block";
    };
    xhr.ontimeout = function() {
        document.getElementById("contactSearchResult").innerHTML = "Request timed out while searching contacts.";
        document.getElementById("contactSearchResult").style.display = "block";
    };
    try {
        xhr.onreadystatechange = function() {
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
                       // document.getElementById("contactSearchResult").innerHTML = "Contact has been retrieved";
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
                        // Store the first contact for editing
                        if (jsonObject.results.length >= 1) {
                            currentContact = jsonObject.results[0];
                            // Pre-populate edit form with current contact info
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
    catch(err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
        document.getElementById("contactSearchResult").style.display = "block";
    }
}


function deleteContact() { // ///contact to del in book
    // Determine which contact to delete: prefer the selected contact, otherwise use form inputs
    let first = currentContact ? currentContact.FirstName : document.getElementById("contactAddFirst").value;
    let last = currentContact ? currentContact.LastName : document.getElementById("contactAddLast").value;
    if (!first || !last) {
        document.getElementById("contactDelResult").innerHTML = "Contact not found. Please search for a valid contact first or fill in the first and last name.";
        return;
    }

    document.getElementById("contactDelResult").innerHTML = "";

    let tmp = {FirstName: first, LastName: last, userId: userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/contacts/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("contactDelResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("contactDelResult").innerHTML = "Contact deleted";
                    // clear UI
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
    } catch(err) {
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
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("contactAddResult").innerHTML = "Error: " + jsonObject.error;
                } else {
                    document.getElementById("contactAddResult").innerHTML = "Contact updated successfully";
                    // Clear the current contact and form
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
    } catch(err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}


function addContact() { ///contact to book

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

    let tmp = {FirstName:FirstName, LastName:LastName, Phone: Phone, Email:Email, userId:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/contacts/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                document.getElementById("contactAddResult").innerHTML = "Contact has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }

}


//--------------------------------------------------------------------

function doSignup() { // takes user to sign up page
    window.location.href = "SignUp.html";
}

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

/* ================================================================
   🆕 NUTRITION DASHBOARD FUNCTIONS (ADDED FOR menu.html)
   ================================================================ */

// DATE DISPLAY
function displayCurrentDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date();
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// DASHBOARD DATA LOADER
function loadDashboardData() {
    const mockData = {
        caloriesEaten: 1350,
        caloriesGoal: 2100,
        proteinEaten: 92,
        proteinGoal: 150,
        meals: [
            { id: 1, name: 'Berry Oatmeal', type: 'Breakfast', calories: 420, protein: 28 },
            { id: 2, name: 'Lemon Chicken Bowl', type: 'Lunch', calories: 520, protein: 38 },
            { id: 3, name: 'Garlic Salmon & Veggies', type: 'Dinner', calories: 460, protein: 32 },
            { id: 4, name: 'Greek Yogurt & Almonds', type: 'Snacks', calories: 150, protein: 12 }
        ],
        groceryItems: ['Milk', 'Chicken Breast', 'Greek Yogurt'],
        weekData: [
            { day: 'MON', calories: 12 },
            { day: 'TUE', calories: 13 },
            { day: 'WED', calories: 14 },
            { day: 'THU', calories: 15 },
            { day: 'FRI', calories: 16 },
            { day: 'SAT', calories: 17 },
            { day: 'SUN', calories: 18 }
        ],
        suggestions: [
            { name: 'High Protein Power Bowl', calories: 520, protein: 40 },
            { name: 'Turkey & Veggie Pasta', calories: 480, protein: 35 },
            { name: 'Berry Protein Smoothie', calories: 320, protein: 28 }
        ]
    };
    updateDashboard(mockData);
}

// DASHBOARD RENDERER
function updateDashboard(data) {
    const caloriesEaten = document.getElementById('caloriesEaten');
    const caloriesGoal = document.getElementById('caloriesGoal');
    const proteinEaten = document.getElementById('proteinEaten');
    const proteinGoal = document.getElementById('proteinGoal');

    if (caloriesEaten) caloriesEaten.textContent = data.caloriesEaten.toLocaleString();
    if (caloriesGoal) caloriesGoal.textContent = data.caloriesGoal.toLocaleString();
    if (proteinEaten) proteinEaten.textContent = data.proteinEaten;
    if (proteinGoal) proteinGoal.textContent = data.proteinGoal;

    const calPercent = Math.min(Math.round((data.caloriesEaten / data.caloriesGoal) * 100), 100);
    const protPercent = Math.min(Math.round((data.proteinEaten / data.proteinGoal) * 100), 100);

    const caloriesProgress = document.getElementById('caloriesProgress');
    const caloriesPercent = document.getElementById('caloriesPercent');
    const proteinProgress = document.getElementById('proteinProgress');
    const proteinPercent = document.getElementById('proteinPercent');

    if (caloriesProgress) caloriesProgress.style.width = calPercent + '%';
    if (caloriesPercent) caloriesPercent.textContent = calPercent + '%';
    if (proteinProgress) proteinProgress.style.width = protPercent + '%';
    if (proteinPercent) proteinPercent.textContent = protPercent + '%';

    renderMeals(data.meals);
    renderGroceryList(data.groceryItems);
    renderWeeklyOverview(data.weekData);
    renderSuggestions(data.suggestions);

    const groceryCount = document.getElementById('grocery-count');
    if (groceryCount) groceryCount.textContent = data.groceryItems.length;
}

// MEAL RENDERER
function renderMeals(meals) {
    const container = document.getElementById('meal-container');
    if (!container) return;

    if (!meals || meals.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #888;">
                <p>No meals logged today</p>
            </div>
        `;
        return;
    }

    container.innerHTML = meals.map(meal => `
        <div class="meal-card" data-meal-id="${meal.id}">
            <div>
                <div class="meal-name">${getMealEmoji(meal.type)} ${meal.name}</div>
                <div class="meal-details">${meal.type}</div>
            </div>
            <div class="meal-calories">${meal.calories} kcal · ${meal.protein}g protein</div>
        </div>
    `).join('');
}

// GROCERY LIST RENDERER
function renderGroceryList(items) {
    const container = document.getElementById('grocery-items');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `<span style="color: #888; font-size: 14px;">No items in your grocery list</span>`;
        return;
    }

    container.innerHTML = items.map(item => 
        `<span class="grocery-tag">${getGroceryEmoji(item)} ${item}</span>`
    ).join('');
}

// WEEKLY OVERVIEW
function renderWeeklyOverview(weekData) {
    const container = document.getElementById('week-container');
    if (!container) return;

    if (!weekData || weekData.length === 0) {
        container.innerHTML = '<div style="color: #888;">No data available</div>';
        return;
    }

    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;

    container.innerHTML = weekData.map((day, index) => {
        const isToday = index === todayIndex;
        return `
            <div class="week-day${isToday ? ' today' : ''}">
                <div class="day">${day.day}</div>
                <div class="date">${day.calories}</div>
            </div>
        `;
    }).join('');
}

// SUGGESTIONS
function renderSuggestions(suggestions) {
    const container = document.getElementById('suggestions-container');
    if (!container) return;

    if (!suggestions || suggestions.length === 0) {
        container.innerHTML = `<div style="color: #888; text-align: center; padding: 10px;">No suggestions available</div>`;
        return;
    }

    container.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-card">
            <div>
                <div class="suggestion-name">${getSuggestionEmoji(suggestion.name)} ${suggestion.name}</div>
                <div class="suggestion-details">${suggestion.calories} kcal · ${suggestion.protein}g protein</div>
            </div>
        </div>
    `).join('');
}

// EMOJI HELPERS
function getMealEmoji(type) {
    const emojis = { 'Breakfast': '🌅', 'Lunch': '☀️', 'Dinner': '🌙', 'Snacks': '🍿', 'Snack': '🍿' };
    return emojis[type] || '🍽️';
}

function getGroceryEmoji(item) {
    const emojis = { 
        'Milk': '🥛', 'Chicken Breast': '🍗', 'Greek Yogurt': '🥛',
        'Yogurt': '🥛', 'Eggs': '🥚', 'Bread': '🍞', 'Fruit': '🍎',
        'Apple': '🍎', 'Banana': '🍌', 'Vegetables': '🥬', 'Salad': '🥗',
        'Cheese': '🧀', 'Meat': '🥩', 'Fish': '🐟', 'Salmon': '🐟'
    };
    return emojis[item] || '🛒';
}

function getSuggestionEmoji(name) {
    const emojis = { 
        'High Protein Power Bowl': '💪',
        'Turkey & Veggie Pasta': '🍝',
        'Berry Protein Smoothie': '🥤'
    };
    return emojis[name] || '✨';
}

// DASHBOARD NAVIGATION
function goToHomeDashboard() {
    loadDashboardData();
}
function goToPlan() {
    alert('📋 Plan page coming soon!');
}
function goToRecipes() {
    alert('📖 Recipes page coming soon!');
}
function goToProfile() {
    alert('👤 Profile page coming soon!');
}

// QUICK ADD
function addMeal() {
    alert('➕ Add meal functionality coming soon!');
}
function addFood() {
    alert('🍎 Add food functionality coming soon!');
}
function addRecipe() {
    alert('📖 Add recipe functionality coming soon!');
}
function scanBarcode() {
    alert('📷 Barcode scanner coming soon!');
}

// REFRESH
function refreshDashboard() {
    loadDashboardData();
    const btn = document.getElementById('refreshBtn');
    if (btn) {
        btn.textContent = '✓ Updated!';
        setTimeout(() => { btn.textContent = '🔄 Refresh'; }, 2000);
    }
}

// ================================================================
//  DASHBOARD INITIALIZATION (Only runs on menu.html)
// ================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Check if we're on the dashboard page by looking for #dashboard
    if (document.getElementById('dashboard')) {
        // Initialize dashboard
        readCookie();
        displayCurrentDate();
        loadDashboardData();
        
        // Event listeners for dashboard elements
        document.getElementById("refreshBtn")?.addEventListener("click", refreshDashboard);
        document.getElementById("addMealBtn")?.addEventListener("click", addMeal);
        document.getElementById("addFoodBtn")?.addEventListener("click", addFood);
        document.getElementById("addRecipeBtn")?.addEventListener("click", addRecipe);
        document.getElementById("scanBarcodeBtn")?.addEventListener("click", scanBarcode);
        document.getElementById("navHome")?.addEventListener("click", goToHomeDashboard);
        document.getElementById("navPlan")?.addEventListener("click", goToPlan);
        document.getElementById("navRecipes")?.addEventListener("click", goToRecipes);
        document.getElementById("navProfile")?.addEventListener("click", goToProfile);
        document.getElementById("logoutButton")?.addEventListener("click", doLogout);
    }
    // Existing pages (login, signup, contacts, colors) continue to work as before
});