<?php
require_once '../config/db.php';
require_once '../config/helpers.php';

setCORSHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
}

$body = getRequestBody();
if (empty($body) && !empty($_POST)) {
    $body = $_POST;
}

$Goal = normalizeSurveyValue($body['Goal'] ?? '', [
    'weightLoss' => 'Weight Loss',
    'muscleGain' => 'Muscle Gain',
    'maintain' => 'Maintain Weight',
    'generalHealth' => 'General Health',
]);
$DietaryRestrictions = normalizeSurveyList($body['DietaryRestrictions'] ?? '', [
    'vegetarian' => 'Vegetarian',
    'vegan' => 'Vegan',
    'glutenFree' => 'Gluten-Free',
    'dairyFree' => 'Dairy-Free',
    'nutAllergy' => 'Nut Allergy',
    'none' => 'None',
]);
$FavoriteCuisines = normalizeSurveyList($body['FavoriteCuisines'] ?? '', [
    'american' => 'American',
    'mexican' => 'Mexican',
    'italian' => 'Italian',
    'asian' => 'Asian',
    'mediterranean' => 'Mediterranean',
]);
$FoodsToAvoid = clean($body['FoodsToAvoid'] ?? '');
$Budget = normalizeSurveyValue($body['Budget'] ?? '', [
    'under5' => 'Under $5',
    '5to10' => '$5 - $10',
    'over10' => 'Over $10',
]);

if ($Goal === '' || $Budget === '') {
    respond(400, ['error' => 'Please choose a valid goal and budget']);
}

try {
    $db = getDB();
    $stmt = $db->prepare('INSERT INTO SurveyResponses (Goal, DietaryRestrictions, FavoriteCuisines, FoodsToAvoid, Budget)
         VALUES (:Goal, :DietaryRestrictions, :FavoriteCuisines, :FoodsToAvoid, :Budget)'
    );
    $stmt->execute([
        ':Goal' => $Goal,
        ':DietaryRestrictions' => $DietaryRestrictions,
        ':FavoriteCuisines' => $FavoriteCuisines,
        ':FoodsToAvoid' => $FoodsToAvoid,
        ':Budget' => $Budget,
    ]);

    respond(201, [
        'message' => 'Survey responses saved successfully',
        'response_id' => (int) $db->lastInsertId(),
    ]);
} catch (PDOException $e) {
    respond(500, ['error' => 'Internal server error']);
}

function normalizeSurveyValue($value, array $map): string
{
    $cleanValue = clean(is_string($value) ? $value : '');

    if ($cleanValue === '') {
        return '';
    }

    return $map[$cleanValue] ?? $cleanValue;
}

function normalizeSurveyList($value, array $map): string
{
    if (is_array($value)) {
        $items = [];

        foreach ($value as $item) {
            $normalized = normalizeSurveyValue($item, $map);
            if ($normalized !== '') {
                $items[] = $normalized;
            }
        }

        return implode(', ', array_unique($items));
    }

    $cleanValue = clean(is_string($value) ? $value : '');
    if ($cleanValue === '') {
        return '';
    }

    if (strpos($cleanValue, ',') === false) {
        return $map[$cleanValue] ?? $cleanValue;
    }

    $parts = array_filter(array_map('trim', explode(',', $cleanValue)), static function ($item) {
        return $item !== '';
    });

    $normalizedParts = [];
    foreach ($parts as $part) {
        $normalizedParts[] = $map[$part] ?? $part;
    }

    return implode(', ', array_unique($normalizedParts));
}
