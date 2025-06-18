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


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti sesuai MySQL kamu
  database: 'api_planify'
});

const JWT_SECRET = 'rahasia_jwt';
const now = new Date();

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
Konfigurasi Image
=========================================================================================
*/
// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.userId ?? 'unknown'; // Pastikan `userName` tersedia di token
    const nameFolder = req.query.nameFolder ?? 'other';
    const userDir = path.join(__dirname, 'uploads', nameFolder+"_"+username);

    // Cek dan buat folder user jika belum ada
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

/*
=========================================================================================
Authentication
=========================================================================================
*/
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, photo_profile, providers } = req.body;
  if (!name || !email || !password || !photo_profile || !providers) {
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (name, email, password, photo_profile, providers,created_at,updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, photo_profile, providers, now, now],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });

        res.status(201).json({ success: true, message: 'Register berhasil!' });
      }
    );
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }

    const token = jwt.sign({ id: user.id,role: user.tier }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user,
        token
      }
    });
  });
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role; // <-- pastikan token menyimpan role
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

app.get('/api/auth/user', authMiddleware, (req, res) => {
  db.query(
    'SELECT id, name, email, photo_profile, tier, providers, created_at, updated_at FROM users WHERE id = ?',
    [req.userId],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }
      res.json(results[0]);
    }
  );
});

app.put('/api/auth/user', authMiddleware, (req, res) => {
  const { name, photo_profile, tier } = req.body;
  const updatedAt = new Date();
  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (photo_profile !== undefined) {
    fields.push('photo_profile = ?');
    values.push(photo_profile);
  }
  if (tier !== undefined) {
    fields.push('tier = ?');
    values.push(tier);
  }

  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada data yang dikirim untuk diperbarui' });
  }

  // Tambahkan updated_at dan userId ke query
  fields.push('updated_at = ?');
  values.push(updatedAt);
  values.push(req.userId); // untuk WHERE id = ?

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Gagal update user', error: err });
    }

    res.json({ success: true, message: 'Data user berhasil diupdate' });
  });
});

// khusus password
app.put('/api/auth/user/password', authMiddleware, (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password harus diisi' });

  const hashed = bcrypt.hashSync(password, 10);
  db.query(
    'UPDATE users SET password = ?, updated_at = ? WHERE id = ?',
    [hashed, new Date(), req.userId],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Gagal update password', error: err });
      }
      res.json({ success: true, message: 'Password berhasil diperbarui' });
    }
  );
});


app.delete('/api/auth/user', authMiddleware, (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal menghapus user', error: err });
    }
    res.json({ success: true, message: 'User berhasil dihapus' });
  });
});


app.post('/api/auth/logout', authMiddleware, (req, res) => {
  // Di client tinggal hapus token
  res.json({ message: 'Logged out (hapus token di client)' });
});

/*
=========================================================================================
Workbook
=========================================================================================
*/

// CREATE workbook
app.post('/api/workbook', authMiddleware, (req, res) => {
  const { title, thumbnail } = req.body;
  const now = new Date();
  db.query(
    'INSERT INTO workbooks (user_id, title, thumbnail, last_edited_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [req.userId, title, thumbnail || null, now, now, now],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal menambahkan workbook' });
      res.status(201).json({ success: true, message: 'Workbook ditambahkan', id: result.insertId });
    }
  );
});

// READ semua workbook user
app.get('/api/workbook', authMiddleware, (req, res) => {
  db.query('SELECT * FROM workbooks WHERE user_id = ?', [req.userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil workbook', error: err });
    res.json(results);
  });
});

// READ detail satu workbook
app.get('/api/workbook/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM workbooks WHERE id = ? AND user_id = ?', [id, req.userId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'Workbook tidak ditemukan' });
    res.json(results[0]);
  });
});

