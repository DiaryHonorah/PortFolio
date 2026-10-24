<?php
require_once __DIR__ . '/../config/database.php';

class Skill {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Récupérer toutes les compétences
    public function getAll() {
        try {
            $stmt = $this->pdo->query("SELECT * FROM skills ORDER BY category, name");
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer les compétences par catégorie
    public function getByCategory($category) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM skills WHERE category = ? ORDER BY name");
            $stmt->execute([$category]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer toutes les catégories
    public function getCategories() {
        try {
            $stmt = $this->pdo->query("SELECT DISTINCT category FROM skills ORDER BY category");
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Créer une compétence
    public function create($data) {
        try {
            $sql = "INSERT INTO skills (name, category, icon, level, color) VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['name'],
                $data['category'],
                $data['icon'] ?? null,
                $data['level'] ?? 70,
                $data['color'] ?? '#0066FF'
            ]);
            return ['success' => $result, 'id' => $result ? $this->pdo->lastInsertId() : null];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Mettre à jour une compétence
    public function update($id, $data) {
        try {
            $fields = [];
            $params = [];
            
            foreach ($data as $key => $value) {
                $fields[] = "$key = ?";
                $params[] = $value;
            }
            
            $params[] = $id;
            $sql = "UPDATE skills SET " . implode(', ', $fields) . " WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            return ['success' => $stmt->execute($params)];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer une compétence
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM skills WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>