<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido");
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['id']) || !isset($data['history'])) {
        throw new Exception("Faltan campos obligatorios");
    }

    $id = intval($data['id']);
    $history = trim($data['history']);

    $stmt = $pdo->prepare("UPDATE pets SET history = ? WHERE id = ?");
    $stmt->execute([$history, $id]);

    echo json_encode(["success" => true, "message" => "Historial actualizado"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