// UPDATE workbook
app.put('/api/workbook/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  const now = new Date();

  // Add 'is_favorite' to the allowedFields array
  const allowedFields = ['title', 'thumbnail', 'is_archived', 'is_favorite']; 
  const fieldsToUpdate = [];
  const values = [];

  for (const key of allowedFields) {
    if (req.body.hasOwnProperty(key)) {
      fieldsToUpdate.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  // Cek apakah ada field yang ingin diupdate
  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada field yang dikirim untuk diupdate' });
  }

  // Tambahkan kolom yang selalu diupdate
  fieldsToUpdate.push('last_edited_at = ?', 'updated_at = ?');
  values.push(now, now);

  // Tambahkan ID dan User untuk WHERE clause
  values.push(id, userId);

  const sql = `
    UPDATE workbooks 
    SET ${fieldsToUpdate.join(', ')}
    WHERE id = ? AND user_id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Gagal update workbook', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan atau bukan milikmu' });
    }
    res.json({ success: true, message: 'Workbook berhasil diupdate' });
  });
});



// DELETE workbook
app.delete('/api/workbook/:id', authMiddleware, (req, res) => {
  const id = req.params.id;

  // 1. Ambil dulu data workbook (khususnya thumbnail-nya)
  db.query('SELECT thumbnail FROM workbooks WHERE id = ? AND user_id = ?', [id, req.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal mengambil data workbook', error: err });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan atau bukan milikmu' });
    }

    const thumbnailUrl = rows[0].thumbnail;

    // 2. Hapus file gambar jika ada
    if (thumbnailUrl) {
      // Hapus base URL untuk mendapat relative path
      const localPath = thumbnailUrl.replace('http://127.0.0.1:3000/', '');
      const fullPath = path.join(__dirname, localPath);

      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Gagal menghapus file:", err);
          else console.log("File thumbnail dihapus:", fullPath);
        });
      }
    }

    // 3. Hapus data workbook dari database
    db.query('DELETE FROM workbooks WHERE id = ? AND user_id = ?', [id, req.userId], (err2, result) => {
      if (err2) {
        return res.status(500).json({ message: 'Gagal menghapus workbook', error: err2 });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Workbook tidak ditemukan atau tidak milikmu' });
      }
      res.json({ success: true, message: 'Workbook dan thumbnail berhasil dihapus' });
    });
  });
});


/*
=========================================================================================
Task
=========================================================================================
*/
app.post('/api/tasks', authMiddleware, (req, res) => {
  const {
    workbook_id,
    title,
    description,
    due_date,
    due_date_reminder,
    reminder_time,
    link_file,
    tipe
  } = req.body;

  const user_id = req.userId;
  const now = new Date();

  const sql = `INSERT INTO tasks 
    (user_id, workbook_id, title, description, due_date, due_date_reminder, reminder_time, link_file, tipe, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [user_id, workbook_id, title, description, due_date, due_date_reminder, reminder_time, link_file, tipe, now, now], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menambahkan task', error: err });
    res.status(201).json({ success: true, message: 'Task berhasil ditambahkan', id: result.insertId });
  });
});

app.get('/api/tasks', authMiddleware, (req, res) => {
  db.query('SELECT * FROM tasks WHERE user_id = ?', [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil data tasks', error: err });
    res.json(rows);
  });
});

app.get('/api/tasks/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM tasks WHERE workbook_id = ? AND user_id = ?', [id, req.userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil task', error: err });
    if (rows.length === 0) return res.status(200).json({ success: false, message: 'Task tidak ditemukan atau bukan milikmu' });
    res.json(rows);
  });
});

app.put('/api/tasks/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const user_id = req.userId;

  db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, user_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil data task', error: err });
    if (rows.length === 0) return res.status(200).json({ success: false, message: 'Task tidak ditemukan atau bukan milikmu' });

    const old = rows[0];

    const data = {
      title: req.body.title || old.title,
      description: req.body.description || old.description,
      due_date: req.body.due_date || old.due_date,
      due_date_reminder: req.body.due_date_reminder || old.due_date_reminder,
      reminder_time: req.body.reminder_time || old.reminder_time,
      link_file: req.body.link_file || old.link_file,
      updated_at: new Date()
    };

    const sql = `UPDATE tasks SET 
      title = ?, description = ?, due_date = ?, 
      due_date_reminder = ?, reminder_time = ?, link_file = ?, updated_at = ?
      WHERE id = ? AND user_id = ?`;

    db.query(sql, [data.title, data.description, data.due_date, data.due_date_reminder, data.reminder_time, data.link_file, data.updated_at, id, user_id], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal update task', error: err });
      if (result.affectedRows === 0) return res.status(200).json({ success: false, message: 'Task tidak ditemukan atau bukan milikmu' });
      res.json({ success: true, message: 'Task berhasil diupdate' });
    });
  });
});


app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menghapus task', error: err });
    if (result.affectedRows === 0) return res.status(200).json({ success: false, message: 'Task tidak ditemukan atau bukan milikmu' });
    res.json({ success: true, message: 'Task berhasil dihapus' });
  });
});

