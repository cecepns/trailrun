-- KebonKito TrailRun Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS kebonkito_trailrun;
USE kebonkito_trailrun;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category ENUM('trail', 'ultra', 'fun-run', 'marathon') NOT NULL,
    distance INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    max_participants INT NOT NULL,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payment methods table
CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('bank', 'ewallet', 'qris') NOT NULL,
    description TEXT,
    account_number VARCHAR(100),
    account_name VARCHAR(255),
    qr_code VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Registrations table
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    payment_method_id INT,
    payment_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    ukuran_baju VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_event (user_id, event_id)
);

-- FAQs table
CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (name, email, password, phone, emergency_contact, role) VALUES 
('Admin', 'admin@kebonkitotrailrun.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', '081234567890', 'admin');
-- Password: password

-- Insert sample events
INSERT INTO events (title, description, date, time, location, category, distance, price, max_participants, image) VALUES 
('KebonKito Trail Run 2024', 'Trail run pertama di tahun 2024 dengan rute yang menantang dan pemandangan yang indah', '2024-03-15', '06:00:00', 'Taman Nasional Gunung Gede Pangrango', 'trail', 10, 150000, 100, 'https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg'),
('Ultra Marathon KebonKito', 'Tantangan ultra marathon untuk runner berpengalaman', '2024-04-20', '05:00:00', 'Gunung Salak, Bogor', 'ultra', 42, 300000, 50, 'https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg'),
('Fun Run KebonKito', 'Lari santai untuk keluarga dan pemula', '2024-05-10', '07:00:00', 'Kebun Raya Bogor', 'fun-run', 5, 75000, 200, 'https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg');

-- Insert sample payment methods
INSERT INTO payment_methods (name, type, description, account_number, account_name, active) VALUES 
('Bank BCA', 'bank', 'Transfer ke rekening BCA', '1234567890', 'KebonKito TrailRun', TRUE),
('Bank Mandiri', 'bank', 'Transfer ke rekening Mandiri', '0987654321', 'KebonKito TrailRun', TRUE),
('OVO', 'ewallet', 'Transfer ke OVO', '081234567890', 'KebonKito TrailRun', TRUE),
('GoPay', 'ewallet', 'Transfer ke GoPay', '081234567890', 'KebonKito TrailRun', TRUE);

-- Insert sample FAQs
INSERT INTO faqs (question, answer) VALUES 
('Bagaimana cara mendaftar event?', 'Anda dapat mendaftar dengan mengklik tombol "Daftar" pada halaman event yang diinginkan. Setelah itu, Anda akan diminta untuk login atau membuat akun baru jika belum memiliki akun.'),
('Apa yang harus dibawa saat event?', 'Peserta wajib membawa:\n- Botol air minum pribadi\n- Sepatu trail running yang sesuai\n- Pakaian olahraga yang nyaman\n- Nomor bib yang sudah diberikan\n- ID Card/KTP untuk verifikasi'),
('Bagaimana jika cuaca buruk?', 'Event akan tetap dijalankan kecuali ada kondisi cuaca ekstrem yang membahayakan keselamatan peserta. Informasi pembatalan akan diumumkan 24 jam sebelum event dimulai.'),
('Apakah ada batas waktu untuk menyelesaikan race?', 'Ya, setiap kategori memiliki batas waktu yang berbeda:\n- Fun Run (5km): 1 jam\n- Trail Run (10km): 2 jam\n- Marathon (21km): 3 jam\n- Ultra Marathon (42km): 6 jam'),
('Bagaimana cara pembayaran?', 'Setelah mendaftar, Anda akan diarahkan ke halaman pembayaran. Pilih metode pembayaran yang tersedia (Bank Transfer, E-Wallet, atau QRIS), lakukan pembayaran sesuai nominal, dan konfirmasi pembayaran. Tim admin akan memverifikasi dalam 1x24 jam.'),
('Apakah bisa refund jika tidak bisa hadir?', 'Refund dapat dilakukan maksimal 7 hari sebelum event dengan potongan biaya administrasi 25%. Setelah itu, tidak ada refund yang dapat dilakukan.'),
('Apa fasilitas yang disediakan?', 'Fasilitas yang disediakan meliputi:\n- Medal finisher\n- Sertifikat digital\n- Post point setiap 5km\n- Tim medis standby\n- Shuttle bus dari titik kumpul\n- Fotografer official\n- Konsumsi setelah finish'),
('Dimana lokasi start dan finish?', 'Lokasi start dan finish berada di tempat yang sama sesuai dengan yang tertera pada detail event. Peserta akan mendapat informasi lengkap via email dan WhatsApp 3 hari sebelum event.');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);