<?php
require_once __DIR__ . '/../config/database.php';

class Timeline {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Récupérer tous les événements
    public function getAll($type = null) {
        try {
            $sql = "SELECT * FROM timeline";
            if ($type && $type !== 'all') {
                $sql .= " WHERE type = ?";
            }
            $sql .= " ORDER BY display_order ASC, year ASC";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($type && $type !== 'all' ? [$type] : []);
            $events = $stmt->fetchAll();
            
            // Décoder les détails JSON
            foreach ($events as &$event) {
                $event['details'] = json_decode($event['details'], true) ?? [];
            }
            
            return $events;
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer un événement par ID
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM timeline WHERE id = ?");
            $stmt->execute([$id]);
            $event = $stmt->fetch();
            
            if ($event) {
                $event['details'] = json_decode($event['details'], true) ?? [];
            }
            
            return $event;
        } catch (PDOException $e) {
            return null;
        }
    }
    
    // Créer un événement
    public function create($data) {
        try {
            $sql = "INSERT INTO timeline (year, title, description, type, icon, color, details, display_order) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            $details = isset($data['details']) ? json_encode($data['details']) : '[]';
            
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['year'],
                $data['title'],
                $data['description'] ?? null,
                $data['type'] ?? 'education',
                $data['icon'] ?? null,
                $data['color'] ?? '#0066FF',
                $details,
                $data['display_order'] ?? 0
            ]);
            
            if ($result) {
                return ['success' => true, 'id' => $this->pdo->lastInsertId()];
            }
            
            return ['success' => false];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Mettre à jour un événement
    public function update($id, $data) {
        try {
            $fields = [];
            $params = [];
            
            foreach ($data as $key => $value) {
                if ($key === 'details') {
                    $value = json_encode($value);
                }
                $fields[] = "$key = ?";
                $params[] = $value;
            }
            
            $params[] = $id;
            $sql = "UPDATE timeline SET " . implode(', ', $fields) . " WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            return ['success' => $stmt->execute($params)];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer un événement
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM timeline WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Récupérer les types disponibles
    public function getTypes() {
        try {
            $stmt = $this->pdo->query("SELECT DISTINCT type FROM timeline ORDER BY type");
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
}
?>