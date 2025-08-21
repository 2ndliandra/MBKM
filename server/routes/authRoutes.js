import express from 'express'
import { connectToDatabase } from '../lib/Database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()
//register
router.post('/register', async (req, res) => {
    console.log('Register endpoint hit!');
    console.log('Request body:', req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ 
            message: "Username, email, dan password harus diisi" 
        });
    }

    try {
        const Database = await connectToDatabase();
        console.log('Database connected');

// cek tabel
        const [rows] = await Database.query('SELECT * FROM `users` WHERE Email = ?', [email]);
        console.log('Query result:', rows);

        if (rows.length > 0) {
            console.log('User already exists');
            return res.status(400).json({ 
                message: "Email sudah terdaftar" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');

        const [result] = await Database.query(
            "INSERT INTO users (`Username`, `Email`, `Password`) VALUES (?, ?, ?)", 
            [username, email, hashedPassword]
        );
        
        console.log('User inserted:', result.insertId);

        res.status(201).json({
            message: "Registrasi berhasil!",
            userId: result.insertId
        });

    } catch (err) {
        console.error('Registration error:', err);
        
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: "Username atau email sudah digunakan"
            });
        }
        
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({
                message: "Tabel users tidak ditemukan di database"
            });
        }

        res.status(500).json({
            message: "Terjadi kesalahan server",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

});
//Login
router.post('/login', async (req, res) => {
    console.log('Login endpoint hit!');
    console.log('Request body:', req.body);

    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    try {
        const Database = await connectToDatabase();
        console.log('Database connected');

        // Cek apakah user ada
        const [rows] = await Database.query('SELECT id, username, password FROM `users` WHERE username = ?', [username]);
        console.log('Query result:', rows);

        if (rows.length === 0) {
            console.log('User not found');
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Debug: cek data yang diterima
        console.log('User found:', {
            id: rows[0].id,
            username: rows[0].username,
            hasPassword: !!rows[0].password,
            passwordLength: rows[0].password ? rows[0].password.length : 0
        });
        console.log('Input password:', password ? 'exists' : 'missing');

        // Validasi data sebelum bcrypt compare
        if (!password || !rows[0].password) {
            console.log('Missing password data - Input:', !!password, 'DB:', !!rows[0].password);
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Verifikasi password
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: rows[0].id, 
                username: rows[0].username 
            }, 
            process.env.JWT_KEY, 
            { expiresIn: '1h' }
        );
    
        console.log('Login successful for user:', username);
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: rows[0].id,
                username: rows[0].username
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({
                message: "Database table not found"
            });
        }

        if (err.code === 'ECONNREFUSED') {
            return res.status(500).json({
                message: "Database connection failed"
            });
        }

        res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Middleware untuk verifikasi token - dipindah ke luar router.post
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(403).json({ message: "Access denied, no token provided" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "Access denied, invalid token format" });
        }

        // Fixed typo: jwt.verify (bukan jwt.verivy)
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Home route dengan middleware verifyToken
router.get('/home', verifyToken, async (req, res) => {
    try {
        const Database = await connectToDatabase();
        console.log('Database connected');

        const [rows] = await Database.query('SELECT id, username, email FROM `users` WHERE id = ?', [req.userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User data retrieved successfully",
            user: rows[0]
        });

    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


export default router;