import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';
import { dbpool } from '../db.js';

async function validateUserInputs(username, email) {
    const connection = await dbpool.getConnection();
    let sql = `SELECT * FROM users WHERE username = ?`;
    let values = [username];
    const [rows] = await connection.execute(sql, values);
    sql = `SELECT * FROM users WHERE email = ?`;
    values = [email];
    const [emailrows] = await connection.execute(sql, values);
    connection.release();
    if (rows.length > 0) {
        return { "status": 400, "msg": "Username already taken." };
    } else if (emailrows.length > 0) {
        return { "status": 400, "msg": "Email already in use." };
    }
    else {
        return null;
    }
}

export const handleRegister = async (req, res) => {
    try {

        const { name, username, email, password, phone, role } = req.body;

        if (!name || !username || !email || !password || !phone || !role) {
            res.status(400).send('All Field Are Required');
            return;
        }
        const msg = await validateUserInputs(username, email);
        if (msg) {
            res.status(msg.status).send(msg.msg);
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = await bcrypt.hash(email, 10) + "verify";

        const connection = await dbpool.getConnection();

        let sql = `select * from verifyusers where username = ?`;
        let values = [username];
        const [rows] = await connection.execute(sql, values);

        if (rows.length > 0) {
            sql = `UPDATE verifyusers SET token = ? WHERE username = ?`;
            values = [verificationToken, username];
            connection.query(sql, values, (err, result) => {
                connection.release();
                if (err) {
                    res.status(500).send('An error occurred while generating a verification token.');
                    return;
                }
            });
        }
        else {
            sql = `INSERT INTO verifyusers (name, username, email, phone, password, role, token ) VALUES(? , ? , ? , ? , ? , ? , ?)`;
            values = [name, username, email, phone, hashedPassword, role, verificationToken];
            connection.query(sql, values, (err, result) => {
                connection.release();
                if (err) {
                    res.status(500).send('An error occurred while registering the user.');
                    return;
                }
            });
        }

        const verificationLink = `http://localhost:8000/api/v1/auth/verify-email?token=${verificationToken}`;



        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('../functions/views/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('../functions/views/'),
        };

        transporter.use('compile', hbs(handlebarOptions));

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Verify your email address',
            template: 'verifyEmail',
            context: {
                verifyLink: verificationLink,
                usersname: name,
            }
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred while sending the email.');
                return;
            }
        });
        res.send('Please check your email to verify your account.');
    } catch (error) {
        console.error(error);
        res.status(500).send(`An error occurred while registering the user. ERROR: ${error}`);
    }
};