/*
=========================================================================================
Calender
=========================================================================================
*/
// CREATE calender_event
app.post('/api/calender_events', authMiddleware, (req, res) => {
  const {
    workbook_id,
    title,
    description,
    status,
    created_by,
    start_date,
    end_date,
    link,
    file
  } = req.body;

  const user_id = req.userId;
  const now = new Date();

  // Cek dulu workbook_id ada dan milik user
  db.query('SELECT id FROM workbooks WHERE id = ? AND user_id = ?', [workbook_id, user_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error mengecek workbook', error: err });
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Workbook tidak ditemukan atau bukan milikmu' });
    }

    // Kalau valid, lanjut insert
    const sql = `INSERT INTO calender_events
      (user_id, workbook_id, title, description, status, created_by, start_date, end_date, link, file, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql,
      [user_id, workbook_id, title, description, status, created_by, start_date, end_date, link, file, now, now],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal menambahkan event', error: err });
        res.status(201).json({ success: true, message: 'Event berhasil ditambahkan', id: result.insertId });
      }
    );
  });
});


// READ all calender_events milik user
app.get('/api/calender_events', authMiddleware, (req, res) => {
  db.query('SELECT * FROM calender_events WHERE user_id = ?', [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil data events', error: err });
    res.json(rows);
  });
});

// READ detail calender_event by id
app.get('/api/calender_events/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM calender_events WHERE id = ? AND user_id = ?', [id, req.userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil event', error: err });
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Event tidak ditemukan atau bukan milikmu' });
    res.json(rows[0]);
  });
});

// UPDATE calender_event
app.put('/api/calender_events/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const user_id = req.userId;

  db.query('SELECT * FROM calender_events WHERE id = ? AND user_id = ?', [id, user_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error mengambil data', error: err });
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Event tidak ditemukan atau bukan milikmu' });

    const old = rows[0];

    // Merge data baru dan lama
    const data = {
      workbook_id: req.body.workbook_id || old.workbook_id,
      title: req.body.title || old.title,
      description: req.body.description || old.description,
      status: req.body.status || old.status,
      created_by: req.body.created_by || old.created_by,
      start_date: req.body.start_date || old.start_date,
      end_date: req.body.end_date || old.end_date,
      link: req.body.link || old.link,
      file: req.body.file || old.file,
      updated_at: new Date()
    };

      const sql = `UPDATE calender_events SET
        workbook_id = ?, title = ?, description = ?, status = ?, created_by = ?,
        start_date = ?, end_date = ?, link = ?, file = ?, updated_at = ?
        WHERE id = ? AND user_id = ?`;

      db.query(sql,
        [data.workbook_id, data.title, data.description, data.status, data.created_by,
         data.start_date, data.end_date, data.link, data.file, data.updated_at, id, user_id],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, message: 'Gagal update event', error: err });
          if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Event tidak ditemukan atau bukan milikmu' });
          res.json({ success: true, message: 'Event berhasil diupdate' });
        });
    });
});


// DELETE calender_event
app.delete('/api/calender_events/:id', authMiddleware, (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM calender_events WHERE id = ? AND user_id = ?', [id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menghapus event', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Event tidak ditemukan atau bukan milikmu' });
    res.json({ success: true, message: 'Event berhasil dihapus' });
  });
});

/*
=========================================================================================
Notes
=========================================================================================
*/
// CREATE note
app.post('/api/notes', authMiddleware, (req, res) => {
  const { workbook_id, title, content } = req.body;
  const user_id = req.userId;
  const now = new Date();

  const sql = `INSERT INTO notes (user_id, workbook_id, title, content, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [user_id, workbook_id, title, content, now, now], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menambahkan note', error: err });
    res.status(201).json({ success: true, message: 'Note berhasil ditambahkan', id: result.insertId });
  });
});

// READ all notes milik user
app.get('/api/notes', authMiddleware, (req, res) => {
  const workbookId = req.query.workbook_id;
  db.query('SELECT * FROM notes WHERE user_id = ? AND workbook_id = ?', [req.userId , workbookId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil data notes', error: err });
    res.json(rows);
  });
});

// READ detail note by id
app.get('/api/notes/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM notes WHERE workbook_id = ? AND user_id = ?', [id, req.userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil note', error: err });
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Note tidak ditemukan atau bukan milikmu' });
    res.json(rows[0]);
  });
});

// UPDATE note
app.put('/api/notes/:id/:workbookid', authMiddleware, (req, res) => {
  const id = req.params.id;
  const workbook_id = req.params.workbookid
  const user_id = req.userId;

  db.query('SELECT * FROM notes WHERE id = ? AND user_id = ? AND workbook_id = ?', [id, user_id, workbook_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil data note', error: err });
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Note tidak ditemukan atau bukan milikmu' });

    const old = rows[0];

    const data = {
      workbook_id: req.body.workbook_id || old.workbook_id,
      title: req.body.title || old.title,
      content: req.body.content || old.content,
      updated_at: new Date()
    };

    const sql = `UPDATE notes SET workbook_id = ?, title = ?, content = ?, updated_at = ? WHERE id = ? AND user_id = ?`;

    db.query(sql, [data.workbook_id, data.title, data.content, data.updated_at, id, user_id], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal update note', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Note tidak ditemukan atau bukan milikmu' });
      res.json({ success: true, message: 'Note berhasil diupdate' });
    });
  });
});


