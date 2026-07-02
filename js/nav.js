setupConfig();

// Simply navigating the page

function foodMenu() {
    // was colorsMenu() -> now points at the food page instead of color.html
    window.location.href = "food.html";
}
 
function contactsMenu() {
    window.location.href = "contacts.html";
}
 
function goHome() {
    window.location.href = "index.html";
}
 
function goBack() {
    window.location.href = "menu.html";
}
 
function doSignup() { // takes user to sign up page
    window.location.href = "SignUp.html";
}