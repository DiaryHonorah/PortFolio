<?php
require_once __DIR__ . '/../config/database.php';

class ProjectImage {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Récupérer toutes les images d'un projet
    public function getByProjectId($projectId) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT * FROM project_images 
                WHERE project_id = ? 
                ORDER BY display_order ASC, id ASC
            ");
            $stmt->execute([$projectId]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer une image par ID
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM project_images WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            return null;
        }
    }
    
    // Ajouter une image
    public function create($data) {
        try {
            // Récupérer l'ordre max actuel
            $stmt = $this->pdo->prepare("SELECT MAX(display_order) as max_order FROM project_images WHERE project_id = ?");
            $stmt->execute([$data['project_id']]);
            $result = $stmt->fetch();
            $nextOrder = ($result['max_order'] ?? 0) + 1;
            
            $sql = "INSERT INTO project_images (project_id, image_url, caption, display_order) 
                    VALUES (?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['project_id'],
                $data['image_url'],
                $data['caption'] ?? null,
                $data['display_order'] ?? $nextOrder
            ]);
            
            if ($result) {
                return ['success' => true, 'id' => $this->pdo->lastInsertId()];
            }
            
            return ['success' => false];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Mettre à jour une image (caption, ordre)
    public function update($id, $data) {
        try {
            $fields = [];
            $params = [];
            
            if (isset($data['caption'])) {
                $fields[] = "caption = ?";
                $params[] = $data['caption'];
            }
            
            if (isset($data['display_order'])) {
                $fields[] = "display_order = ?";
                $params[] = $data['display_order'];
            }
            
            if (empty($fields)) {
                return ['success' => false, 'error' => 'Aucune donnée à mettre à jour'];
            }
            
            $params[] = $id;
            $sql = "UPDATE project_images SET " . implode(', ', $fields) . " WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            return ['success' => $stmt->execute($params)];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer une image
    public function delete($id) {
        try {
            // Récupérer le chemin du fichier
            $stmt = $this->pdo->prepare("SELECT image_url FROM project_images WHERE id = ?");
            $stmt->execute([$id]);
            $image = $stmt->fetch();
            
            if ($image) {
                // Supprimer le fichier physique
                $filePath = __DIR__ . '/../' . str_replace('/portfolio/backend/', '', $image['image_url']);
                if (file_exists($filePath) && strpos($image['image_url'], 'uploads/') !== false) {
                    unlink($filePath);
                }
                
                // Supprimer l'entrée en base
                $stmt = $this->pdo->prepare("DELETE FROM project_images WHERE id = ?");
                return ['success' => $stmt->execute([$id])];
            }
            
            return ['success' => false];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer toutes les images d'un projet
    public function deleteByProjectId($projectId) {
        try {
            $images = $this->getByProjectId($projectId);
            foreach ($images as $image) {
                $filePath = __DIR__ . '/../' . str_replace('/portfolio/backend/', '', $image['image_url']);
                if (file_exists($filePath) && strpos($image['image_url'], 'uploads/') !== false) {
                    unlink($filePath);
                }
            }
            
            $stmt = $this->pdo->prepare("DELETE FROM project_images WHERE project_id = ?");
            return ['success' => $stmt->execute([$projectId])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Compter les images d'un projet
    public function countByProjectId($projectId) {
        try {
            $stmt = $this->pdo->prepare("SELECT COUNT(*) as total FROM project_images WHERE project_id = ?");
            $stmt->execute([$projectId]);
            return $stmt->fetch()['total'];
        } catch (PDOException $e) {
            return 0;
        }
    }
}
?>