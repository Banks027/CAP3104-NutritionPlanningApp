<<<<<<< HEAD
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
=======
// The Config of the website aka
// ALL THE SHARED SETTINGS AND GLOBAL STATES

const urlBase = 'https://lampsxyz.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let FirstName = "";
let LastName = "";
let currentContact = null; //temp contact
>>>>>>> b42e6e5cbdde0aa879ed8f412dbd6b1dc66640d8
