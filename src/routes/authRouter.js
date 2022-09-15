import express from 'express';
import { logIn, signUp } from '../controllers/authControllers.js';

const media = express.Router();
media.post('/signup', signUp);
media.post('/login', logIn);

export { media };

