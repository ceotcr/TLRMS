import express from 'express';
import dotenv from 'dotenv';
import { handleRegister } from './controllers/signup.js';
import { handleVerifyEmail } from './controllers/verifyEmail.js';
import { handleLogin } from './controllers/login.js';
import { auth } from './controllers/auth.js';
import { getprofile } from './controllers/getprofile.js';
import { handleForgotPassword } from './controllers/forgotPassword.js';
import { handleResetPassword } from './controllers/resetPassword.js';
dotenv.config();
const port = process.env.PORT || 8000;
export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.get('/profile', auth, getprofile);

app.post('/v1/auth/signup', handleRegister);
app.get('/v1/auth/verify-email', handleVerifyEmail);
app.post('/v1/auth/login', handleLogin);
app.post('/v1/auth/forgot-password', handleForgotPassword);
app.post('/v1/auth/reset-password', handleResetPassword);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});