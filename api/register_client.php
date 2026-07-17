<?php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido");
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception("Datos inválidos");
    }

    // Extraer datos del Dueño
    $ownerName = $data['ownerName'] ?? '';
    $ownerPhone = $data['ownerPhone'] ?? '';
    $ownerEmail = $data['ownerEmail'] ?? '';
    $ownerAddress = $data['ownerAddress'] ?? '';

    // Extraer datos de la Mascota
    $petName = $data['petName'] ?? '';
    $petSpecies = $data['petSpecies'] ?? '';
    $petBreed = $data['petBreed'] ?? '';
    $petAge = $data['petAge'] ?? '';
    $petWeight = $data['petWeight'] ?? '';
    $petVaccines = $data['petVaccines'] ?? '';
    $petDeworming = $data['petDeworming'] ?? '';
    $petObservations = $data['petObservations'] ?? '';
    
    // Validaciones básicas
    if (empty($ownerName) || empty($ownerPhone) || empty($ownerEmail) || empty($petName) || empty($petSpecies)) {
        throw new Exception("Faltan campos obligatorios");
    }

    // Iniciar transacción
    $pdo->beginTransaction();

    // 1. Crear el usuario (Dueño)
    // La contraseña será el número de celular
    $password = password_hash($ownerPhone, PASSWORD_DEFAULT);

    $stmtUser = $pdo->prepare("INSERT INTO users (full_name, email, phone, address, password, role) VALUES (?, ?, ?, ?, ?, 'owner')");
    $stmtUser->execute([$ownerName, $ownerEmail, $ownerPhone, $ownerAddress, $password]);
    
    $ownerId = $pdo->lastInsertId();

    // 2. Crear la mascota (Pet)
    // Se guarda todo en las columnas correspondientes
    $stmtPet = $pdo->prepare("INSERT INTO pets (owner_id, name, species, breed, age, weight, vaccines, deworming, history, observations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // History y Observations pueden ser lo mismo, pero guardaremos en observations lo que escriban.
    $stmtPet->execute([
        $ownerId, 
        $petName, 
        $petSpecies, 
        $petBreed, 
        $petAge, 
        $petWeight, 
        $petVaccines, 
        $petDeworming,
        $petObservations, // history
        $petObservations  // observations
    ]);

    // Confirmar transacción
    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Cliente y paciente registrados", "owner_id" => $ownerId]);
    
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    // Si hay error de duplicado (correo o teléfono)
    if ($e->getCode() == 23000) {
        echo json_encode(["success" => false, "error" => "El correo electrónico ya está registrado"]);
    } else {
        echo json_encode(["success" => false, "error" => "Error de BD: " . $e->getMessage()]);
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
