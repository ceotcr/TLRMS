import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { handleRegister } from './controllers/signup.js';
import { handleVerifyEmail } from './controllers/verifyEmail.js';
import { handleLogin } from './controllers/login.js';
import { auth } from './controllers/auth.js';
import { getprofile } from './controllers/getprofile.js';
import { handleForgotPassword } from './controllers/forgotPassword.js';
import { handleResetPassword } from './controllers/resetPassword.js';
import { https } from 'firebase-functions';
import { addEvent, getEvents } from './controllers/events.js';
import { addTimetable, getTimetable } from './controllers/timetable.js';
import { deleteCourse, getCourses, updateCourse, addCourse } from './controllers/course.js';
dotenv.config();
const port = process.env.PORT || 8000;
export const app = express();
const corsOptions = {
    origin: 'http://127.0.0.1:5500' // Replace with the URL of your web page
};

app.use(cors(corsOptions));


app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.get('/profile', auth, getprofile);

app.post('/api/v1/auth/signup', handleRegister);
app.get('/api/v1/auth/verify-email', handleVerifyEmail);
app.post('/api/v1/auth/login', handleLogin);
app.post('/api/v1/auth/forgot-password', handleForgotPassword);
app.post('/api/v1/auth/reset-password', handleResetPassword);
app.get('/api/v1/events', auth, getEvents);
app.post('/api/v1/events', auth, addEvent);
app.get('/api/v1/timetable', auth, getTimetable);
app.post('/api/v1/timetable', auth, addTimetable);
app.get('/api/v1/courses', auth, getCourses);
app.post('/api/v1/updatecourse', auth, updateCourse);
app.post('/api/v1/deletecourse', auth, deleteCourse);

export const appFunction = https.onRequest(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});