// DELETE note
app.delete('/api/notes/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal menghapus note', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Note tidak ditemukan atau bukan milikmu' });
    res.json({ success: true, message: 'Note berhasil dihapus' });
  });
});


/*
=========================================================================================
Payment
=========================================================================================
*/

// CREATE Payment
app.post("/api/payments", authMiddleware, upload.single("image"), (req, res) => {
  const { amount, payment_method } = req.body;
  const image = req.file ? `PAYMENTS_${req.userId}/${req.file.filename}` : null;
  const now = new Date();

  const sql = `INSERT INTO payment 
    (user_id, amount, payment_method, payment_date, image, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql,
    [req.userId, amount, payment_method, now, image, now, now],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Gagal menambahkan pembayaran", error: err });
      res.status(201).json({ success: true, message: "Pembayaran ditambahkan", id: result.insertId });
    });
});


// READ all payments (for current user)
app.get("/api/payments", authMiddleware, (req, res) => {
  db.query("SELECT * FROM payment WHERE user_id = ?", [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Gagal mengambil data", error: err });
    res.json({ success: true, data: rows });
  });
});
// admin only
app.get("/api/payments/all", authMiddleware, checkAdmin, (req, res) => {
  const query = `
    SELECT 
      payment.*, 
      users.name AS user_name, 
      users.email AS user_email 
    FROM 
      payment 
    JOIN 
      users 
    ON 
      payment.user_id = users.id
  `;

  db.query(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal mengambil data", error: err });
    }
    res.json({ success: true, data: rows });
  });
});



// READ payment by ID (must be owned by user)
app.get("/api/payments/:id", authMiddleware, (req, res) => {
  const paymentId = req.params.id;

  let query = `
    SELECT 
      payment.*, 
      users.name, 
      users.email 
    FROM payment 
    JOIN users ON payment.user_id = users.id 
    WHERE payment.id = ?
  `;

  const params = [paymentId];

  // Jika bukan admin, tambahkan filter user_id
  if (req.userRole !== "admin") {
    query += " AND payment.user_id = ?";
    params.push(req.userId);
  }

  db.query(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal mengambil data", error: err });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan atau bukan milikmu" });
    }

    res.json({ success: true, data: rows[0] });
  });
});



// UPDATE payment
app.put("/api/payments/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const now = new Date();

  if (!status) {
    return res.status(400).json({ success: false, message: "Field 'status' wajib diisi" });
  }

  // Ambil data payment dulu untuk cek user_id-nya
  const getPaymentQuery = `SELECT * FROM payment WHERE id = ?`;
  db.query(getPaymentQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal mengambil data pembayaran", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Pembayaran tidak ditemukan" });
    }

    const payment = results[0];

    // Cek apakah pemilik data atau admin
    const isOwner = payment.user_id === req.userId;
    const isAdmin = req.userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Tidak memiliki akses untuk mengubah data ini" });
    }

    // Update pembayaran
    const updateQuery = `UPDATE payment SET status = ?, updated_at = ? WHERE id = ?`;
    db.query(updateQuery, [status, now, id], (err2, result) => {
      if (err2) {
        return res.status(500).json({ success: false, message: "Gagal update pembayaran", error: err2 });
      }

      if (status === "confirmed") {
        // Setelah dikonfirmasi, ubah tier user (pemilik pembayaran) jadi premium
        db.query("UPDATE users SET tier = 'premium', updated_at = ? WHERE id = ?", [now, payment.user_id], (err3) => {
          if (err3) {
            return res.status(500).json({
              success: true,
              message: "Pembayaran diupdate, tapi gagal update tier user",
              error: err3,
            });
          }
          return res.json({
            success: true,
            message: "Pembayaran berhasil diupdate & tier user diubah ke premium",
          });
        });
      } else {
        res.json({ success: true, message: "Pembayaran berhasil diupdate" });
      }
    });
  });
});



/*
=========================================================================================
Upload Image
=========================================================================================
*/

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



// DELETE payment
// app.delete("/api/payments/:id", authMiddleware, (req, res) => {
//   db.query("DELETE FROM payment WHERE id = ? AND user_id = ?", [req.params.id, req.userId], (err, result) => {
//     if (err) return res.status(500).json({ success: false, message: "Gagal menghapus pembayaran", error: err });
//     if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Data tidak ditemukan atau bukan milikmu" });
//     res.json({ success: true, message: "Pembayaran berhasil dihapus" });
//   });
// });



app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
