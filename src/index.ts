import express, { NextFunction, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });
import InputError from './exceptions/inputError';
import predictRouter from './routes/predict.route';
import { loadModel } from './utils/loadModel.util';
import { MulterError } from 'multer';

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(predictRouter);

// Error handler
app.use((err, req, res: Response, next) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
      return;
    }
  }

  if (err instanceof InputError) {
    res.status(err.status).json({
      status: 'fail',
      message: err.message,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 'fail',
    message: 'Terjadi kegagalan pada server',
  });
});

loadModel()
  .then((model) => {
    app.set('model', model);
  })
  .then(() => {
    app.listen(Number(port), () => {
      return console.log(`Express is listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
