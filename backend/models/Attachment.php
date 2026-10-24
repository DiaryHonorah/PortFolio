<?php
require_once __DIR__ . '/../config/database.php';

class Attachment {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Récupérer les pièces jointes d'un message
    public function getByMessageId($messageId) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM attachments WHERE message_id = ? ORDER BY id ASC");
            $stmt->execute([$messageId]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Créer une pièce jointe
    public function create($data) {
        try {
            $sql = "INSERT INTO attachments (message_id, file_name, file_path, file_type, file_size) 
                    VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['message_id'],
                $data['file_name'],
                $data['file_path'],
                $data['file_type'] ?? null,
                $data['file_size'] ?? 0
            ]);
            
            if ($result) {
                // Mettre à jour le message pour indiquer qu'il a des pièces jointes
                $stmt = $this->pdo->prepare("UPDATE messages SET has_attachments = TRUE WHERE id = ?");
                $stmt->execute([$data['message_id']]);
                
                return ['success' => true, 'id' => $this->pdo->lastInsertId()];
            }
            
            return ['success' => false];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer une pièce jointe
    public function delete($id) {
        try {
            // Récupérer le chemin du fichier
            $stmt = $this->pdo->prepare("SELECT file_path FROM attachments WHERE id = ?");
            $stmt->execute([$id]);
            $attachment = $stmt->fetch();
            
            if ($attachment) {
                // Supprimer le fichier physique
                $filePath = __DIR__ . '/../' . $attachment['file_path'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                
                // Supprimer l'entrée en base
                $stmt = $this->pdo->prepare("DELETE FROM attachments WHERE id = ?");
                return ['success' => $stmt->execute([$id])];
            }
            
            return ['success' => false];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer toutes les pièces jointes d'un message
    public function deleteByMessageId($messageId) {
        try {
            $attachments = $this->getByMessageId($messageId);
            foreach ($attachments as $attachment) {
                $filePath = __DIR__ . '/../' . $attachment['file_path'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            
            $stmt = $this->pdo->prepare("DELETE FROM attachments WHERE message_id = ?");
            return ['success' => $stmt->execute([$messageId])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>