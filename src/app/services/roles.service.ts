import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private collectionName = 'roles';

  constructor(private firestore: Firestore) {}

  async agregarRol(rol: any) {
    const colRef = collection(this.firestore, this.collectionName);
    return await addDoc(colRef, rol);
  }

  async obtenerRoles() {
    const colRef = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async actualizarRol(id: string, rol: any) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await updateDoc(docRef, rol);
  }

  async eliminarRol(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await deleteDoc(docRef);
  }
}
