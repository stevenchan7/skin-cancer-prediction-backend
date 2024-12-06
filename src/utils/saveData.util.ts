import { Firestore } from '@google-cloud/firestore';

export const storeData = async (id: string, data: { id: string; result: string; suggestion: string; createdAt: string }) => {
  const db = new Firestore();

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
};
