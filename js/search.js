document.addEventListener("DOMContentLoaded", function ()
{
    const form = document.getElementById("searchForm");

    form.addEventListener("submit", function (e)
    {
        e.preventDefault();

        let search = document.getElementById("searchInput").value.trim();

        let mealTypes = [];
        document.querySelectorAll("input[name='mealType']:checked").forEach(cb =>
        {
            mealTypes.push(cb.value);
        });

        let budget = [];
        document.querySelectorAll("input[name='budget']:checked").forEach(cb =>
        {
            budget.push(cb.value);
        });

        let payload =
        {
            search: search,
            mealTypes: mealTypes,
            budget: budget
        };

        let url = urlBase + "/search/Search." + extension;

        let xhr = new XMLHttpRequest();

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4)
            {
                if (xhr.status === 200)
                {
                    let foods = JSON.parse(xhr.responseText);
                    displayResults(foods);
                }
                else
                {
                    console.log(xhr.responseText);
                }
            }
        };

        xhr.send(JSON.stringify(payload));
    });
});

function displayResults(results)
{
    let container = document.getElementById("searchResults");

    container.innerHTML = "";

    if (results.length === 0)
    {
        container.innerHTML = "<p>No foods found.</p>";
        return;
    }

    results.forEach(food =>
    {
        container.innerHTML += `
            <div class="search-result">
            <img class="food-image" src="${food.Image}" alt="${food.FoodName}">
                <div class="food-info">
                    <h3>${food.FoodName}</h3>
                    <p>$${food.MealCost}</p>
                </div>
            </div>
        `;
    });
}
