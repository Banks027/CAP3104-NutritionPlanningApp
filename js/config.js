let LastName = "";
let currentContact = null; //temp contact
// Shared globals for the browser scripts.
function setupConfig() {
	if (window.__nutritionAppGlobalsReady) {
		return;
	}

	window.__nutritionAppGlobalsReady = true;
	window.urlBase = window.urlBase || 'https://lampsxyz.online/LAMPAPI';
	window.extension = window.extension || 'php';
	window.userId = window.userId || 0;
	window.FirstName = window.FirstName || "";
	window.LastName = window.LastName || "";
	window.currentContact = window.currentContact || null;
	window.currentFood = window.currentFood || null;
}

const SetupConfig = setupConfig;
const setupNutritionAppGlobals = setupConfig;
