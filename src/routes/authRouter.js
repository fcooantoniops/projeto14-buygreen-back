import express from 'express';
import { logIn, signUp } from '../controllers/authControllers.js';

const authRouter = express.Router();
authRouter.post('/signup', signUp);
authRouter.post('/login', logIn);

export { authRouter };