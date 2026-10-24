<?php
require_once __DIR__ . '/../config/database.php';

class Project {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getAll($featured = null) {
        try {
            $sql = "SELECT * FROM projects";
            if ($featured !== null) {
                $sql .= " WHERE featured = " . ($featured ? 1 : 0);
            }
            $sql .= " ORDER BY year DESC, id DESC";
            
            $stmt = $this->pdo->query($sql);
            $projects = $stmt->fetchAll();
            
            foreach ($projects as &$project) {
                $project['technologies'] = json_decode($project['technologies'], true);
            }
            
            return $projects;
        } catch (PDOException $e) {
            return [];
        }
    }
    
    public function getById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM projects WHERE id = ?");
            $stmt->execute([$id]);
            $project = $stmt->fetch();
            
            if ($project) {
                $project['technologies'] = json_decode($project['technologies'], true);
            }
            
            return $project;
        } catch (PDOException $e) {
            return null;
        }
    }
    
    public function create($data) {
        try {
            $sql = "INSERT INTO projects (title, slug, description, long_description, category, technologies, image_url, github_url, demo_url, featured, year) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $technologies = isset($data['technologies']) ? json_encode($data['technologies']) : '[]';
            
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                $data['title'],
                $data['slug'] ?? strtolower(str_replace(' ', '-', $data['title'])),
                $data['description'],
                $data['long_description'] ?? null,
                $data['category'] ?? null,
                $technologies,
                $data['image_url'] ?? null,
                $data['github_url'] ?? null,
                $data['demo_url'] ?? null,
                $data['featured'] ?? 0,
                $data['year'] ?? date('Y')
            ]);
            
            return ['success' => $result, 'id' => $result ? $this->pdo->lastInsertId() : null];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function update($id, $data) {
        try {
            $fields = [];
            $params = [];
            
            foreach ($data as $key => $value) {
                if ($key === 'technologies') {
                    $value = json_encode($value);
                }
                $fields[] = "$key = ?";
                $params[] = $value;
            }
            
            $params[] = $id;
            $sql = "UPDATE projects SET " . implode(', ', $fields) . " WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            return ['success' => $stmt->execute($params)];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM projects WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>