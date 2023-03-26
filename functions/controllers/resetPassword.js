import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { dbpool } from '../db.js';

export const handleResetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;
        if (!token) {
            throw { "status": 400, "msg": "Token is required" };
        }
        if (!password) {
            throw { "status": 400, "msg": "Password is required" };
        }
        const connection = await dbpool.getConnection();
        let sql = `SELECT * FROM resetpassword WHERE token = ?`;
        let values = [token];
        const [rows] = await connection.execute(sql, values);
        let user;
        if (rows.length > 0) {
            user = rows[0];
        }
        else {
            throw { "status": 400, "msg": "Invalid Token" };
        }
        sql = `SELECT * FROM users WHERE username = ?`;
        values = [user.username];
        const [userRows] = await connection.execute(sql, values);
        if (userRows.length > 0) {
            user = userRows[0];
        }
        else {
            throw { "status": 400, "msg": "Invalid Token" };
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        sql = `UPDATE users SET password = ? WHERE username = ?`;
        values = [hashedPassword, user.username];
        connection.execute(sql, values, (err, result) => {
            if (err) {
                throw { "status": 500, "msg": "An error occurred while resetting password." };
            }
        });
        sql = `DELETE FROM resetpassword WHERE token = ?`;
        values = [token];
        connection.execute(sql, values, (err, result) => {
            if (err) {
                throw { "status": 500, "msg": "An error occurred while resetting password." };
            }
        });
        connection.release();
        res.json({ "status": 200, "msg": "Password reset successfully." });
    } catch (err) {
        res.status(err.status || 500).json({ "msg": err.msg || "An error occurred while resetting password." });
    }
}