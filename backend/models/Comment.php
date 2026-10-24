<?php
require_once __DIR__ . '/../config/database.php';

class Comment {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Récupérer les commentaires d'un projet
    public function getByProjectId($projectId, $onlyApproved = true) {
        try {
            $sql = "
                SELECT c.*, 
                    (SELECT COUNT(*) FROM comments r WHERE r.parent_id = c.id AND r.approved = TRUE) as replies_count
                FROM comments c 
                WHERE c.project_id = ?
            ";
            
            if ($onlyApproved) {
                $sql .= " AND c.approved = TRUE AND c.parent_id IS NULL";
            } else {
                $sql .= " AND c.parent_id IS NULL";
            }
            
            $sql .= " ORDER BY c.created_at DESC";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$projectId]);
            $comments = $stmt->fetchAll();
            
            // Récupérer les réponses pour chaque commentaire
            foreach ($comments as &$comment) {
                $comment['replies'] = $this->getReplies($comment['id'], $onlyApproved);
            }
            
            return $comments;
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer les réponses d'un commentaire
    public function getReplies($parentId, $onlyApproved = true) {
        try {
            $sql = "SELECT * FROM comments WHERE parent_id = ?";
            if ($onlyApproved) {
                $sql .= " AND approved = TRUE";
            }
            $sql .= " ORDER BY created_at ASC";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$parentId]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer tous les commentaires (admin)
    public function getAll($approved = null) {
        try {
            $sql = "SELECT * FROM comments";
            if ($approved !== null) {
                $sql .= " WHERE approved = " . ($approved ? 1 : 0);
            }
            $sql .= " ORDER BY created_at DESC";
            
            $stmt = $this->pdo->query($sql);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer un commentaire par ID
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM comments WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            return null;
        }
    }
    
    // Créer un commentaire
    public function create($data) {
        try {
            $sql = "INSERT INTO comments (project_id, name, email, message, parent_id, is_admin_reply, ip_address) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['project_id'],
                $data['name'],
                $data['email'],
                $data['message'],
                $data['parent_id'] ?? null,
                $data['is_admin_reply'] ?? false,
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);
            
            if ($result) {
                return ['success' => true, 'id' => $this->pdo->lastInsertId()];
            }
            
            return ['success' => false];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Approuver un commentaire
    public function approve($id) {
        try {
            $stmt = $this->pdo->prepare("UPDATE comments SET approved = TRUE, approved_at = NOW() WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Rejeter un commentaire
    public function reject($id) {
        try {
            $stmt = $this->pdo->prepare("UPDATE comments SET approved = FALSE, approved_at = NULL WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer un commentaire
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM comments WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Compter les commentaires
    public function count($approved = null) {
        try {
            $sql = "SELECT COUNT(*) as total FROM comments";
            if ($approved !== null) {
                $sql .= " WHERE approved = " . ($approved ? 1 : 0);
            }
            
            $stmt = $this->pdo->query($sql);
            return $stmt->fetch()['total'];
        } catch (PDOException $e) {
            return 0;
        }
    }
    
    // Compter les commentaires d'un projet
    public function countByProject($projectId, $onlyApproved = true) {
        try {
            $sql = "SELECT COUNT(*) as total FROM comments WHERE project_id = ?";
            if ($onlyApproved) {
                $sql .= " AND approved = TRUE";
            }
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$projectId]);
            return $stmt->fetch()['total'];
        } catch (PDOException $e) {
            return 0;
        }
    }
}
?>