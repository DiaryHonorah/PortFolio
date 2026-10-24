<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Newsletter.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$newsletterModel = new Newsletter($pdo);
$method = $_SERVER['REQUEST_METHOD'];

// Récupérer l'URI
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/portfolio/backend/', '', $path);
$path = trim($path, '/');
$segments = explode('/', $path);
$endpoint = isset($segments[0]) ? $segments[0] : '';
$action = isset($segments[1]) ? $segments[1] : null;

// ============================================
// ROUTES NEWSLETTER
// ============================================

// POST /newsletter - Inscription
if ($method === 'POST' && $endpoint === 'newsletter') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $name = $data['name'] ?? null;
    
    if (empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Email requis']);
        exit();
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Email invalide']);
        exit();
    }
    
    $result = $newsletterModel->create($email, $name);
    
    if ($result['success']) {
        // Générer le lien de confirmation
        $confirmLink = "http://localhost/portfolio/backend/newsletter/confirm/" . $result['token'];
        
        // Envoyer l'email (simulé pour le développement)
        $to = $email;
        $subject = "Confirmation de votre inscription à la newsletter";
        $message = "Bonjour,\n\n";
        $message .= "Merci de vous être inscrit à ma newsletter.\n\n";
        $message .= "Pour confirmer votre inscription, cliquez sur ce lien :\n";
        $message .= $confirmLink . "\n\n";
        $message .= "Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.\n\n";
        $message .= "Cordialement,\n";
        $message .= "RAKOTOSOLOFOHARISON Diary Honorah";
        
        $headers = "From: honorahrakotosolofoharison@gmail.com\r\n";
        $headers .= "Reply-To: honorahrakotosolofoharison@gmail.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // @mail($to, $subject, $message, $headers); // Décommenter en production
        
        echo json_encode([
            'success' => true,
            'message' => 'Un email de confirmation a été envoyé',
            'token' => $result['token'],
            'confirm_link' => $confirmLink // À retirer en production
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => $result['error']]);
    }
    exit();
}

// GET /newsletter/confirm/{token} - Confirmation
if ($method === 'GET' && $endpoint === 'newsletter' && $action === 'confirm') {
    $token = isset($segments[2]) ? $segments[2] : null;
    
    if (!$token) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Token requis']);
        exit();
    }
    
    $result = $newsletterModel->confirm($token);
    
    if ($result['success']) {
        // Rediriger vers une page de confirmation
        header('Location: http://localhost:5176/#newsletter-confirmed');
        exit();
    } else {
        echo json_encode(['success' => false, 'error' => $result['error']]);
    }
    exit();
}

// GET /newsletter/subscribers - Liste des abonnés (admin)
if ($method === 'GET' && $endpoint === 'newsletter' && $action === 'subscribers') {
    $onlyConfirmed = isset($_GET['confirmed']) && $_GET['confirmed'] === 'true';
    echo json_encode($newsletterModel->getAll($onlyConfirmed));
    exit();
}

// GET /newsletter/count - Nombre d'abonnés
if ($method === 'GET' && $endpoint === 'newsletter' && $action === 'count') {
    echo json_encode([
        'total' => $newsletterModel->count(false),
        'confirmed' => $newsletterModel->count(true)
    ]);
    exit();
}

// POST /newsletter/unsubscribe - Désabonnement
if ($method === 'POST' && $endpoint === 'newsletter' && $action === 'unsubscribe') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    
    if (empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Email requis']);
        exit();
    }
    
    $result = $newsletterModel->unsubscribe($email);
    echo json_encode($result);
    exit();
}

// DELETE /newsletter/{id} - Supprimer un abonné (admin)
if ($method === 'DELETE' && $endpoint === 'newsletter' && $action) {
    $result = $newsletterModel->delete($action);
    echo json_encode($result);
    exit();
}

// Route par défaut
http_response_code(404);
echo json_encode(['error' => 'Route newsletter non trouvée']);
?>