import { collection, addDoc, deleteDoc, updateDoc, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Capsule {
  id: string;
  title: string;
  owner?: string;
  createdAt?: any;
}

export const CapsulesService = {
  async create(data: { title: string; owner?: string }) {
    const ref = await addDoc(collection(db, 'capsules'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async remove(id: string) {
    await deleteDoc(doc(db, 'capsules', id));
  },

  async update(id: string, data: Partial<Omit<Capsule, 'id'>>) {
    await updateDoc(doc(db, 'capsules', id), data);
  },
};
