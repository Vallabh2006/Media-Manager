<?php

try {
    $host = "localhost";
    $port = 3307;
    $password = '';
    $database = 'M_Manager';
    $table = 'login_credentials'; #id name pass

    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4",
        "root",
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

} catch (PDOException $e) {

    if ($_SERVER['SERVER_NAME'] === 'localhost') {
        die("DB Error: " . $e->getMessage());
    } else {
        die("Database connection failed");
    }

}

?>