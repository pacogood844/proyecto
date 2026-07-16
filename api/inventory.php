<?php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM inventory ORDER BY category, name");
        $items = $stmt->fetchAll();
        echo json_encode($items);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if(isset($input['action']) && $input['action'] == 'update') {
        $id = $input['id'] ?? null;
        $name = $input['name'] ?? null;
        $status = $input['status'] ?? null;
        
        // Si no tenemos ID intentamos actualizar por código
        if($id) {
            $stmt = $pdo->prepare("UPDATE inventory SET name = ?, status_badge = ? WHERE id = ?");
            $stmt->execute([$name, $status, $id]);
        } else {
            $code = $input['code'];
            $stmt = $pdo->prepare("UPDATE inventory SET name = ?, status_badge = ? WHERE code = ?");
            $stmt->execute([$name, $status, $code]);
        }
        echo json_encode(['success' => true]);
    }
}
?>
