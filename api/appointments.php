<?php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT a.*, p.name as pet_name, p.species 
            FROM appointments a 
            LEFT JOIN pets p ON a.pet_id = p.id 
            ORDER BY a.date_time DESC
        ");
        echo json_encode($stmt->fetchAll());
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Si no envían ID, le asignamos el ID 1 por defecto para la demo
    $pet_name = $input['pet_name'] ?? 'Max'; 
    $date_time = $input['date_time'];
    $reason = $input['reason'];
    
    try {
        // Buscar el ID basado en el nombre de la mascota
        $stmtPet = $pdo->prepare("SELECT id FROM pets WHERE name LIKE ? LIMIT 1");
        $stmtPet->execute(["%$pet_name%"]);
        $petRow = $stmtPet->fetch();
        $pet_id = $petRow ? $petRow['id'] : 1;

        $stmt = $pdo->prepare("INSERT INTO appointments (pet_id, date_time, reason) VALUES (?, ?, ?)");
        $stmt->execute([$pet_id, $date_time, $reason]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
