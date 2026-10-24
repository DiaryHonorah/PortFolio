<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Project.php';
require_once __DIR__ . '/../models/Skill.php';
require_once __DIR__ . '/../models/Message.php';
require_once __DIR__ . '/../models/Attachment.php';
require_once __DIR__ . '/../models/Testimonial.php';
require_once __DIR__ . '/../models/ProjectImage.php';
require_once __DIR__ . '/../models/ProjectRating.php';
require_once __DIR__ . '/../models/Comment.php';
require_once __DIR__ . '/../models/Timeline.php';
require_once __DIR__ . '/../models/Service.php';

// Initialisation des modèles
$serviceModel = new Service($pdo);
$timelineModel = new Timeline($pdo);
$commentModel = new Comment($pdo);
$ratingModel = new ProjectRating($pdo);
$projectImageModel = new ProjectImage($pdo);
$testimonialModel = new Testimonial($pdo);
$attachmentModel = new Attachment($pdo);
$projectModel = new Project($pdo);
$skillModel = new Skill($pdo);
$messageModel = new Message($pdo);

$method = $_SERVER['REQUEST_METHOD'];

// Récupérer l'URI
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/portfolio/backend/', '', $path);
$path = trim($path, '/');
$segments = explode('/', $path);
$endpoint = isset($segments[0]) ? $segments[0] : '';
$id = isset($segments[1]) ? $segments[1] : null;
$action = isset($segments[2]) ? $segments[2] : null;

// Gérer les requêtes OPTIONS
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// ROUTES GET SPÉCIFIQUES (AVANT les routes générales)
// ============================================

// GET /projects/{id}/comments
if ($method === 'GET' && $endpoint === 'projects' && $id && $action === 'comments') {
    $onlyApproved = !isset($_GET['all']) || $_GET['all'] !== 'true';
    echo json_encode($commentModel->getByProjectId($id, $onlyApproved));
    exit();
}

// GET /projects/{id}/images
if ($method === 'GET' && $endpoint === 'projects' && $id && $action === 'images') {
    echo json_encode($projectImageModel->getByProjectId($id));
    exit();
}

// GET /projects/{id}/rating
if ($method === 'GET' && $endpoint === 'projects' && $id && $action === 'rating') {
    $average = $ratingModel->getAverage($id);
    $visitorIp = $_SERVER['REMOTE_ADDR'];
    $userRating = $ratingModel->hasVoted($id, $visitorIp);
    
    echo json_encode([
        'average' => $average['average'],
        'total' => $average['total'],
        'user_rating' => $userRating
    ]);
    exit();
}

// GET /projects/{id}/ratings
if ($method === 'GET' && $endpoint === 'projects' && $id && $action === 'ratings') {
    echo json_encode($ratingModel->getByProjectId($id));
    exit();
}

// GET /messages/{id}/attachments
if ($method === 'GET' && $endpoint === 'messages' && $id && $action === 'attachments') {
    echo json_encode($attachmentModel->getByMessageId($id));
    exit();
}

// ============================================
// ROUTES GET GÉNÉRALES
// ============================================

// GET /projects
if ($method === 'GET' && $endpoint === 'projects') {
    if ($id && !$action) {
        $project = $projectModel->getById($id);
        echo json_encode($project ?: ['error' => 'Projet non trouvé']);
    } else {
        echo json_encode($projectModel->getAll());
    }
    exit();
}

// GET /skills
if ($method === 'GET' && $endpoint === 'skills') {
    if ($id) {
        echo json_encode($skillModel->getByCategory($id));
    } else {
        echo json_encode($skillModel->getAll());
    }
    exit();
}

// GET /skills-categories
if ($method === 'GET' && $endpoint === 'skills-categories') {
    echo json_encode($skillModel->getCategories());
    exit();
}

// GET /messages
if ($method === 'GET' && $endpoint === 'messages') {
    if ($id) {
        $message = $messageModel->getById($id);
        echo json_encode($message ?: ['error' => 'Message non trouvé']);
    } else {
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        echo json_encode($messageModel->getAll($status));
    }
    exit();
}

// GET /messages-count
if ($method === 'GET' && $endpoint === 'messages-count') {
    echo json_encode(['unread' => $messageModel->countUnread()]);
    exit();
}

// GET /testimonials
if ($method === 'GET' && $endpoint === 'testimonials') {
    if ($id) {
        $testimonial = $testimonialModel->getById($id);
        echo json_encode($testimonial ?: ['error' => 'Témoignage non trouvé']);
    } else {
        $approved = isset($_GET['approved']) ? filter_var($_GET['approved'], FILTER_VALIDATE_BOOLEAN) : null;
        echo json_encode($testimonialModel->getAll($approved));
    }
    exit();
}

