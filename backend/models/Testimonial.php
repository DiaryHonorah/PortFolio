<?php
require_once __DIR__ . '/../config/database.php';

class Testimonial {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Récupérer tous les témoignages (avec option approuvé)
    public function getAll($approved = null) {
        try {
            $sql = "SELECT * FROM testimonials";
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
    
    // Récupérer les témoignages approuvés
    public function getApproved($limit = null) {
        try {
            $sql = "SELECT * FROM testimonials WHERE approved = TRUE ORDER BY created_at DESC";
            if ($limit) {
                $sql .= " LIMIT " . (int)$limit;
            }
            
            $stmt = $this->pdo->query($sql);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer un témoignage par ID
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM testimonials WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            return null;
        }
    }
    
    // Créer un témoignage
    public function create($data) {
        try {
            $sql = "INSERT INTO testimonials (name, email, role, message, rating, ip_address) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['name'],
                $data['email'],
                $data['role'] ?? null,
                $data['message'],
                $data['rating'] ?? 5,
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
    
    // Approuver un témoignage
    public function approve($id) {
        try {
            $stmt = $this->pdo->prepare("UPDATE testimonials SET approved = TRUE, approved_at = NOW() WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Rejeter un témoignage
    public function reject($id) {
        try {
            $stmt = $this->pdo->prepare("UPDATE testimonials SET approved = FALSE, approved_at = NULL WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer un témoignage
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM testimonials WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Compter les témoignages
    public function count($approved = null) {
        try {
            $sql = "SELECT COUNT(*) as total FROM testimonials";
            if ($approved !== null) {
                $sql .= " WHERE approved = " . ($approved ? 1 : 0);
            }
            
            $stmt = $this->pdo->query($sql);
            return $stmt->fetch()['total'];
        } catch (PDOException $e) {
            return 0;
        }
    }
    
    // Calculer la note moyenne
    public function getAverageRating() {
        try {
            $stmt = $this->pdo->query("SELECT AVG(rating) as average FROM testimonials WHERE approved = TRUE");
            $result = $stmt->fetch();
            return $result['average'] ? round($result['average'], 1) : 0;
        } catch (PDOException $e) {
            return 0;
        }
    }
}
?>