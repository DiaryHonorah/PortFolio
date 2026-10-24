<?php
// Démarrer la session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Configuration des headers CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Gérer les requêtes OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Récupérer l'URI
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/portfolio/backend/', '', $path);
$path = trim($path, '/');
$segments = explode('/', $path);
$route = isset($segments[0]) ? $segments[0] : '';

// ROUTE AUTH
if ($route === 'auth') {
    require_once __DIR__ . '/routes/auth.php';
    exit();
}

// ROUTE NEWSLETTER
if ($route === 'newsletter') {
    require_once __DIR__ . '/routes/newsletter.php';
    exit();
}

// ROUTE UPLOAD
if ($route === 'upload' || $route === 'upload-multiple') {
    require_once __DIR__ . '/routes/upload.php';
    exit();
}

// ROUTES API
require_once __DIR__ . '/routes/api.php';
?>