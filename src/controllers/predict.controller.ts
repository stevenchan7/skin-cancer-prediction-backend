import { NextFunction, Request, Response } from 'express';
import { predictClassification } from '../utils/inference.util';
import crypto from 'crypto';
import { storeData } from '../utils/saveData.util';
import { Firestore } from '@google-cloud/firestore';

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

    res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPredictions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = new Firestore();

    const snapshot = await db.collection('predictions').get();

    const histories = snapshot.docs.map((doc) => ({
      id: doc.id,
      history: {
        id: doc.id,
        result: doc.data().result,
        suggestion: doc.data().suggestion,
        createdAt: doc.data().createdAt,
      },
    }));

    res.status(200).json({
      status: 'success',
      data: histories,
    });
  } catch (error) {
    next(error);
  }
};
