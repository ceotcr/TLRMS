import mysql from 'mysql2/promise';
import { dbpool } from '../db.js';

export const getTimetable = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }
        const connection = await dbpool.getConnection();
        const [rows] = await connection.execute(`SELECT * FROM timetable`);
        connection.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ "msg": "An error occurred while getting timetable." });
    }
}

export const addTimetable = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }
        const { day, period, subject, teacher, forclass } = req.body;
        const connection = await dbpool.getConnection();
        const sql = `INSERT INTO timetable (day, period, subject, teacher, forclass) VALUES (?, ?, ?, ?, ?)`;
        const values = [day, period, subject, teacher, forclass];
        const [rows] = await connection.execute(sql, values);
        connection.release();
        res.json({ "status": 200, "msg": "Timetable added successfully." });
    } catch (err) {
        res.status(500).json({ "msg": "An error occurred while adding timetable." });
    }
}