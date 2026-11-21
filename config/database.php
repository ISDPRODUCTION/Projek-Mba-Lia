<?php
/**
 * ====================================================================================
 * KONFIGURASI KONEKSI DATABASE (MySQL PDO)
 * ====================================================================================
 * Panduan Programmer:
 * 1. File ini adalah pusat koneksi database untuk seluruh aplikasi (survei & admin).
 * 2. Pastikan MySQL sudah aktif (misalnya di XAMPP / Laragon).
 * 3. Import file `database.sql` ke MySQL Anda (melalui phpMyAdmin atau CLI).
 * 4. Sesuaikan konstanta / variabel koneksi di bawah ini jika username/password berbeda.
 * ====================================================================================
 */

$host    = 'localhost';
$db      = 'db_ikm_pdam';
$user    = 'root';
$pass    = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Memberi pesan error yang jelas jika database belum dibuat / belum di-import
    die("
        <div style='font-family:sans-serif; max-width:600px; margin:40px auto; padding:20px; border:1px solid #f87171; background:#fef2f2; border-radius:8px;'>
            <h3 style='color:#b91c1c; margin-top:0;'>⚠️ Gagal Terhubung ke Database MySQL</h3>
            <p><strong>Pesan Kesalahan:</strong> " . htmlspecialchars($e->getMessage()) . "</p>
            <hr style='border:0; border-top:1px solid #fecaca; margin:15px 0;'>
            <p><strong>Panduan untuk Programmer:</strong></p>
            <ol style='padding-left:20px; line-height:1.6;'>
                <li>Pastikan MySQL di XAMPP/Laragon sudah dalam status <strong>START / Running</strong>.</li>
                <li>Pastikan file <code>database.sql</code> sudah di-import ke MySQL (nama database: <code>{$db}</code>).</li>
                <li>Periksa kredensial di file <code>config/database.php</code> (host: <code>{$host}</code>, user: <code>{$user}</code>).</li>
            </ol>
        </div>
    ");
}
?>
