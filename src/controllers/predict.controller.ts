import { NextFunction, Request, Response } from 'express';
import { predictClassification } from '../utils/inference.util';
import crypto from 'crypto';
import { storeData } from '../utils/saveData.util';

export const postPredict = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const model = req.app.get('model');

    if (!file) {
      throw new Error('Tidak ada file');
    }

    const { label, suggestion } = await predictClassification(model, file.buffer);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    await storeData(id, data);

    res.status(200).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