// GET /testimonials-approved
if ($method === 'GET' && $endpoint === 'testimonials-approved') {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    echo json_encode($testimonialModel->getApproved($limit));
    exit();
}

// GET /testimonials-count
if ($method === 'GET' && $endpoint === 'testimonials-count') {
    echo json_encode([
        'total' => $testimonialModel->count(),
        'approved' => $testimonialModel->count(true),
        'pending' => $testimonialModel->count(false),
        'average_rating' => $testimonialModel->getAverageRating()
    ]);
    exit();
}

// GET /project-images
if ($method === 'GET' && $endpoint === 'project-images') {
    try {
        $stmt = $pdo->query("SELECT * FROM project_images ORDER BY project_id, display_order");
        echo json_encode($stmt->fetchAll());
    } catch (PDOException $e) {
        echo json_encode([]);
    }
    exit();
}

// GET /comments
if ($method === 'GET' && $endpoint === 'comments') {
    if ($id) {
        $comment = $commentModel->getById($id);
        echo json_encode($comment ?: ['error' => 'Commentaire non trouvé']);
    } else {
        $approved = isset($_GET['approved']) ? filter_var($_GET['approved'], FILTER_VALIDATE_BOOLEAN) : null;
        echo json_encode($commentModel->getAll($approved));
    }
    exit();
}

// GET /comments-count
if ($method === 'GET' && $endpoint === 'comments-count') {
    echo json_encode([
        'total' => $commentModel->count(),
        'approved' => $commentModel->count(true),
        'pending' => $commentModel->count(false)
    ]);
    exit();
}

// GET /ratings/top
if ($method === 'GET' && $endpoint === 'ratings' && $id === 'top') {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
    echo json_encode($ratingModel->getTopProjects($limit));
    exit();
}

// GET /ratings/stats
if ($method === 'GET' && $endpoint === 'ratings' && $id === 'stats') {
    echo json_encode($ratingModel->getGlobalStats());
    exit();
}

// GET /timeline-types
if ($method === 'GET' && $endpoint === 'timeline-types') {
    echo json_encode($timelineModel->getTypes());
    exit();
}

// GET /timeline
if ($method === 'GET' && $endpoint === 'timeline') {
    if ($id) {
        $event = $timelineModel->getById($id);
        echo json_encode($event ?: ['error' => 'Événement non trouvé']);
    } else {
        $type = isset($_GET['type']) ? $_GET['type'] : null;
        echo json_encode($timelineModel->getAll($type));
    }
    exit();
}

// ============================================
// ROUTES SERVICES (GET)
// ============================================

// GET /services-count
if ($method === 'GET' && $endpoint === 'services-count') {
    echo json_encode([
        'total' => $serviceModel->count(),
        'active' => $serviceModel->count(true)
    ]);
    exit();
}

// GET /services
if ($method === 'GET' && $endpoint === 'services') {
    if ($id) {
        $service = $serviceModel->getById($id);
        echo json_encode($service ?: ['error' => 'Service non trouvé']);
    } else {
        $activeOnly = isset($_GET['active']) && $_GET['active'] === 'true';
        echo json_encode($serviceModel->getAll($activeOnly));
    }
    exit();
}

// ============================================
// ROUTES FAVORIS (GET)
// ============================================

if ($method === 'GET' && $endpoint === 'favorites') {
    if ($id) {
        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM favorites WHERE project_id = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch();
            echo json_encode(['count' => (int)$result['count']]);
        } catch (PDOException $e) {
            echo json_encode(['count' => 0]);
        }
    } else {
        try {
            $stmt = $pdo->query("SELECT project_id, COUNT(*) as count FROM favorites GROUP BY project_id");
            echo json_encode($stmt->fetchAll());
        } catch (PDOException $e) {
            echo json_encode([]);
        }
    }
    exit();
}

// ============================================
// ROUTES VISITES (GET)
// ============================================

if ($method === 'GET' && $endpoint === 'visits') {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM page_visits");
        $total = $stmt->fetch()['total'];
        
        $stmt = $pdo->query("SELECT COUNT(DISTINCT visitor_ip) as unique_visitors FROM page_visits");
        $unique = $stmt->fetch()['unique_visitors'];
        
        $stmt = $pdo->query("SELECT COUNT(*) as today FROM page_visits WHERE DATE(visited_at) = CURDATE()");
        $today = $stmt->fetch()['today'];
        
        $stmt = $pdo->query("SELECT page, COUNT(*) as count FROM page_visits GROUP BY page ORDER BY count DESC");
        $byPage = $stmt->fetchAll();
        
        $stmt = $pdo->query("
            SELECT DATE(visited_at) as date, COUNT(*) as count 
            FROM page_visits 
            WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(visited_at)
            ORDER BY date ASC
        ");
        $last7Days = $stmt->fetchAll();
        
        echo json_encode([
            'total' => (int)$total,
            'unique_visitors' => (int)$unique,
            'today' => (int)$today,
            'by_page' => $byPage,
            'last_7_days' => $last7Days
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'total' => 0,
            'unique_visitors' => 0,
            'today' => 0,
            'by_page' => [],
            'last_7_days' => []
        ]);
    }
    exit();
}

