import { dbpool } from '../db.js';

async function createTables() {
    const dropUsersTable = 'DROP TABLE IF EXISTS users;';
    const dropVerifyUsersTable = 'DROP TABLE IF EXISTS verifyusers;';
    const dropCourseTable = 'DROP TABLE IF EXISTS course;';
    const dropEventsTable = 'DROP TABLE IF EXISTS events;';
    const dropTimetableTable = 'DROP TABLE IF EXISTS timetable;';
    const dropResetPasswordTable = 'DROP TABLE IF EXISTS resetpassword;';

    const createUsersTable = `
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            username VARCHAR(255),
            email VARCHAR(255),
            password VARCHAR(255),
            phone VARCHAR(255),
            role VARCHAR(255)
        );
    `;

    const createVerifyUsersTable = `
        CREATE TABLE verifyusers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            username VARCHAR(255),
            email VARCHAR(255),
            password VARCHAR(255),
            phone VARCHAR(255),
            role VARCHAR(255),
            token TEXT
        );
    `;

    const createCourseTable = `
        CREATE TABLE course (
            id INT AUTO_INCREMENT PRIMARY KEY,
            courseName VARCHAR(255),
            courseCode VARCHAR(255),
            courseDescription TEXT
        );
    `;

    const createEventsTable = `
        CREATE TABLE events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            description TEXT,
            start DATETIME,
            end DATETIME
        );
    `;

    const createTimetableTable = `
        CREATE TABLE timetable (
            id INT AUTO_INCREMENT PRIMARY KEY,
            day VARCHAR(255),
            period VARCHAR(255),
            subject VARCHAR(255),
            teacher VARCHAR(255),
            forclass VARCHAR(255)
        );
    `;

    const creteResetPasswordTable = `
        CREATE TABLE resetpassword (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255),
            token TEXT
        );
    `;

    try {
        const connection = await dbpool.getConnection();

        await connection.execute(dropUsersTable);
        await connection.execute(dropVerifyUsersTable);
        await connection.execute(dropCourseTable);
        await connection.execute(dropEventsTable);
        await connection.execute(dropTimetableTable);
        await connection.execute(dropResetPasswordTable);

        await connection.execute(createUsersTable);
        await connection.execute(createVerifyUsersTable);
        await connection.execute(createCourseTable);
        await connection.execute(createEventsTable);
        await connection.execute(createTimetableTable);
        await connection.execute(creteResetPasswordTable);

        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        dbpool.end();
    }
}

createTables();
