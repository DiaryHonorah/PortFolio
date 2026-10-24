<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Gérer les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// DEBUG - Afficher les infos de la requête
// ============================================
error_log("=== UPLOAD DEBUG ===");
error_log("Method: " . $_SERVER['REQUEST_METHOD']);
error_log("URI: " . $_SERVER['REQUEST_URI']);
error_log("FILES: " . print_r($_FILES, true));

// ============================================
// VÉRIFIER LA MÉTHODE
// ============================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'error' => 'Méthode non autorisée',
        'method' => $_SERVER['REQUEST_METHOD'],
        'expected' => 'POST'
    ]);
    exit();
}

// ============================================
// CRÉER LE DOSSIER UPLOADS
// ============================================
$uploadDir = __DIR__ . '/../uploads/';
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Impossible de créer le dossier uploads']);
        exit();
    }
}

// ============================================
// DÉTECTER LE TYPE D'UPLOAD
// ============================================
$isMultiple = isset($_FILES['images']);
$isSingle = isset($_FILES['file']);

// ============================================
// AUCUN FICHIER
// ============================================
if (!$isMultiple && !$isSingle) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'error' => 'Aucun fichier reçu',
        'debug' => [
            'files_keys' => array_keys($_FILES),
            'post_keys' => array_keys($_POST),
            'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'non défini'
        ]
    ]);
    exit();
}

// ============================================
// UPLOAD MULTIPLE
// ============================================
if ($isMultiple) {
    $uploadedFiles = [];
    $files = $_FILES['images'];
    
    // Normaliser si un seul fichier
    if (!is_array($files['name'])) {
        $files = [
            'name' => [$files['name']],
            'type' => [$files['type']],
            'tmp_name' => [$files['tmp_name']],
            'error' => [$files['error']],
            'size' => [$files['size']]
        ];
    }

    $count = count($files['name']);
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    for ($i = 0; $i < $count; $i++) {
        if ($files['error'][$i] !== UPLOAD_ERR_OK) {
            continue;
        }

        $fileType = $files['type'][$i];
        $fileSize = $files['size'][$i];

        if (!in_array($fileType, $allowedTypes)) {
            continue;
        }

        if ($fileSize > 5 * 1024 * 1024) {
            continue;
        }

        $fileName = time() . '_' . uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($files['name'][$i]));
        $targetPath = $uploadDir . $fileName;
        $relativePath = '/portfolio/backend/uploads/' . $fileName;

        if (move_uploaded_file($files['tmp_name'][$i], $targetPath)) {
            $uploadedFiles[] = [
                'file_name' => $files['name'][$i],
                'file_path' => $relativePath,
                'file_type' => $fileType,
                'file_size' => $fileSize
            ];
        }
    }

    if (count($uploadedFiles) > 0) {
        echo json_encode([
            'success' => true,
            'files' => $uploadedFiles,
            'count' => count($uploadedFiles)
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Aucune image n\'a pu être uploadée'
        ]);
    }
    exit();
}

// ============================================
// UPLOAD SIMPLE
// ============================================
if ($isSingle) {
    $file = $_FILES['file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'Fichier trop volumineux (limite serveur)',
            UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux (limite formulaire)',
            UPLOAD_ERR_PARTIAL => 'Fichier partiellement uploadé',
            UPLOAD_ERR_NO_FILE => 'Aucun fichier',
            UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant',
            UPLOAD_ERR_CANT_WRITE => 'Impossible d\'écrire le fichier',
            UPLOAD_ERR_EXTENSION => 'Upload arrêté par une extension'
        ];
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $errors[$file['error']] ?? 'Erreur upload inconnue'
        ]);
        exit();
    }

    // Types autorisés
    $allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/zip'
    ];

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip'];

    // Vérifier le type MIME
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Type de fichier non autorisé: ' . $file['type']
        ]);
        exit();
    }

    // Vérifier l'extension
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedExtensions)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Extension non autorisée: ' . $extension
        ]);
        exit();
    }

    // Vérifier la taille
    if ($file['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Fichier trop volumineux (max 5MB)'
        ]);
        exit();
    }

    // Générer le nom unique
    $fileName = time() . '_' . uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($file['name']));
    $targetPath = $uploadDir . $fileName;
    $relativePath = '/portfolio/backend/uploads/' . $fileName;

    // Déplacer le fichier
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode([
            'success' => true,
            'file_name' => $file['name'],
            'file_path' => $relativePath,
            'file_type' => $file['type'],
            'file_size' => $file['size']
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erreur lors du déplacement du fichier',
            'tmp_name' => $file['tmp_name'],
            'target' => $targetPath
        ]);
    }
    exit();
}
?>