// ============================================
// ROUTES POST
// ============================================

// POST /projects/{id}/rate (AVANT /projects)
if ($method === 'POST' && $endpoint === 'projects' && $id && $action === 'rate') {
    $data = json_decode(file_get_contents('php://input'), true);
    $rating = isset($data['rating']) ? (int)$data['rating'] : 0;
    $comment = $data['comment'] ?? null;
    
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Note invalide (1-5)']);
        exit();
    }
    
    $result = $ratingModel->rate($id, $rating, $comment);
    echo json_encode($result);
    exit();
}

// POST /messages
if ($method === 'POST' && $endpoint === 'messages') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Champs requis']);
        exit();
    }
    
    $result = $messageModel->create($data);
    echo json_encode(['success' => $result['success']]);
    exit();
}

// POST /messages-with-attachments
if ($method === 'POST' && $endpoint === 'messages-with-attachments') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Champs requis']);
        exit();
    }
    
    $result = $messageModel->create($data);
    
    if ($result['success']) {
        $messageId = $result['id'];
        
        if (!empty($data['attachments']) && is_array($data['attachments'])) {
            foreach ($data['attachments'] as $attachment) {
                $attachmentModel->create([
                    'message_id' => $messageId,
                    'file_name' => $attachment['file_name'],
                    'file_path' => $attachment['file_path'],
                    'file_type' => $attachment['file_type'],
                    'file_size' => $attachment['file_size']
                ]);
            }
        }
        
        echo json_encode(['success' => true, 'id' => $messageId]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur création message']);
    }
    exit();
}

// POST /testimonials
if ($method === 'POST' && $endpoint === 'testimonials') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Champs requis manquants']);
        exit();
    }
    
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Email invalide']);
        exit();
    }
    
    $result = $testimonialModel->create($data);
    echo json_encode($result);
    exit();
}

// POST /project-images
if ($method === 'POST' && $endpoint === 'project-images') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['project_id']) || empty($data['image_url'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Project ID et image URL requis']);
        exit();
    }
    
    $result = $projectImageModel->create($data);
    echo json_encode($result);
    exit();
}

// POST /comments
if ($method === 'POST' && $endpoint === 'comments') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['project_id']) || empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Champs requis manquants']);
        exit();
    }
    
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Email invalide']);
        exit();
    }
    
    $result = $commentModel->create($data);
    echo json_encode($result);
    exit();
}

// POST /timeline
if ($method === 'POST' && $endpoint === 'timeline') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['year']) || empty($data['title'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Année et titre requis']);
        exit();
    }
    
    $result = $timelineModel->create($data);
    echo json_encode($result);
    exit();
}

// POST /services
if ($method === 'POST' && $endpoint === 'services') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['title']) || empty($data['description'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Titre et description requis']);
        exit();
    }
    
    $result = $serviceModel->create($data);
    echo json_encode($result);
    exit();
}

