import mysql from 'mysql2/promise';
import { dbpool } from '../db.js';

export const getEvents = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }
        const date = req.query.date;
        const connection = await dbpool.getConnection();
        const [rows] = await connection.execute(`SELECT * FROM events WHERE start LIKE '${date}%' OR end LIKE '${date}%'`);
        connection.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ "msg": "An error occurred while getting events." });
    }
}

export const addEvent = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }
        const { title, description, start, end } = req.body;
        if (!title || !description || !start || !end) {
            return res.status(400).json({ "msg": "Please enter all fields." });
        }
        const connection = await dbpool.getConnection();
        const sql = `INSERT INTO events (title, description, start, end) VALUES (?, ?, ?, ?)`;
        const values = [title, description, start, end];
        connection.query(sql, values, (err, result) => {
            if (err) {
                res.status(500).json({ "msg": "An error occurred while adding event." });
                return;
            }
        });
        connection.release();
        res.ok = true;
        res.json({ "status": 200, "msg": "Event added successfully." });
    } catch (err) {
        res.status(500).json({ "msg": "An error occurred while adding event." });
    }
}