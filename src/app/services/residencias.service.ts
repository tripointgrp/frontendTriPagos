import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ResidenciasService {
  private collectionName = 'residencias';
  private unidadesCollection = 'unidades';

  constructor(private firestore: Firestore) {}

  // 📌 Crear residencia
  async agregarResidencia(residencia: any) {
    const colRef = collection(this.firestore, this.collectionName);
    return await addDoc(colRef, {
      ...residencia,
      fecha_creacion: serverTimestamp(),
      fecha_actualizacion: serverTimestamp()
    });
  }

  // 📌 Obtener residencias
  async obtenerResidencias() {
    const colRef = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // 📌 Actualizar residencia
  async actualizarResidencia(id: string, residencia: any) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await updateDoc(docRef, {
      ...residencia,
      fecha_actualizacion: serverTimestamp()
    });
  }

  // 📌 Eliminar residencia
  async eliminarResidencia(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return await deleteDoc(docRef);
  }

  // 📌 Obtener Unidades activas (para el select)
  async obtenerUnidadesActivas() {
    const colRef = collection(this.firestore, this.unidadesCollection);
    const q = query(colRef, where('estado', '==', 'activo'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