// POST /favorites
if ($method === 'POST' && $endpoint === 'favorites') {
    $data = json_decode(file_get_contents('php://input'), true);
    $projectId = $data['project_id'] ?? null;
    $visitorIp = $_SERVER['REMOTE_ADDR'];
    
    if (!$projectId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID projet requis']);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("SELECT id FROM favorites WHERE project_id = ? AND visitor_ip = ?");
        $stmt->execute([$projectId, $visitorIp]);
        
        if ($stmt->fetch()) {
            $stmt = $pdo->prepare("DELETE FROM favorites WHERE project_id = ? AND visitor_ip = ?");
            $stmt->execute([$projectId, $visitorIp]);
            
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM favorites WHERE project_id = ?");
            $stmt->execute([$projectId]);
            $result = $stmt->fetch();
            
            echo json_encode(['success' => true, 'action' => 'removed', 'count' => (int)$result['count']]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO favorites (project_id, visitor_ip) VALUES (?, ?)");
            $stmt->execute([$projectId, $visitorIp]);
            
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM favorites WHERE project_id = ?");
            $stmt->execute([$projectId]);
            $result = $stmt->fetch();
            
            echo json_encode(['success' => true, 'action' => 'added', 'count' => (int)$result['count']]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// POST /visits
if ($method === 'POST' && $endpoint === 'visits') {
    $data = json_decode(file_get_contents('php://input'), true);
    $page = $data['page'] ?? 'home';
    $sessionId = $data['session_id'] ?? '';
    $visitorIp = $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    try {
        if ($sessionId) {
            $stmt = $pdo->prepare("
                SELECT id FROM page_visits 
                WHERE session_id = ? AND page = ? 
                AND visited_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
            ");
            $stmt->execute([$sessionId, $page]);
            
            if ($stmt->fetch()) {
                echo json_encode(['success' => true, 'counted' => false]);
                exit();
            }
        }
        
        $stmt = $pdo->prepare("INSERT INTO page_visits (page, visitor_ip, user_agent, session_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([$page, $visitorIp, $userAgent, $sessionId]);
        
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM page_visits WHERE page = ?");
        $stmt->execute([$page]);
        $count = $stmt->fetch()['count'];
        
        echo json_encode(['success' => true, 'counted' => true, 'count' => (int)$count]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit();
}

// POST /projects (DOIT ÊTRE APRÈS rate)
if ($method === 'POST' && $endpoint === 'projects') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['title']) || empty($data['description'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Titre et description sont requis']);
        exit();
    }
    
    $data['slug'] = $data['slug'] ?? strtolower(str_replace(' ', '-', $data['title']));
    $result = $projectModel->create($data);
    echo json_encode(['success' => $result['success']]);
    exit();
}

// POST /skills
if ($method === 'POST' && $endpoint === 'skills') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['name']) || empty($data['category'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Nom et catégorie sont requis']);
        exit();
    }
    
    $result = $skillModel->create($data);
    echo json_encode(['success' => $result['success']]);
    exit();
}

// ============================================
// ROUTES PUT
// ============================================

if ($method === 'PUT' && $endpoint === 'projects' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $projectModel->update($id, $data);
    echo json_encode(['success' => $result['success']]);
    exit();
}

if ($method === 'PUT' && $endpoint === 'skills' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $skillModel->update($id, $data);
    echo json_encode(['success' => $result['success']]);
    exit();
}

if ($method === 'PUT' && $endpoint === 'messages' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['status'])) {
        $result = $messageModel->updateStatus($id, $data['status']);
        echo json_encode(['success' => $result]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Status requis']);
    }
    exit();
}

if ($method === 'PUT' && $endpoint === 'testimonials' && $id) {
    if ($action === 'approve') {
        $result = $testimonialModel->approve($id);
        echo json_encode($result);
        exit();
    }
    if ($action === 'reject') {
        $result = $testimonialModel->reject($id);
        echo json_encode($result);
        exit();
    }
}

if ($method === 'PUT' && $endpoint === 'project-images' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $projectImageModel->update($id, $data);
    echo json_encode($result);
    exit();
}

if ($method === 'PUT' && $endpoint === 'comments' && $id) {
    if ($action === 'approve') {
        $result = $commentModel->approve($id);
        echo json_encode($result);
        exit();
    }
    if ($action === 'reject') {
        $result = $commentModel->reject($id);
        echo json_encode($result);
        exit();
    }
}

if ($method === 'PUT' && $endpoint === 'timeline' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $timelineModel->update($id, $data);
    echo json_encode($result);
    exit();
}

if ($method === 'PUT' && $endpoint === 'services' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $serviceModel->update($id, $data);
    echo json_encode($result);
    exit();
}

// ============================================
// ROUTES DELETE
// ============================================

if ($method === 'DELETE' && $endpoint === 'projects' && $id) {
    $result = $projectModel->delete($id);
    echo json_encode(['success' => $result['success']]);
    exit();
}

if ($method === 'DELETE' && $endpoint === 'skills' && $id) {
    $result = $skillModel->delete($id);
    echo json_encode(['success' => $result['success']]);
    exit();
}

if ($method === 'DELETE' && $endpoint === 'messages' && $id) {
    $result = $messageModel->delete($id);
    echo json_encode(['success' => $result['success']]);
    exit();
}

if ($method === 'DELETE' && $endpoint === 'testimonials' && $id) {
    $result = $testimonialModel->delete($id);
    echo json_encode($result);
    exit();
}

if ($method === 'DELETE' && $endpoint === 'project-images' && $id) {
    $result = $projectImageModel->delete($id);
    echo json_encode($result);
    exit();
}

if ($method === 'DELETE' && $endpoint === 'comments' && $id) {
    $result = $commentModel->delete($id);
    echo json_encode($result);
    exit();
}

if ($method === 'DELETE' && $endpoint === 'timeline' && $id) {
    $result = $timelineModel->delete($id);
    echo json_encode($result);
    exit();
}

if ($method === 'DELETE' && $endpoint === 'services' && $id) {
    $result = $serviceModel->delete($id);
    echo json_encode($result);
    exit();
}

// ============================================
// ROUTE PAR DÉFAUT
// ============================================
http_response_code(404);
echo json_encode(['error' => 'Endpoint non trouvé: ' . $endpoint]);
?>