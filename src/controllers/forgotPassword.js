import bcrypt from 'bcrypt';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';
import { dbpool } from '../db.js';

async function validateUserInputs(username) {
    let sql = `SELECT * FROM users WHERE username = ?`;
    let values = [username];
    const [rows] = await dbpool.execute(sql, values);
    if (rows.length > 0) {
        return rows[0];
    }
    else {
        return null;
    }
}

export const handleForgotPassword = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            throw { "status": 400, "msg": "Username or email is Required" };
        }
        const user = await validateUserInputs(username);
        if (user === null) {
            throw { "status": 400, "msg": "User does not exist." };
        }
        const passwordResetToken = bcrypt.hashSync(user.email, 10) + 'reset';

        const connection = await dbpool.getConnection();
        let sql = `select * from resetpassword where username = ?`;
        let values = [username];
        const [resetRows] = await connection.execute(sql, values);

        if (resetRows.length > 0) {
            sql = `UPDATE resetpassword SET token = ? WHERE username = ?`;
            values = [passwordResetToken, username];
            connection.query(sql, values, (err, result) => {
                connection.release();
                if (err) {
                    console.log(err);
                    throw { "status": 500, "msg": "An error occurred while generating a reset token." };
                };
            });
        }
        else {
            sql = `INSERT INTO resetpassword (token, username) VALUES(? , ?)`;
            values = [passwordResetToken, user.username];

            connection.query(sql, values, (err, result) => {
                connection.release();
                if (err) {
                    console.log(err);
                    throw { "status": 500, "msg": "An error occurred while generating a reset token." };
                }
            });
        }

        const link = `http://localhost:8000/api/v1/auth/reset-password?token=${passwordResetToken}`;
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
                partialsDir: path.resolve('./src/views/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./src/views/'),
        };

        transporter.use('compile', hbs(handlebarOptions));

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset',
            template: 'forgotPassword',
            context: {
                resetLink: link
            }
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                throw { "status": 500, "msg": "An error occurred while sending email." };
                return;
            }
            res.status(200).send('Email sent successfully');
        });
    } catch (error) {
        res.status(error.status || 500).json({ "msg": error.msg || "An error occurred while processing forgot password request." })
    }
}