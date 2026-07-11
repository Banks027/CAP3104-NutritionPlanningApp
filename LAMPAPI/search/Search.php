<?php
file_put_contents(
    "/tmp/search_debug.txt",
    "Search.php loaded\n",
    FILE_APPEND
);

require_once '../config/nutrition_db.php';
require_once '../config/helpers.php';

setCORSHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
}

$body = getRequestBody();

$search = trim($body['search'] ?? '');
$mealTypes = $body['mealTypes'] ?? [];
$budgets = $body['budget'] ?? [];

try {
    $db = getNutritionDB();

    $sql = "
        SELECT FoodName, Image, MealCost
        FROM Food
        WHERE 1=1
    ";

    $params = [];

    // Partial FoodName search
    if ($search !== '') {
        $sql .= " AND FoodName LIKE :search";
        $params[':search'] = '%' . $search . '%';
    }

    // Meal type filters
    $validColumns = [
        'Vegan',
        'DairyFree',
        'GlutenFree',
        'Garlic',
        'Caffeine',
        'Halal',
        'Kosher',
        'Vegetarian'
    ];

    foreach ($mealTypes as $type) {
        if (in_array($type, $validColumns)) {
            $sql .= " AND {$type} = 1";
        }
    }

    // Budget filters
    if (!empty($budgets)) {

        $budgetConditions = [];

        foreach ($budgets as $budget) {

            switch ($budget) {

                case '5':
                    $budgetConditions[] = "MealCost < 5";
                    break;

                case '5-10':
                    $budgetConditions[] = "MealCost BETWEEN 5 AND 10";
                    break;

                case '10plus':
                    $budgetConditions[] = "MealCost > 10";
                    break;
            }
        }

        if (!empty($budgetConditions)) {
            $sql .= " AND (" . implode(" OR ", $budgetConditions) . ")";
        }
    }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

   $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($foods as &$food) {
    $food['Image'] = str_replace(
        '/var/www/html',
        '',
        $food['Image']
    );
}

  respond(200, $foods); 

} catch (PDOException $e) {

    respond(500, [
        'error' => 'Search failed',
        'details' => $e->getMessage()
    ]);
}
