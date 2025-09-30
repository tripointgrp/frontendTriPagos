import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AmenidadesService {
  private collectionName = 'amenidades';

  constructor(private firestore: Firestore) {}

  // 📌 Create
  async agregarAmenidad(amenidad: any) {
    const colRef = collection(this.firestore, this.collectionName);
    return await addDoc(colRef, {
      ...amenidad,
      fecha_creacion: serverTimestamp(),
      fecha_actualizacion: serverTimestamp(),
    });
  }

  // 📌 Read
  async obtenerAmenidades() {
    const colRef = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // 📌 Update
  async actualizarAmenidad(id: string, amenidad: Partial<any>) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await updateDoc(docRef, {
      ...amenidad,
      fecha_actualizacion: serverTimestamp(),
    });
  }

  // 📌 Delete
  async eliminarAmenidad(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await deleteDoc(docRef);
  }
}
