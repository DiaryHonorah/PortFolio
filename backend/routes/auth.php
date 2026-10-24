<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';

// Démarrer la session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Limiter les tentatives de connexion
$maxAttempts = 5;
$lockoutTime = 15; // minutes

// Vérifier les tentatives
if (isset($_SESSION['login_attempts']) && $_SESSION['login_attempts'] >= $maxAttempts) {
    $timeSinceFirst = time() - ($_SESSION['first_attempt_time'] ?? time());
    if ($timeSinceFirst < $lockoutTime * 60) {
        http_response_code(429);
        echo json_encode([
            'success' => false, 
            'error' => 'Trop de tentatives. Réessayez dans ' . ceil(($lockoutTime * 60 - $timeSinceFirst) / 60) . ' minutes.'
        ]);
        exit();
    } else {
        // Réinitialiser les tentatives
        $_SESSION['login_attempts'] = 0;
        $_SESSION['first_attempt_time'] = null;
    }
}

$userModel = new User($pdo);
$method = $_SERVER['REQUEST_METHOD'];

// Récupérer l'URI
$requestUri = $_SERVER['REQUEST_URI'];
$uri = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/portfolio/backend/', '', $uri);
$path = trim($path, '/');
$segments = explode('/', $path);

$route = isset($segments[0]) ? $segments[0] : '';
$action = isset($segments[1]) ? $segments[1] : '';

// Gérer les requêtes OPTIONS (CORS)
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==================== ROUTES ====================

// POST /auth/login
if ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['username']) || empty($data['password'])) {
        // Incrémenter les tentatives
        $_SESSION['login_attempts'] = ($_SESSION['login_attempts'] ?? 0) + 1;
        if (!isset($_SESSION['first_attempt_time'])) {
            $_SESSION['first_attempt_time'] = time();
        }
        
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Nom d\'utilisateur et mot de passe requis'
        ]);
        exit();
    }
    
    // Nettoyer l'input
    $username = htmlspecialchars(trim($data['username']));
    $password = trim($data['password']);
    
    $user = $userModel->authenticate($username, $password);
    
    if ($user) {
        // Réinitialiser les tentatives
        $_SESSION['login_attempts'] = 0;
        $_SESSION['first_attempt_time'] = null;
        
        // Régénérer l'ID de session pour la sécurité
        session_regenerate_id(true);
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['is_logged_in'] = true;
        $_SESSION['login_time'] = time();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        // Incrémenter les tentatives
        $_SESSION['login_attempts'] = ($_SESSION['login_attempts'] ?? 0) + 1;
        if (!isset($_SESSION['first_attempt_time'])) {
            $_SESSION['first_attempt_time'] = time();
        }
        
        $remaining = $maxAttempts - $_SESSION['login_attempts'];
        
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Identifiants incorrects. Tentatives restantes: ' . $remaining
        ]);
    }
    exit();
}

// GET /auth/check
if ($method === 'GET' && $action === 'check') {
    if (isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true) {
        http_response_code(200);
        echo json_encode([
            'isLoggedIn' => true,
            'user' => [
                'username' => $_SESSION['username'],
                'role' => $_SESSION['role']
            ]
        ]);
    } else {
        http_response_code(200);
        echo json_encode(['isLoggedIn' => false]);
    }
    exit();
}

// GET /auth/logout
if ($method === 'GET' && $action === 'logout') {
    // Détruire la session
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Déconnecté avec succès'
    ]);
    exit();
}

// Si aucune route n'est trouvée
http_response_code(404);
echo json_encode(['error' => 'Route auth non trouvée']);
?>