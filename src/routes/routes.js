import express from 'express';
import { media } from './authRouter.js';

const router = express.Router();

router.use(media);

export default router;