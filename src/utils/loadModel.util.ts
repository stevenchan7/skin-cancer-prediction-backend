import * as tf from '@tensorflow/tfjs-node';

export const loadModel = async () => {
  try {
    const model = await tf.loadGraphModel(process.env.MODEL_URL);
    return model;
  } catch (error) {
    throw new Error('Failed to load model!');
  }
};
