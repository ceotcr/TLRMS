import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();
import { dbpool } from '../db.js';

const findUserByVerificationToken = async (token) => {
    const connection = await dbpool.getConnection();
    let sql = `SELECT * FROM verifyusers WHERE token = ?`;
    let values = [token];
    const [rows] = await connection.execute(sql, values);
    connection.release();
    if (rows.length > 0) {
        const user = rows[0];
        return user;
    } else {
        return null;
    }
};

export const handleVerifyEmail = async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) {
            res.status(400).send('Token is required.');
            return;
        }

        const user = await findUserByVerificationToken(token);
        if (!user) {
            res.status(404).send('Invalid token. Please try again.');
            return;
        }

        const connection = await dbpool.getConnection();
        let sql = `INSERT INTO users (name, username, email, phone, password, role ) VALUES(? , ? , ? , ? , ? , ? )`;
        let values = [user.name, user.username, user.email, user.phone, user.password, user.role];

        connection.query(sql, values, (error, result) => {
            if (error) throw error;
        });
        res.send('Email address verified successfully.');

        sql = `DELETE FROM verifyusers WHERE token = ?`;
        values = [token];
        connection.query(sql, values, (error, result) => {
            if (error) throw error;
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`An error occurred while verifying the email address. Error: ${error}`);
    }
};
