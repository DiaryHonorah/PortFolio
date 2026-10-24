<?php
require_once __DIR__ . '/../config/database.php';

class Message {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getAll($status = null) {
        try {
            $sql = "SELECT * FROM messages";
            if ($status) {
                $sql .= " WHERE status = ?";
            }
            $sql .= " ORDER BY created_at DESC";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($status ? [$status] : []);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM messages WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            return null;
        }
    }
    
    public function create($data) {
        try {
            $sql = "INSERT INTO messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, 'unread')";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['name'],
                $data['email'],
                $data['subject'] ?? 'Nouveau message',
                $data['message']
            ]);
            
            if ($result) {
                return ['success' => true, 'id' => $this->pdo->lastInsertId()];
            }
            
            return ['success' => false];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function updateStatus($id, $status) {
        try {
            $stmt = $this->pdo->prepare("UPDATE messages SET status = ? WHERE id = ?");
            return $stmt->execute([$status, $id]);
        } catch (PDOException $e) {
            return false;
        }
    }
    
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM messages WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function countUnread() {
        try {
            $stmt = $this->pdo->query("SELECT COUNT(*) FROM messages WHERE status = 'unread'");
            return $stmt->fetchColumn();
        } catch (PDOException $e) {
            return 0;
        }
    }
}
?>