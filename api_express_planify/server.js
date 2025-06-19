const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Konfigurasi Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Ganti sesuai password MySQL kamu
  database: 'api_planify'
});

// Kunci Rahasia JWT
const JWT_SECRET = 'rahasia_jwt';

// Middleware untuk verifikasi token JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: 'Token tidak tersedia' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Format token salah' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Token tidak valid' });
    req.userId = user.id;
    next();
  });
};

// Middleware untuk memeriksa role admin
const checkAdmin = (req, res, next) => {
  const userId = req.userId;

  db.query("SELECT tier FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Gagal memeriksa role", error: err });
    if (!results.length || results[0].tier !== "admin") {
      return res.status(403).json({ success: false, message: "Akses ditolak. Hanya admin yang diizinkan." });
    }
    next();
  });
};

/*
=========================================================================================
User Authentication
=========================================================================================
*/

// Registrasi User
app.post('/auth/register', (req, res) => {
  const { username, email, password, tier = 'user', avatar = 'default_avatar.jpg' } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Username, email, dan password harus diisi' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengenkripsi password' });

    db.query('INSERT INTO users (username, email, password, tier, avatar) VALUES (?, ?, ?, ?, ?)', [username, email, hash, tier, avatar], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ success: false, message: 'Username atau email sudah terdaftar' });
        }
        return res.status(500).json({ success: false, message: 'Gagal mendaftar user', error: err });
      }
      res.status(201).json({ success: true, message: 'User berhasil didaftarkan' });
    });
  });
});

// Login User
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password harus diisi' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal login', error: err });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'Email atau password salah' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal membandingkan password' });
      if (!isMatch) return res.status(401).json({ success: false, message: 'Email atau password salah' });

      const token = jwt.sign({ id: user.id, username: user.username, tier: user.tier }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, message: 'Login berhasil', token });
    });
  });
});

// Mendapatkan data user yang sedang login
app.get('/auth/user', authMiddleware, (req, res) => {
  db.query('SELECT id, username, email, tier, avatar FROM users WHERE id = ?', [req.userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil data user', error: err });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    res.json(results[0]);
  });
});

// Update Profil User
app.put('/auth/user/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { username, email, avatar } = req.body;

  if (parseInt(id) !== req.userId) { // Pastikan user hanya bisa mengupdate profilnya sendiri
    return res.status(403).json({ success: false, message: "Akses ditolak. Anda hanya bisa mengupdate profil Anda sendiri." });
  }

  let updateFields = [];
  let updateValues = [];

  if (username) {
    updateFields.push('username = ?');
    updateValues.push(username);
  }
  if (email) {
    updateFields.push('email = ?');
    updateValues.push(email);
  }
  if (avatar) {
    updateFields.push('avatar = ?');
    updateValues.push(avatar);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada data untuk diupdate' });
  }

  const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
  updateValues.push(id);

  db.query(query, updateValues, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Username atau email sudah terdaftar' });
      }
      return res.status(500).json({ success: false, message: 'Gagal update profil user', error: err });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan atau tidak ada perubahan' });
    res.json({ success: true, message: 'Profil user berhasil diupdate' });
  });
});


/*
=========================================================================================
Workbook Endpoints
=========================================================================================
*/

// GET all workbooks for the logged-in user
app.get('/workbook', authMiddleware, (req, res) => {
  db.query('SELECT * FROM workbook WHERE user_id = ?', [req.userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil workbook', error: err });
    res.json(results);
  });
});

// GET a single workbook by ID for the logged-in user
app.get('/workbook/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM workbook WHERE id = ? AND user_id = ?', [id, req.userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil workbook', error: err });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan' });
    res.json(results[0]);
  });
});

// CREATE a new workbook
app.post('/workbook', authMiddleware, (req, res) => {
  const { title, description, thumbnail } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Judul workbook wajib diisi' });

  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format YYYY-MM-DD HH:MM:SS
  const lastEditedAt = createdAt;

  db.query('INSERT INTO workbook (user_id, title, description, thumbnail, created_at, last_edited_at, is_favorite, is_archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.userId, title, description, thumbnail, createdAt, lastEditedAt, 0, 0], // Default is_favorite and is_archived to 0
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal membuat workbook', error: err });
      res.status(201).json({ success: true, message: 'Workbook berhasil dibuat', id: result.insertId });
    });
});

