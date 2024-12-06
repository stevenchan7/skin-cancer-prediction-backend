import { Router } from 'express';
import upload from '../config/multer.config';
import { getPredictions, postPredict } from '../controllers/predict.controller';

const router = Router();

router.get('/predict/histories', getPredictions);
router.post('/predict', upload.single('image'), postPredict);

export default router;
