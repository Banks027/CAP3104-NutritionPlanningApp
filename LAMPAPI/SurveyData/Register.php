<?php
require_once '../config/db.php';
require_once '../config/helpers.php';
setCORSHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
}
$body = getRequestBody();

$Goal = clean($body['Goal'] ?? '');
$DietaryRestrictions = clean($body['DietaryRestrictions'] ?? '');
$FavoriteCuisines = clean($body['FavoriteCuisines'] ?? '');
$FoodsToAvoid = clean($body['FoodsToAvoid'] ?? '');
$Budget = clean($body['Budget'] ?? '');



if ($Goal === '' || $Budget === '' || $DietaryRestrictions === '' || $FavoriteCuisines === '' || $FoodsToAvoid === '') {
    respond(400, ['error' => 'Please fill out all fields']);
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

    respond(201, ['message' => 'Survey responses saved successfully', 'response_id' => (int) $db->lastInsertId()]);
} catch (PDOException $e) {
    respond(500, ['error' => 'Internal server error']);
}