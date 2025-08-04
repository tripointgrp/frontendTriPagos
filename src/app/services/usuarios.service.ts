import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private collectionName = 'usuarios';

  constructor(private firestore: Firestore) {}

  // 📌 Create
  async agregarUsuario(usuario: any) {
    const colRef = collection(this.firestore, this.collectionName);
    return await addDoc(colRef, usuario);
  }

  // 📌 Read
  async obtenerUsuarios() {
    const colRef = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // 📌 Update
  async actualizarUsuario(id: string, usuario: any) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await updateDoc(docRef, usuario);
  }

  // 📌 Delete
  async eliminarUsuario(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await deleteDoc(docRef);
  }
}
