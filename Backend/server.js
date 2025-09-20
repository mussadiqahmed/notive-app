require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit to handle larger notes with media
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to handle database queries
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
}

// Helper function to generate conversation title from conversation messages
async function generateConversationTitle(messages) {
  try {
    // Get the first few user messages to understand the conversation topic
    const userMessages = messages.filter(msg => msg.role === 'user').slice(0, 3);
    const conversationContext = userMessages.map(msg => msg.content).join(' ');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate a concise, descriptive title (5-7 words) for a conversation based on the user messages. The title should capture the main topic or intent. Examples: "Weather Forecast Help", "Recipe Recommendations", "Code Debugging", "Travel Planning", "Business Strategy Discussion". Return only the title, no quotes or extra text.'
        },
        {
          role: 'user',
          content: conversationContext
        }
      ],
      max_tokens: 25,
      temperature: 0.3,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating conversation title:', error);
    // Fallback to a truncated version of the first message
    const firstMessage = messages.find(msg => msg.role === 'user')?.content || 'New Chat';
    return firstMessage.length > 50 
      ? firstMessage.substring(0, 47) + '...' 
      : firstMessage;
  }
}

// Ensure required tables exist
async function ensureTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      plan VARCHAR(20) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS folders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      icon TEXT,
      parent_id INTEGER REFERENCES folders(id) ON DELETE SET NULL,
      is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Backfill columns for existing deployments where folders table predates new columns
  await query('ALTER TABLE folders ADD COLUMN IF NOT EXISTS icon TEXT');
  await query('ALTER TABLE folders ADD COLUMN IF NOT EXISTS parent_id INTEGER');
  await query('ALTER TABLE folders ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE');
  await query('ALTER TABLE folders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
  await query('ALTER TABLE folders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
  // Add FK for parent_id if not present (safe to try)
  try { 
    await query('ALTER TABLE folders ADD CONSTRAINT folders_parent_fk FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE SET NULL'); 
  } catch (error) {
    // Constraint might already exist, ignore the error
    if (error.code !== '42710') { // 42710 is the duplicate constraint error code
      console.error('Error adding foreign key constraint:', error);
    }
  }
  
  // Migrate files table to use BIGSERIAL if needed
  try {
    await query('ALTER TABLE files ALTER COLUMN id TYPE BIGINT');
    console.log('Files table migrated to BIGINT');
  } catch (e) {
    // Table might not exist yet or already migrated
    console.log('Files table migration check completed');
  }

  await query(`
    CREATE TABLE IF NOT EXISTS files (
      id BIGSERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      folder_id INTEGER REFERENCES folders(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      type VARCHAR(20) NOT NULL, -- note | image | video | document
      content JSONB,             -- for notes
      file_path TEXT,            -- for media/documents
      mime_type TEXT,
      size BIGINT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id BIGSERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      folder_id INTEGER REFERENCES folders(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role VARCHAR(20) NOT NULL, -- user | assistant
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('Database tables are ready (created or already existed).');
}

// Seed dummy users (test1/test2) with password 12345
async function seedUsers() {
  try {
    const usersToSeed = [
      { name: 'test1', email: 'test1@example.com', password: '123456' },
      { name: 'test2', email: 'test2@example.com', password: '123456' },
    ];
    for (const u of usersToSeed) {
      const exists = await query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (exists.rows.length === 0) {
        const hash = await bcrypt.hash(u.password, 10);
        await query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [u.name, u.email, hash]);
      }
    }
    console.log('Dummy users ensured: test1@example.com, test2@example.com (password: 123456)');
  } catch (e) {
    console.error('Seed Users Error:', e);
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Static serving for uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeOriginal = (file.originalname || 'file').replace(/[^a-zA-Z0-9_.-]/g, '_');
    const finalName = `${unique}-${safeOriginal}`;
    cb(null, finalName);
  }
});
const upload = multer({ storage });

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required',
        code: 'MISSING_FIELDS'
      });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters',
        code: 'WEAK_PASSWORD'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if email exists
    const emailCheck = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }
    
    // Insert user
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      success: true,
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    });
    
  } catch (err) {
    console.error('Registration Error:', {
      message: err.message,
      stack: err.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Find user by email
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const user = userResult.rows[0];
    
    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({ 
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (err) {
    console.error('Login Error:', {
      message: err.message,
      stack: err.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Protected route example
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query('SELECT id, name, email FROM users WHERE id = $1', [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required', code: 'MISSING_FIELDS' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format', code: 'INVALID_EMAIL' });
    }

    // Ensure email is unique for other users
    const emailCheck = await query('SELECT id FROM users WHERE email = $1 AND id <> $2', [email, userId]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already in use', code: 'EMAIL_EXISTS' });
    }

    const result = await query(
      'UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, email',
      [name, email, userId]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Token refresh endpoint
app.post('/refresh-token', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided',
        code: 'NO_TOKEN'
      });
    }
    
    // Verify the token (even if expired, we can still get the payload)
    jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }
      
      // Check if user still exists
      const result = await query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);
      if (result.rows.length === 0) {
        return res.status(401).json({ 
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      const user = result.rows[0];
      
      // Generate new token
      const newToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(200).json({ 
        success: true,
        token: newToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    });
    
  } catch (err) {
    console.error('Token Refresh Error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Change password
app.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Old and new passwords are required', code: 'MISSING_FIELDS' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters', code: 'WEAK_PASSWORD' });
    }

    const userResult = await query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found', code: 'NOT_FOUND' });
    }

    const validPassword = await bcrypt.compare(oldPassword, userResult.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Old password is incorrect', code: 'INVALID_CREDENTIALS' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashed, userId]);

    res.json({ success: true });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Plans (static)
app.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: [
      { name: 'Lite', price: '$17/mo', tokens: '100,000', storage: '10 GB' },
      { name: 'Standard', price: '$47/mo', tokens: '500,000', storage: '100 GB' },
      { name: 'Pro', price: '$97/mo', tokens: 'Unlimited', storage: 'Unlimited' }
    ]
  });
});

// Subscribe or update subscription
app.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body;

    const allowed = ['Lite', 'Standard', 'Pro'];
    if (!allowed.includes(plan)) {
      return res.status(400).json({ success: false, error: 'Invalid plan', code: 'INVALID_PLAN' });
    }

    const result = await query(
      `INSERT INTO subscriptions (user_id, plan) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET plan = EXCLUDED.plan, updated_at = NOW()
       RETURNING user_id, plan, created_at, updated_at`,
      [userId, plan]
    );

    res.json({ success: true, subscription: result.rows[0] });
  } catch (err) {
    console.error('Subscribe Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Get current subscription
app.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query('SELECT user_id, plan, created_at, updated_at FROM subscriptions WHERE user_id = $1', [userId]);
    res.json({ success: true, subscription: result.rows[0] || null });
  } catch (err) {
    console.error('Get Subscription Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// ===== Folders API =====
app.get('/folders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { parentId } = req.query;
    const params = [userId];
    let sql = 'SELECT id, name, icon, parent_id AS "parentId", is_deleted AS "isDeleted", created_at AS "createdAt", updated_at AS "updatedAt" FROM folders WHERE user_id = $1';
    if (parentId) {
      params.push(parentId);
      sql += ' AND parent_id = $2';
    }
    sql += ' AND is_deleted = FALSE ORDER BY created_at ASC';
    const result = await query(sql, params);
    res.json({ success: true, folders: result.rows });
  } catch (err) {
    console.error('List Folders Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/folders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, icon, parentId } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Folder name is required' });
    }
    const result = await query(
      'INSERT INTO folders (user_id, name, icon, parent_id) VALUES ($1, $2, $3, $4) RETURNING id, name, icon, parent_id AS "parentId", is_deleted AS "isDeleted", created_at AS "createdAt", updated_at AS "updatedAt"',
      [userId, name, icon || null, parentId || null]
    );
    res.status(201).json({ success: true, folder: result.rows[0] });
  } catch (err) {
    console.error('Create Folder Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.put('/folders/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const folderId = req.params.id;
    const { name, icon, parentId } = req.body;
    const result = await query(
      'UPDATE folders SET name = COALESCE($1, name), icon = COALESCE($2, icon), parent_id = COALESCE($3, parent_id), updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING id, name, icon, parent_id AS "parentId", is_deleted AS "isDeleted", created_at AS "createdAt", updated_at AS "updatedAt"',
      [name || null, icon || null, parentId || null, folderId, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Folder not found' });
    res.json({ success: true, folder: result.rows[0] });
  } catch (err) {
    console.error('Update Folder Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.delete('/folders/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const folderId = req.params.id;
    const result = await query('UPDATE folders SET is_deleted = TRUE, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING id', [folderId, userId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Folder not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Folder Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ===== Files API =====
app.get('/files', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { folderId } = req.query;
    const params = [userId];
    let sql = 'SELECT id, folder_id AS "folderId", name, type, content, file_path AS "filePath", mime_type AS "mimeType", size, created_at AS "createdAt", updated_at AS "updatedAt" FROM files WHERE user_id = $1';
    if (folderId) {
      params.push(folderId);
      sql += ' AND folder_id = $2';
    }
    sql += ' ORDER BY created_at ASC';
    const result = await query(sql, params);
    res.json({ success: true, files: result.rows });
  } catch (err) {
    console.error('List Files Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create a note file
app.post('/files', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { folderId, name, type, content } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, error: 'Name and type are required' });
    }
    if (type !== 'note') {
      return res.status(400).json({ success: false, error: 'Use /upload for media/documents' });
    }
    // Ensure valid JSON for content
    let jsonContent = null;
    if (content !== undefined && content !== null) {
      try {
        let normalized;
        if (Array.isArray(content)) {
          normalized = content;
        } else if (typeof content === 'string') {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) normalized = parsed; else normalized = [parsed];
        } else if (typeof content === 'object') {
          normalized = [content];
        } else {
          normalized = [];
        }
        jsonContent = JSON.stringify(normalized);
      } catch (_) {
        // Fallback: wrap raw string as a text item
        jsonContent = JSON.stringify([{ type: 'text', value: String(content) }]);
      }
    }
    const result = await query(
      'INSERT INTO files (user_id, folder_id, name, type, content) VALUES ($1, $2, $3, $4, $5::jsonb) RETURNING id, folder_id AS "folderId", name, type, content, created_at AS "createdAt", updated_at AS "updatedAt"',
      [userId, folderId || null, name, 'note', jsonContent]
    );
    res.status(201).json({ success: true, file: result.rows[0] });
  } catch (err) {
    console.error('Create Note Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.put('/files/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;
    const { name, content, folderId } = req.body;
    let jsonContent = null;
    if (content !== undefined && content !== null) {
      try {
        let normalized;
        if (Array.isArray(content)) {
          normalized = content;
        } else if (typeof content === 'string') {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) normalized = parsed; else normalized = [parsed];
        } else if (typeof content === 'object') {
          normalized = [content];
        } else {
          normalized = [];
        }
        jsonContent = JSON.stringify(normalized);
      } catch (_) {
        jsonContent = JSON.stringify([{ type: 'text', value: String(content) }]);
      }
    }
    const result = await query(
      'UPDATE files SET name = COALESCE($1, name), content = COALESCE($2::jsonb, content), folder_id = COALESCE($3, folder_id), updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING id, folder_id AS "folderId", name, type, content, file_path AS "filePath", mime_type AS "mimeType", size, created_at AS "createdAt", updated_at AS "updatedAt"',
      [name || null, jsonContent, folderId || null, fileId, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'File not found' });
    res.json({ success: true, file: result.rows[0] });
  } catch (err) {
    console.error('Update File Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.delete('/files/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;
    // Delete file record and remove disk file if exists
    const existing = await query('SELECT file_path FROM files WHERE id = $1 AND user_id = $2', [fileId, userId]);
    if (existing.rows.length === 0) return res.status(404).json({ success: false, error: 'File not found' });
    const filePath = existing.rows[0].file_path;
    await query('DELETE FROM files WHERE id = $1 AND user_id = $2', [fileId, userId]);
    if (filePath) {
      const abs = path.join(__dirname, filePath.startsWith('/uploads') ? filePath.replace(/^\//, '') : filePath);
      fs.unlink(abs, () => {});
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete File Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get individual file content
app.get('/files/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;
    
    const result = await query(
      'SELECT id, folder_id AS "folderId", name, type, content, file_path AS "filePath", mime_type AS "mimeType", size, created_at AS "createdAt", updated_at AS "updatedAt" FROM files WHERE id = $1 AND user_id = $2',
      [fileId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    res.json({ success: true, file: result.rows[0] });
  } catch (err) {
    console.error('Get File Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Upload media/document; field name: file
app.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { folderId, name, type } = req.body;
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const allowed = ['image', 'video', 'document'];
    const safeType = allowed.includes(type) ? type : 'document';
    const relativePath = `/uploads/${req.file.filename}`;
    const finalName = name || req.file.originalname || req.file.filename;
    const result = await query(
      'INSERT INTO files (user_id, folder_id, name, type, file_path, mime_type, size) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, folder_id AS "folderId", name, type, file_path AS "filePath", mime_type AS "mimeType", size, created_at AS "createdAt", updated_at AS "updatedAt"',
      [userId, folderId ? Number(folderId) : null, finalName, safeType, relativePath, req.file.mimetype || null, req.file.size || null]
    );
    res.status(201).json({ success: true, file: result.rows[0] });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Internal server error' });
  }
});

// ===== Conversations API =====

// Get conversations for a folder
app.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { folderId } = req.query;
    
    let sql = `
      SELECT c.id, c.title, c.folder_id AS "folderId", c.created_at AS "createdAt", c.updated_at AS "updatedAt",
             COUNT(m.id) as message_count
      FROM conversations c
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE c.user_id = $1
    `;
    const params = [userId];
    
    if (folderId) {
      sql += ' AND c.folder_id = $2';
      params.push(folderId);
    }
    
    sql += ' GROUP BY c.id, c.title, c.folder_id, c.created_at, c.updated_at ORDER BY c.updated_at DESC';
    
    const result = await query(sql, params);
    res.json({ success: true, conversations: result.rows });
  } catch (err) {
    console.error('Get Conversations Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create a new conversation
app.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { folderId, title } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    
    const result = await query(
      'INSERT INTO conversations (user_id, folder_id, title) VALUES ($1, $2, $3) RETURNING id, title, folder_id AS "folderId", created_at AS "createdAt", updated_at AS "updatedAt"',
      [userId, folderId || null, title]
    );
    
    res.status(201).json({ success: true, conversation: result.rows[0] });
  } catch (err) {
    console.error('Create Conversation Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get messages for a conversation
app.get('/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    
    // Verify conversation belongs to user
    const convCheck = await query(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, userId]
    );
    
    if (convCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    
    const result = await query(
      'SELECT id, role, content, created_at AS "createdAt" FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );
    
    res.json({ success: true, messages: result.rows });
  } catch (err) {
    console.error('Get Messages Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Send a message and get AI response
app.post('/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Message content is required' });
    }
    
    // Verify conversation belongs to user
    const convCheck = await query(
      'SELECT id, folder_id FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, userId]
    );
    
    if (convCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    
    // Save user message
    const userMessage = await query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING id, role, content, created_at AS "createdAt"',
      [conversationId, 'user', content.trim()]
    );
    
    // Get conversation history for context
    const historyResult = await query(
      'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );
    
    // Prepare messages for OpenAI
    const messages = historyResult.rows.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message for context
    const systemMessage = {
      role: 'system',
      content: 'You are NotiveAI, a helpful AI assistant integrated into a note-taking app. You help users with their notes, answer questions, provide insights, and assist with productivity tasks. Be concise, helpful, and friendly.'
    };
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    const aiResponse = completion.choices[0].message.content;
    
    // Save AI response
    const aiMessage = await query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING id, role, content, created_at AS "createdAt"',
      [conversationId, 'assistant', aiResponse]
    );
    
    // Update conversation timestamp
    await query(
      'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
      [conversationId]
    );
    
    // Generate title for new conversations (only if this is the first user message)
    const messageCount = await query(
      'SELECT COUNT(*) as count FROM messages WHERE conversation_id = $1 AND role = $2',
      [conversationId, 'user']
    );
    
    if (messageCount.rows[0].count === 1) {
      // This is the first user message, generate a title
      try {
        const allMessages = await query(
          'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
          [conversationId]
        );
        const generatedTitle = await generateConversationTitle(allMessages.rows);
        await query(
          'UPDATE conversations SET title = $1 WHERE id = $2',
          [generatedTitle, conversationId]
        );
      } catch (error) {
        console.error('Error updating conversation title:', error);
        // Continue without failing the request
      }
    }
    
    res.json({ 
      success: true, 
      messages: [
        userMessage.rows[0],
        aiMessage.rows[0]
      ]
    });
    
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update conversation title
app.put('/conversations/:id/title', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const { title } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    
    const result = await query(
      'UPDATE conversations SET title = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING id, title',
      [title.trim(), conversationId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    
    res.json({ success: true, conversation: result.rows[0] });
  } catch (err) {
    console.error('Update Conversation Title Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Regenerate conversation title using AI
app.post('/conversations/:id/regenerate-title', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    
    // Verify conversation belongs to user
    const convCheck = await query(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, userId]
    );
    
    if (convCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    
    // Get all messages for this conversation
    const messagesResult = await query(
      'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );
    
    if (messagesResult.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'No messages found in conversation' });
    }
    
    // Generate new title using AI
    const generatedTitle = await generateConversationTitle(messagesResult.rows);
    
    // Update the conversation title
    const result = await query(
      'UPDATE conversations SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING id, title',
      [generatedTitle, conversationId]
    );
    
    res.json({ success: true, conversation: result.rows[0] });
  } catch (err) {
    console.error('Regenerate Title Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Delete a conversation
app.delete('/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    
    const result = await query(
      'DELETE FROM conversations WHERE id = $1 AND user_id = $2 RETURNING id',
      [conversationId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Conversation Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
ensureTables()
  .then(() => seedUsers())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database tables:', err);
    process.exit(1);
  });