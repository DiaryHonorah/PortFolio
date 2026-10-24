<?php
require_once __DIR__ . '/../config/database.php';

class Service {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Récupérer tous les services
    public function getAll($activeOnly = false) {
        try {
            $sql = "SELECT * FROM services";
            if ($activeOnly) {
                $sql .= " WHERE active = TRUE";
            }
            $sql .= " ORDER BY display_order ASC, id ASC";
            
            $stmt = $this->pdo->query($sql);
            $services = $stmt->fetchAll();
            
            // Décoder les features JSON
            foreach ($services as &$service) {
                $service['features'] = json_decode($service['features'], true) ?? [];
            }
            
            return $services;
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer un service par ID
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM services WHERE id = ?");
            $stmt->execute([$id]);
            $service = $stmt->fetch();
            
            if ($service) {
                $service['features'] = json_decode($service['features'], true) ?? [];
            }
            
            return $service;
        } catch (PDOException $e) {
            return null;
        }
    }
    
    // Créer un service
    public function create($data) {
        try {
            $sql = "INSERT INTO services (title, description, long_description, icon, color, features, price, duration, display_order, active) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $features = isset($data['features']) ? json_encode($data['features']) : '[]';
            
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['title'],
                $data['description'],
                $data['long_description'] ?? null,
                $data['icon'] ?? '💼',
                $data['color'] ?? '#0066FF',
                $features,
                $data['price'] ?? null,
                $data['duration'] ?? null,
                $data['display_order'] ?? 0,
                $data['active'] ?? true
            ]);
            
            if ($result) {
                return ['success' => true, 'id' => $this->pdo->lastInsertId()];
            }
            
            return ['success' => false];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Mettre à jour un service
    public function update($id, $data) {
        try {
            $fields = [];
            $params = [];
            
            foreach ($data as $key => $value) {
                if ($key === 'features') {
                    $value = json_encode($value);
                }
                $fields[] = "$key = ?";
                $params[] = $value;
            }
            
            $params[] = $id;
            $sql = "UPDATE services SET " . implode(', ', $fields) . " WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            return ['success' => $stmt->execute($params)];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer un service
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM services WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Compter les services
    public function count($activeOnly = false) {
        try {
            $sql = "SELECT COUNT(*) as total FROM services";
            if ($activeOnly) {
                $sql .= " WHERE active = TRUE";
            }
            
            $stmt = $this->pdo->query($sql);
            return $stmt->fetch()['total'];
        } catch (PDOException $e) {
            return 0;
        }
    }
}
?>