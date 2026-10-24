<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function findByUsername($username) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            return null;
        }
    }
    
    public function authenticate($username, $password) {
        $user = $this->findByUsername($username);
        if ($user && password_verify($password, $user['password_hash'])) {
            return $user;
        }
        return false;
    }
    
    public function create($data) {
        try {
            $sql = "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
            return $stmt->execute([
                $data['username'],
                $data['email'],
                $password_hash,
                $data['role'] ?? 'user'
            ]);
        } catch (PDOException $e) {
            return false;
        }
    }
}
?>