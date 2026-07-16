-- Base de Datos para VetCare
CREATE DATABASE IF NOT EXISTS vetcare_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vetcare_db;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('owner', 'vet') DEFAULT 'owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un Veterinario de prueba
INSERT INTO users (full_name, email, phone, password, role) VALUES 
('Dr. Ramírez', 'dr.ramirez@vetcare.com', '555-0101', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vet'),
('Carlos Santana', 'carlos@ejemplo.com', '555-0192', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'owner');
-- La contraseña por defecto es "password" (hash de prueba)

-- Tabla de Mascotas
CREATE TABLE IF NOT EXISTS pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age VARCHAR(20),
    weight VARCHAR(20),
    history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO pets (owner_id, name, species, breed, age, weight, history) VALUES 
(2, 'Max', 'Perro', 'Golden Retriever', '3 años', '25kg', 'Vacunación al día. Operado de ligamentos en 2025. Excelente estado general.'),
(2, 'Luna', 'Gato', 'Siamés', '2 años', '4kg', 'Alergia a mariscos. Próxima vacuna: Rabia. Presenta leve gingivitis.');

-- Tabla de Citas
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    date_time DATETIME NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- Tabla de Inventario
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    stock INT DEFAULT 0,
    unit VARCHAR(20),
    status_badge VARCHAR(50) DEFAULT 'Óptimo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO inventory (code, name, category, stock, unit, status_badge) VALUES 
('VAC-001', 'Vacuna Múltiple Canina', 'Vacunas', 3, 'dosis', 'Stock Crítico'),
('ANE-012', 'Anestesia Local (Frasco)', 'Anestésicos', 5, 'unidades', 'Nivel Bajo'),
('ANT-045', 'Antiparasitario Interno', 'Desparasitantes', 45, 'tabletas', 'Óptimo'),
('TIE-001', 'Croquetas Premium 15kg', 'Alimento', 25, 'sacos', 'Óptimo');
