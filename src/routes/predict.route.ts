import { Router } from 'express';
import upload from '../config/multer.config';
import { postPredict } from '../controllers/predict.controller';

const router = Router();

router.post('/predict', upload.single('image'), postPredict);

export default router;
