import * as tf from '@tensorflow/tfjs-node';

export const predictClassification = async (model: tf.GraphModel, image: Uint8Array) => {
  try {
    let label;
    let suggestion;
    const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

    const prediction = model.predict(tensor) as tf.Tensor;
    const scores = await prediction.data();

    const probabilityCancer = scores[0];
    const probabilityNonCancer = 1 - probabilityCancer;

    if (probabilityCancer > probabilityNonCancer) {
      label = 'Cancer';
      suggestion = 'Segera periksa ke dokter!';
    } else {
      label = 'Non-cancer';
      suggestion = 'Penyakit kanker tidak terdeteksi.';
    }

    return { label, suggestion };
  } catch (error) {
    throw new Error('Terjadi kesalahan dalam melakukan prediksi');
  }
};
