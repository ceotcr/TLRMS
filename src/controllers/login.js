import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { dbpool } from '../db.js';
import jwt from 'jsonwebtoken';
dotenv.config();

export const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw { "status": 400, "msg": "All Field Are Required" };
        }
        const connection = await dbpool.getConnection();
        let sql = `SELECT * FROM users WHERE username = ?`;
        let values = [username];
        const [rows] = await connection.execute(sql, values);
        connection.release();
        if (rows.length === 0) {
            throw { "status": 400, "msg": "User not found" };
        }
        const user = rows[0];
        const isValidUser = await bcrypt.compare(password, user.password);
        if (!isValidUser) {
            throw { "status": 401, "msg": "Invalid Credentials" };
        }
        const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.status(200).json({ "accessToken": accessToken });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ "msg": error.msg || "An error occurred while logging in." });
    }
}