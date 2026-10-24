<?php
require_once __DIR__ . '/../config/database.php';

class ProjectRating {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Récupérer la note moyenne d'un projet
    public function getAverage($projectId) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT 
                    AVG(rating) as average,
                    COUNT(*) as total
                FROM project_ratings 
                WHERE project_id = ?
            ");
            $stmt->execute([$projectId]);
            $result = $stmt->fetch();
            
            return [
                'average' => $result['average'] ? round($result['average'], 1) : 0,
                'total' => (int)$result['total']
            ];
        } catch (PDOException $e) {
            return ['average' => 0, 'total' => 0];
        }
    }
    
    // Récupérer toutes les notes d'un projet
    public function getByProjectId($projectId) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT * FROM project_ratings 
                WHERE project_id = ? 
                ORDER BY created_at DESC
            ");
            $stmt->execute([$projectId]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Vérifier si un visiteur a déjà noté
    public function hasVoted($projectId, $visitorIp) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT rating FROM project_ratings 
                WHERE project_id = ? AND visitor_ip = ?
            ");
            $stmt->execute([$projectId, $visitorIp]);
            $result = $stmt->fetch();
            return $result ? (int)$result['rating'] : false;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    // Ajouter ou mettre à jour une note
    public function rate($projectId, $rating, $comment = null) {
        try {
            $visitorIp = $_SERVER['REMOTE_ADDR'];
            
            // Vérifier si déjà noté
            $existing = $this->hasVoted($projectId, $visitorIp);
            
            if ($existing !== false) {
                // Mettre à jour
                $stmt = $this->pdo->prepare("
                    UPDATE project_ratings 
                    SET rating = ?, comment = ?, updated_at = NOW() 
                    WHERE project_id = ? AND visitor_ip = ?
                ");
                $stmt->execute([$rating, $comment, $projectId, $visitorIp]);
                $action = 'updated';
            } else {
                // Insérer
                $stmt = $this->pdo->prepare("
                    INSERT INTO project_ratings (project_id, visitor_ip, rating, comment) 
                    VALUES (?, ?, ?, ?)
                ");
                $stmt->execute([$projectId, $visitorIp, $rating, $comment]);
                $action = 'created';
            }
            
            $average = $this->getAverage($projectId);
            
            return [
                'success' => true,
                'action' => $action,
                'average' => $average['average'],
                'total' => $average['total']
            ];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Supprimer une note
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM project_ratings WHERE id = ?");
            return ['success' => $stmt->execute([$id])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Récupérer le top des projets
    public function getTopProjects($limit = 5) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT 
                    p.id, p.title, p.category,
                    AVG(r.rating) as average,
                    COUNT(r.id) as total
                FROM projects p
                INNER JOIN project_ratings r ON p.id = r.project_id
                GROUP BY p.id
                ORDER BY average DESC, total DESC
                LIMIT ?
            ");
            $stmt->bindValue(1, $limit, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Récupérer les statistiques globales
    public function getGlobalStats() {
        try {
            $stmt = $this->pdo->query("
                SELECT 
                    COUNT(*) as total_ratings,
                    AVG(rating) as global_average,
                    COUNT(DISTINCT project_id) as rated_projects,
                    COUNT(DISTINCT visitor_ip) as unique_voters
                FROM project_ratings
            ");
            $result = $stmt->fetch();
            
            return [
                'total_ratings' => (int)$result['total_ratings'],
                'global_average' => $result['global_average'] ? round($result['global_average'], 1) : 0,
                'rated_projects' => (int)$result['rated_projects'],
                'unique_voters' => (int)$result['unique_voters']
            ];
        } catch (PDOException $e) {
            return [
                'total_ratings' => 0,
                'global_average' => 0,
                'rated_projects' => 0,
                'unique_voters' => 0
            ];
        }
    }
    
    // Supprimer toutes les notes d'un projet
    public function deleteByProjectId($projectId) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM project_ratings WHERE project_id = ?");
            return ['success' => $stmt->execute([$projectId])];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>