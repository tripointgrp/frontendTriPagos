import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ApartamentosService {
  private collectionName = 'apartamentos';

  constructor(private firestore: Firestore) {}

  async agregarApartamento(apto: any) {
    const colRef = collection(this.firestore, this.collectionName);
    return await addDoc(colRef, apto);
  }

  async obtenerApartamentos() {
    const colRef = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async actualizarApartamento(id: string, apto: any) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await updateDoc(docRef, apto);
  }

  async eliminarApartamento(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await deleteDoc(docRef);
  }
}
