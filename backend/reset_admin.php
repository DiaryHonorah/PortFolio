<?php
// Fichier pour réinitialiser l'admin automatiquement
require_once __DIR__ . '/config/database.php';

$username = 'admin';
$email = 'admin@portfolio.com';
$password = 'admin123';
$role = 'admin';

echo "========================================\n";
echo "RÉINITIALISATION DE L'ADMIN\n";
echo "========================================\n\n";

try {
    // Générer le hash
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Supprimer l'ancien utilisateur
    $stmt = $pdo->prepare("DELETE FROM users WHERE username = ?");
    $stmt->execute([$username]);
    echo "✅ Ancien utilisateur supprimé\n";
    
    // Créer le nouvel utilisateur
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
    $result = $stmt->execute([$username, $email, $hash, $role]);
    
    if ($result) {
        echo "✅ Nouvel utilisateur créé avec succès !\n\n";
        echo "========================================\n";
        echo "IDENTIFIANTS DE CONNEXION\n";
        echo "========================================\n\n";
        echo "   Utilisateur: admin\n";
        echo "   Mot de passe: admin123\n";
        echo "   Email: admin@portfolio.com\n";
        echo "   Role: admin\n\n";
        echo "========================================\n";
        echo "Le hash généré est:\n";
        echo $hash . "\n";
        echo "========================================\n";
    } else {
        echo "❌ Erreur lors de la création de l'utilisateur\n";
    }
} catch (PDOException $e) {
    echo "❌ Erreur base de données: " . $e->getMessage() . "\n";
}
?>