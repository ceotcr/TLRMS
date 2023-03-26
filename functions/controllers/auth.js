import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { dbpool } from '../db.js';


dotenv.config();

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const connection = await dbpool.getConnection();
        let sql = `SELECT * FROM users WHERE username = ?`;
        let values = [decoded.username];
        const [rows] = await connection.execute(sql, values);
        connection.release();
        if (!rows[0]) {
            throw new Error();
        }
        req.user = rows[0];
        next();
    } catch (error) {
        res.status(error.status || 401).json({ "msg": error.msg || "Please authenticate." });
    }
}