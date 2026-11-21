# 📘 PANDUAN INTEGRASI DATABASE & EKSEKUSI PROGRAM

Aplikasi Indeks Kepuasan Masyarakat (IKM) PERUMDA Air Minum Tirta Lestari Kabupaten Tuban kini telah sepenuhnya dikonversi menjadi **PHP** dan terhubung ke database **MySQL (`database.sql`)**, serta mendukung pemilihan 16 Kantor Cabang PDAM.

---

## 🗂️ 1. Daftar File yang Terhubung ke Database

| No | File | Peran / Hubungan ke Database |
|---|---|---|
| 1 | [`config/database.php`](file:///D:/Dokumen/pdam%20lia/config/database.php) | **File Konfigurasi Pusat Koneksi PDO**. Mengatur host, database name (`db_ikm_pdam`), username (`root`), dan password. |
| 2 | [`proses-survei.php`](file:///D:/Dokumen/pdam%20lia/proses-survei.php) | Menerima data survei dari `index.php`, mengeksekusi `INSERT INTO responden` & `INSERT INTO jawaban_survei` dengan Transaction PDO. |
| 3 | [`admin/login.php`](file:///D:/Dokumen/pdam%20lia/admin/login.php) | Memvalidasi akun administrator dengan query `SELECT * FROM admin WHERE username = :username` dan `password_verify()`. |
| 4 | [`admin/dashboard.php`](file:///D:/Dokumen/pdam%20lia/admin/dashboard.php) | Mengambil seluruh data real-time, menghitung rata-rata 9 unsur pelayanan, nilai IKM, mutu pelayanan, dan menampilkan riwayat responden di tabel. |

---

## ⚙️ 2. Langkah Eksekusi oleh Programmer

### Langkah A: Import `database.sql` ke MySQL

#### Opsi 1 — Melalui phpMyAdmin (Paling Mudah):
1. Buka browser dan akses **`http://localhost/phpmyadmin`**.
2. Klik tab **"Import"** di menu atas.
3. Klik tombol **"Choose File"** lalu pilih file:  
   `D:\Dokumen\pdam lia\database.sql`
4. Gulir ke bawah dan klik **"Import"** / **"Go"**.
5. Database `db_ikm_pdam` beserta 3 tabel (`responden`, `jawaban_survei`, `admin`) dan 1 akun admin default akan otomatis terbuat.

#### Opsi 2 — Melalui MySQL CLI / Terminal:
```bash
mysql -u root -p < "D:\Dokumen\pdam lia\database.sql"
```

---

### Langkah B: Periksa Konfigurasi di `config/database.php`
Buka file [`config/database.php`](file:///D:/Dokumen/pdam%20lia/config/database.php) dan sesuaikan jika password MySQL lokal Anda bukan kosong:
```php
$host    = 'localhost';
$db      = 'db_ikm_pdam';
$user    = 'root';
$pass    = ''; // Ubah jika MySQL Anda menggunakan password
$charset = 'utf8mb4';
```

---

### Langkah C: Menjalankan Aplikasi

#### Menggunakan XAMPP / Laragon:
1. Pastikan folder proyek berada di dalam folder web server, misalnya:  
   `C:\xampp\htdocs\pdam-ikm\`
2. Buka browser:
   - Formulir Survei Masyarakat: **`http://localhost/pdam-ikm/index.php`**
   - Halaman Login Admin: **`http://localhost/pdam-ikm/admin/login.php`**

#### Atau Menggunakan PHP Built-in Server:
Buka terminal di folder proyek (`D:\Dokumen\pdam lia`):
```bash
php -S localhost:8000
```
Lalu buka browser:
- Survei: **`http://localhost:8000/index.php`**
- Login Admin: **`http://localhost:8000/admin/login.php`**

---

## 🔑 3. Akun Administrator Bawaan (Default)

- **Username**: `admin` *(atau `admin_merakurak`)*
- **Password**: `admin123`

---

## 💻 4. Rincian Kode & Query SQL pada Setiap File

### 1. `config/database.php` (Koneksi Database)
```php
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
$pdo = new PDO($dsn, $user, $pass, $options);
```

### 2. `proses-survei.php` (Simpan Data Responden & Jawaban)
```php
require_once __DIR__ . '/config/database.php';

$pdo->beginTransaction();

// 1. Simpan responden
$stmt = $pdo->prepare("INSERT INTO responden (tanggal_survei, kantor_cabang, jenis_kelamin, usia, pendidikan, pekerjaan, pekerjaan_lainnya, jenis_layanan) 
                       VALUES (:tanggal_survei, :kantor_cabang, :jenis_kelamin, :usia, :pendidikan, :pekerjaan, :pekerjaan_lainnya, :jenis_layanan)");
$stmt->execute([...]);
$responden_id = $pdo->lastInsertId();

// 2. Simpan jawaban 9 unsur SKM
$stmt = $pdo->prepare("INSERT INTO jawaban_survei (responden_id, u1, u2, u3, u4, u5, u6, u7, u8, u9, saran) 
                       VALUES (:responden_id, :u1, :u2, :u3, :u4, :u5, :u6, :u7, :u8, :u9, :saran)");
$stmt->execute([...]);

$pdo->commit();
header('Location: terima-kasih.php');
```

### 3. `admin/login.php` (Verifikasi Akun Admin)
```php
require_once __DIR__ . '/../config/database.php';

$stmt = $pdo->prepare("SELECT * FROM admin WHERE username = :username LIMIT 1");
$stmt->execute([':username' => $username]);
$admin = $stmt->fetch();

if ($admin && password_verify($password, $admin['password'])) {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_username']  = $admin['username'];
    header('Location: dashboard.php');
}
```

### 4. `admin/dashboard.php` (Perhitungan IKM & Rekapitulasi)
```php
require_once __DIR__ . '/../config/database.php';

// Menghitung NRR 9 unsur pelayanan
$queryStats = "SELECT COUNT(r.id) AS total_responden,
                      AVG(j.u1) AS avg_u1, AVG(j.u2) AS avg_u2, AVG(j.u3) AS avg_u3,
                      AVG(j.u4) AS avg_u4, AVG(j.u5) AS avg_u5, AVG(j.u6) AS avg_u6,
                      AVG(j.u7) AS avg_u7, AVG(j.u8) AS avg_u8, AVG(j.u9) AS avg_u9
               FROM responden r
               INNER JOIN jawaban_survei j ON r.id = j.responden_id";
$stats = $pdo->query($queryStats)->fetch();

// Rumus IKM
$totalNRR = ($avg_u1 + $avg_u2 + $avg_u3 + $avg_u4 + $avg_u5 + $avg_u6 + $avg_u7 + $avg_u8 + $avg_u9) / 9;
$nilaiIKM = $totalNRR * 25;
```
