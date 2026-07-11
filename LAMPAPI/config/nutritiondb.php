<?php

define('NUTRITION_DB_HOST', 'localhost');
define('NUTRITION_DB_NAME', 'Nutrition');
define('NUTRITION_DB_USER', 'root');
define('NUTRITION_DB_PASS', '5bd1b27ee559b1b75c0b934cd93d17a94f389cba9b6fa1d5');
define('NUTRITION_DB_CHARSET', 'utf8mb4');

function getNutritionDB(): PDO
{
    static $pdo = null;

    if ($pdo === null)
    {
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            NUTRITION_DB_HOST,
            NUTRITION_DB_NAME,
            NUTRITION_DB_CHARSET
        );

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $pdo = new PDO(
                $dsn,
                NUTRITION_DB_USER,
                NUTRITION_DB_PASS,
                $options
            );
        }
        catch (PDOException $e)
        {
            respond(500, ['error' => 'Nutrition database connection failed']);
        }
    }

    return $pdo;
}