// UPDATE a workbook by ID for the logged-in user
app.put('/workbook/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { title, description, thumbnail, is_favorite, is_archived } = req.body;
  const lastEditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let updateFields = [];
  let updateValues = [];

  if (title !== undefined) {
    updateFields.push('title = ?');
    updateValues.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    updateValues.push(description);
  }
  if (thumbnail !== undefined) {
    updateFields.push('thumbnail = ?');
    updateValues.push(thumbnail);
  }
  if (is_favorite !== undefined) {
    updateFields.push('is_favorite = ?');
    updateValues.push(is_favorite);
  }
  if (is_archived !== undefined) {
    updateFields.push('is_archived = ?');
    updateValues.push(is_archived);
  }

  updateFields.push('last_edited_at = ?');
  updateValues.push(lastEditedAt);

  if (updateFields.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada data untuk diupdate' });
  }

  const query = `UPDATE workbook SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
  updateValues.push(id, req.userId);

  db.query(query, updateValues, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengupdate workbook', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan atau tidak ada perubahan' });
    res.json({ success: true, message: 'Workbook berhasil diupdate' });
  });
});

// DELETE a workbook by ID for the logged-in user
app.delete('/workbook/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM workbook WHERE id = ? AND user_id = ?', [id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menghapus workbook', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan' });
    res.json({ success: true, message: 'Workbook berhasil dihapus' });
  });
});

/*
=========================================================================================
Task Endpoints
=========================================================================================
*/

// GET all tasks for a specific workbook of the logged-in user
app.get('/workbook/:workbookId/tasks', authMiddleware, (req, res) => {
  const { workbookId } = req.params;
  // Pastikan workbook tersebut milik user yang login
  db.query('SELECT * FROM workbook WHERE id = ? AND user_id = ?', [workbookId, req.userId], (err, workbookResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal memeriksa workbook', error: err });
    if (workbookResults.length === 0) return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan atau bukan milik Anda' });

    db.query('SELECT * FROM tasks WHERE workbook_id = ?', [workbookId], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil tasks', error: err });
      res.json(results);
    });
  });
});

// CREATE a new task in a specific workbook
app.post('/workbook/:workbookId/tasks', authMiddleware, (req, res) => {
  const { workbookId } = req.params;
  const { name, description, due_date, reminder_date, reminder_time, status = 'To Do', link } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Nama tugas wajib diisi' });

  // Pastikan workbook tersebut milik user yang login
  db.query('SELECT id FROM workbook WHERE id = ? AND user_id = ?', [workbookId, req.userId], (err, workbookResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal memeriksa workbook', error: err });
    if (workbookResults.length === 0) return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan atau bukan milik Anda' });

    db.query('INSERT INTO tasks (workbook_id, name, description, due_date, reminder_date, reminder_time, status, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [workbookId, name, description, due_date, reminder_date, reminder_time, status, link],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal membuat tugas', error: err });
        res.status(201).json({ success: true, message: 'Tugas berhasil dibuat', id: result.insertId });
      });
  });
});

// UPDATE a task in a specific workbook
app.put('/workbook/:workbookId/tasks/:taskId', authMiddleware, (req, res) => {
  const { workbookId, taskId } = req.params;
  const { name, description, due_date, reminder_date, reminder_time, status, link } = req.body;

  // Pastikan workbook tersebut milik user yang login
  db.query('SELECT id FROM workbook WHERE id = ? AND user_id = ?', [workbookId, req.userId], (err, workbookResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal memeriksa workbook', error: err });
    if (workbookResults.length === 0) return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan atau bukan milik Anda' });

    let updateFields = [];
    let updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (due_date !== undefined) {
      updateFields.push('due_date = ?');
      updateValues.push(due_date);
    }
    if (reminder_date !== undefined) {
      updateFields.push('reminder_date = ?');
      updateValues.push(reminder_date);
    }
    if (reminder_time !== undefined) {
      updateFields.push('reminder_time = ?');
      updateValues.push(reminder_time);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (link !== undefined) {
        updateFields.push('link = ?');
        updateValues.push(link);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data untuk diupdate' });
    }

    const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ? AND workbook_id = ?`;
    updateValues.push(taskId, workbookId);

    db.query(query, updateValues, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal mengupdate tugas', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan atau tidak ada perubahan' });
      res.json({ success: true, message: 'Tugas berhasil diupdate' });
    });
  });
});

