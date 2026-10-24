<?php
require_once __DIR__ . '/../config/database.php';

// Créer la table si elle n'existe pas
$createTable = "
CREATE TABLE IF NOT EXISTS visits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    count INT DEFAULT 1,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
";
$pdo->exec($createTable);

// Insérer une ligne si elle n'existe pas
$check = $pdo->query("SELECT COUNT(*) FROM visits");
if ($check->fetchColumn() == 0) {
    $pdo->exec("INSERT INTO visits (count) VALUES (0)");
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Récupérer le nombre de visites
    $stmt = $pdo->query("SELECT count FROM visits LIMIT 1");
    $result = $stmt->fetch();
    echo json_encode(['visits' => $result ? (int)$result['count'] : 0]);
    exit();
}

if ($method === 'POST') {
    // Incrémenter le nombre de visites
    $pdo->exec("UPDATE visits SET count = count + 1, last_visit = CURRENT_TIMESTAMP");
    $stmt = $pdo->query("SELECT count FROM visits LIMIT 1");
    $result = $stmt->fetch();
    echo json_encode(['visits' => $result ? (int)$result['count'] : 0]);
    exit();
}
?>