import { dbpool } from "../db.js";
import mysql from 'mysql2/promise';

export const getCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const connection = await dbpool.getConnection();
        const [rows] = await connection.execute(`SELECT * FROM course`);
        connection.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ msg: "An error occurred while getting course." });
    }
};

export const addCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const { courseName, courseCode, courseDescription } = req.body;
        const connection = await dbpool.getConnection();
        const sql = `INSERT INTO course (courseName, courseCode, courseDescription) VALUES (?, ?, ?)`;
        const values = [courseName, courseCode, courseDescription];
        const [rows] = await connection.execute(sql, values);
        connection.release();
        res.json({ status: 200, msg: "Course added successfully." });
    } catch (err) {
        res.status(500).json({ msg: "An error occurred while adding course." });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const { id } = req.params;
        const connection = await dbpool.getConnection();
        const sql = `DELETE FROM course WHERE id = ?`;
        const values = [id];
        const [rows] = await connection.execute(sql, values);
        connection.release();
        res.json({ status: 200, msg: "Course deleted successfully." });
    } catch (err) {
        res.status(500).json({ msg: "An error occurred while deleting course." });
    }
};

export const updateCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const { id } = req.params;
        const { courseName, courseCode, courseDescription } = req.body;
        const connection = await dbpool.getConnection();
        const sql = `UPDATE course SET courseName = ?, courseCode = ?, courseDescription = ? WHERE id = ?`;
        const values = [courseName, courseCode, courseDescription, id];
        const [rows] = await connection.execute(sql, values);
        connection.release();
        res.json({ status: 200, msg: "Course updated successfully." });
    } catch (err) {
        res.status(500).json({ msg: "An error occurred while updating course." });
    }
};