// DELETE a task in a specific workbook
app.delete('/workbook/:workbookId/tasks/:taskId', authMiddleware, (req, res) => {
  const { workbookId, taskId } = req.params;

  // Pastikan workbook tersebut milik user yang login
  db.query('SELECT id FROM workbook WHERE id = ? AND user_id = ?', [workbookId, req.userId], (err, workbookResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal memeriksa workbook', error: err });
    if (workbookResults.length === 0) return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan atau bukan milik Anda' });

    db.query('DELETE FROM tasks WHERE id = ? AND workbook_id = ?', [taskId, workbookId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal menghapus tugas', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
      res.json({ success: true, message: 'Tugas berhasil dihapus' });
    });
  });
});

/*
=========================================================================================
Payment Endpoints (Admin Only)
=========================================================================================
*/

// GET all payments (Admin only)
app.get('/api/payments', authMiddleware, checkAdmin, (req, res) => {
  db.query('SELECT * FROM payment', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil pembayaran', error: err });
    res.json({ success: true, payments: results });
  });
});

// GET payment by ID (Admin only)
app.get('/api/payments/:id', authMiddleware, checkAdmin, (req, res) => {
  db.query('SELECT * FROM payment WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil pembayaran', error: err });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    res.json({ success: true, payment: results[0] });
  });
});

// CREATE payment (Admin only)
app.post('/api/payments', authMiddleware, checkAdmin, (req, res) => {
  const { user_id, amount, status } = req.body;
  const payment_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (!user_id || !amount || !status) {
    return res.status(400).json({ success: false, message: 'User ID, jumlah, dan status wajib diisi' });
  }

  db.query('INSERT INTO payment (user_id, amount, payment_date, status) VALUES (?, ?, ?, ?)', [user_id, amount, payment_date, status], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menambahkan pembayaran', error: err });
    res.status(201).json({ success: true, message: 'Pembayaran berhasil ditambahkan', id: result.insertId });
  });
});

// UPDATE payment (Admin only)
app.put('/api/payments/:id', authMiddleware, checkAdmin, (req, res) => {
  const { id } = req.params;
  const { user_id, amount, status } = req.body;
  const updateFields = [];
  const updateValues = [];

  if (user_id !== undefined) {
    updateFields.push('user_id = ?');
    updateValues.push(user_id);
  }
  if (amount !== undefined) {
    updateFields.push('amount = ?');
    updateValues.push(amount);
  }
  if (status !== undefined) {
    updateFields.push('status = ?');
    updateValues.push(status);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada data untuk diupdate' });
  }

  const query = `UPDATE payment SET ${updateFields.join(', ')} WHERE id = ?`;
  updateValues.push(id);

  db.query(query, updateValues, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengupdate pembayaran', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    res.json({ success: true, message: 'Pembayaran berhasil diupdate' });
  });
});

// DELETE payment (Admin only)
app.delete('/api/payments/:id', authMiddleware, checkAdmin, (req, res) => {
  db.query('DELETE FROM payment WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menghapus pembayaran', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    res.json({ success: true, message: 'Pembayaran berhasil dihapus' });
  });
});


/*
=========================================================================================
Upload Image
=========================================================================================
*/

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const nameFolder = req.query.nameFolder ?? 'other'; // Nama folder dari query param, default 'other'
    const username = req.userId ?? 'unknown'; // Dapatkan username dari token yang sudah di-decode
    const uploadPath = path.join(__dirname, 'uploads', `${nameFolder}_${username}`);
    fs.mkdirSync(uploadPath, { recursive: true }); // Buat folder jika belum ada
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  },
});

const upload = multer({ storage: storage });

// API untuk upload gambar
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Gagal upload: file tidak ditemukan' });
  }
  const nameFolder = req.query.nameFolder ?? 'other';
  const username = req.userId ?? 'unknown';
  const fileUrl = `/uploads/${nameFolder}_${username}/${req.file.filename}`;
  res.status(201).json({
    success: true,
    message: 'Upload berhasil',
    filename: req.file.filename,
    url: fileUrl
  });
});

/*
=========================================================================================
Server Listener
=========================================================================================
*/

const PORT = process.env.PORT || 3001; // Gunakan port dari environment variable atau 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});