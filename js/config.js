var urlBase = window.urlBase || 'https://lampsxyz.online/LAMPAPI';
var extension = window.extension || 'php';
var userId = window.userId || 0;
var FirstName = window.FirstName || "";
var LastName = window.LastName || "";
var currentContact = window.currentContact || null;
var currentFood = window.currentFood || null;

// Shared globals for the browser scripts.
function setupConfig() {
	if (window.__nutritionAppGlobalsReady) {
		return;
	}

	window.__nutritionAppGlobalsReady = true;
	window.urlBase = urlBase;
	window.extension = extension;
	window.userId = userId;
	window.FirstName = FirstName;
	window.LastName = LastName;
	window.currentContact = currentContact;
	window.currentFood = currentFood;
}

window.setupConfig = setupConfig;
window.SetupConfig = setupConfig;
window.setupNutritionAppGlobals = setupConfig;
