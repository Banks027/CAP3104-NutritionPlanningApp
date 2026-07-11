setupConfig();

// Simply navigating the page

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
        //'Milk': '🥛', 'Chicken Breast': '🍗', 'Greek Yogurt': '🥛',
        //'Yogurt': '🥛', 'Eggs': '🥚', 'Bread': '🍞', 'Fruit': '🍎',
       // 'Apple': '🍎', 'Banana': '🍌', 'Vegetables': '🥬', 'Salad': '🥗',
        //'Cheese': '🧀', 'Meat': '🥩', 'Fish': '🐟', 'Salmon': '🐟'
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
    window.location.href = "../index.html";

}
function goToPlan() {
    alert('📋 Plan page coming soon!');
}
function goToRecipes() {
    alert('📖 Recipes page coming soon!');
}
function goToProfile() {
    window.location.href = "menu.html";
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
    
    
     document.getElementById('logoutButton').addEventListener('click', () => {
    // TODO: this page doesn't exist yet. Point at the real onboarding survey once it's built
    // (NFR2 flow: Budget -> Time available -> Dietary restrictions -> Nutrition goals -> main screen).
    // Placed flat at repo root to match how SignUp.html/menu.html are referenced elsewhere in auth.js/nav.js.
    window.location.href = '../index.html';
    });
});
