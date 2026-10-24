<?php
require_once __DIR__ . '/../config/database.php';

class Newsletter {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Vérifier si un email existe déjà
    public function emailExists($email) {
        try {
            $stmt = $this->pdo->prepare("SELECT id FROM newsletter WHERE email = ?");
            $stmt->execute([$email]);
            return $stmt->fetch() !== false;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    // Créer une inscription (non confirmée)
    public function create($email, $name = null) {
        try {
            // Vérifier si déjà inscrit
            $stmt = $this->pdo->prepare("SELECT id, confirmed FROM newsletter WHERE email = ?");
            $stmt->execute([$email]);
            $existing = $stmt->fetch();
            
            if ($existing) {
                if ($existing['confirmed']) {
                    return ['success' => false, 'error' => 'Cet email est déjà inscrit et confirmé'];
                } else {
                    // Renvoyer un nouveau token
                    $token = bin2hex(random_bytes(32));
                    $stmt = $this->pdo->prepare("UPDATE newsletter SET token = ? WHERE email = ?");
                    $stmt->execute([$token, $email]);
                    return ['success' => true, 'token' => $token, 'resent' => true];
                }
            }
            
            // Créer une nouvelle inscription
            $token = bin2hex(random_bytes(32));
            $sql = "INSERT INTO newsletter (email, name, token, ip_address) VALUES (?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $email,
                $name,
                $token,
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);
            
            if ($result) {
                return ['success' => true, 'token' => $token, 'id' => $this->pdo->lastInsertId()];
            }
            
            return ['success' => false, 'error' => 'Erreur lors de l\'inscription'];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Confirmer une inscription avec le token
    public function confirm($token) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE newsletter 
                SET confirmed = TRUE, confirmed_at = NOW() 
                WHERE token = ? AND confirmed = FALSE
            ");
            $stmt->execute([$token]);
            
            if ($stmt->rowCount() > 0) {
                return ['success' => true];
            }
            
            // Vérifier si déjà confirmé
            $stmt = $this->pdo->prepare("SELECT confirmed FROM newsletter WHERE token = ?");
            $stmt->execute([$token]);
            $result = $stmt->fetch();
            
            if ($result && $result['confirmed']) {
                return ['success' => true, 'already_confirmed' => true];
            }
            
            return ['success' => false, 'error' => 'Token invalide ou expiré'];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Désabonner un email
    public function unsubscribe($email) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE newsletter 
                SET unsubscribed = TRUE, unsubscribed_at = NOW() 
                WHERE email = ?
            ");
            $stmt->execute([$email]);
            return ['success' => true];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Récupérer tous les abonnés
    public function getAll($onlyConfirmed = false) {
        try {
            $sql = "SELECT * FROM newsletter WHERE unsubscribed = FALSE";
            if ($onlyConfirmed) {
                $sql .= " AND confirmed = TRUE";
            }
            $sql .= " ORDER BY created_at DESC";
            
            $stmt = $this->pdo->query($sql);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Compter les abonnés
    public function count($onlyConfirmed = false) {
        try {
            $sql = "SELECT COUNT(*) as total FROM newsletter WHERE unsubscribed = FALSE";
            if ($onlyConfirmed) {
                $sql .= " AND confirmed = TRUE";
            }
            
            $stmt = $this->pdo->query($sql);
            return $stmt->fetch()['total'];
        } catch (PDOException $e) {
            return 0;
        }
    }
    
    // Supprimer un abonné
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM newsletter WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>