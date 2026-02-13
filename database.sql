-- BASE DE DATOS: travel_fast_db
-- Creado para MySQL 8.0+
-- Enfoque: Escalabilidad, Integridad Transaccional, Multi-vehículo

SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABLA DE USUARIOS (Administradores, Conductores, Clientes)
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `dni` VARCHAR(8) NOT NULL UNIQUE,
    `phone` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NULL, -- Null para clientes que no se loguean
    `role` ENUM('admin', 'driver', 'customer') NOT NULL DEFAULT 'customer',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. TABLA DE VEHÍCULOS (Escalabilidad de flota)
CREATE TABLE `vehicles` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `plate_number` VARCHAR(10) NOT NULL UNIQUE,
    `model` VARCHAR(50) NOT NULL, -- Ej: Toyota Hilux
    `capacity` INT NOT NULL DEFAULT 6,
    `status` ENUM('active', 'maintenance', 'retired') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE CONDUCTORES (Perfil extendido)
CREATE TABLE `drivers` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `license_number` VARCHAR(20) NOT NULL,
    `current_vehicle_id` BIGINT UNSIGNED NULL, -- Vehículo asignado actualmente
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`current_vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL
);

-- 4. TABLA DE VIAJES (La unidad operativa diaria)
-- Un 'Trip' es una salida específica (Ej: Lunes 10am)
CREATE TABLE `trips` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `driver_id` BIGINT UNSIGNED NULL, -- Puede ser asignado luego
    `vehicle_id` BIGINT UNSIGNED NULL,
    `departure_date` DATE NOT NULL,
    `departure_time` TIME NOT NULL,
    `route_from` VARCHAR(50) DEFAULT 'Jauja',
    `route_to` VARCHAR(50) DEFAULT 'Huancayo',
    `service_type` ENUM('PRIVATE', 'SHARED') NOT NULL,
    `status` ENUM('scheduled', 'boarding', 'in_transit', 'completed', 'cancelled') DEFAULT 'scheduled',
    `base_price` DECIMAL(10, 2) NOT NULL, -- Precio base guardado por histórico
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`),
    FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`)
);

-- 5. TABLA DE RESERVAS (La transacción comercial)
CREATE TABLE `bookings` (
    `id` CHAR(36) PRIMARY KEY, -- UUID
    `trip_id` BIGINT UNSIGNED NULL, -- Null si es una solicitud pendiente sin viaje asignado
    `user_id` BIGINT UNSIGNED NULL, -- Null si es "guest"
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_dni` VARCHAR(20) NOT NULL,
    `customer_phone` VARCHAR(20) NOT NULL,
    `seat_count` INT NOT NULL,
    `pickup_type` ENUM('KNOWN_POINT', 'EXACT_ADDRESS') NOT NULL,
    `pickup_address` TEXT NOT NULL,
    `is_airport_pickup` BOOLEAN DEFAULT FALSE,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `prepayment_amount` DECIMAL(10, 2) NOT NULL,
    `payment_proof_url` VARCHAR(255) NULL,
    `status` ENUM('PENDING_PAYMENT', 'VERIFYING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING_PAYMENT',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`)
);

-- 6. TABLA DE ASIENTOS RESERVADOS (Detalle exacto)
-- Permite saber qué asiento ocupó cada persona (Adelante, Ventana, etc.)
CREATE TABLE `booking_seats` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `booking_id` CHAR(36) NOT NULL,
    `seat_number` INT NOT NULL, -- 1 (Copiloto), 2-4 (Atrás), etc.
    `seat_label` VARCHAR(20) NULL, -- 'Frontal', 'Ventana Izq', etc.
    FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;
