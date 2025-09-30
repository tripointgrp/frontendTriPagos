import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query } from '@angular/fire/firestore';
import * as bcrypt from 'bcryptjs';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private usuariosCollection = 'usuarios';
  private rolesCollection = 'roles';

  constructor(private firestore: Firestore) {}

  // 📌 Create
  async agregarUsuario(usuario: any) {
    const colRef = collection(this.firestore, this.usuariosCollection);

    if (usuario.password) {
      usuario.passwordHash = await bcrypt.hash(usuario.password, 10);
      delete usuario.password;
    }

    return await addDoc(colRef, usuario);
  }

  // 📌 Read
  async obtenerUsuarios() {
    const colRef = collection(this.firestore, this.usuariosCollection);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // 📌 Update
  async actualizarUsuario(id: string, usuario: any) {
    const docRef = doc(this.firestore, `${this.usuariosCollection}/${id}`);

    if (usuario.password) {
      usuario.passwordHash = await bcrypt.hash(usuario.password, 10);
      delete usuario.password;
    }

    return await updateDoc(docRef, usuario);
  }

  // 📌 Delete
  async eliminarUsuario(id: string) {
    const docRef = doc(this.firestore, `${this.usuariosCollection}/${id}`);
    return await deleteDoc(docRef);
  }

  // 📌 Obtener solo roles activos
  async obtenerRolesActivos() {
    const colRef = collection(this.firestore, this.rolesCollection);
    const q = query(colRef); // lo puedes filtrar por campo "estado" si lo tienes
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // 📌 Obtener residencias activas
 // 📌 Obtener residencias activas con información de unidad
  async obtenerResidenciasActivasConUnidad() {
    const colRef = collection(this.firestore, 'residencias');
    const snapshot = await getDocs(colRef);
    const residencias = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
      .filter(r => r.estado === 'activo');

    // Traer todas las unidades una sola vez
    const unidadesCol = collection(this.firestore, 'unidades');
    const unidadesSnap = await getDocs(unidadesCol);
    const unidades = unidadesSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

    // Enlazar residencias con su unidad
    return residencias.map(r => ({
      ...r,
      unidad: unidades.find(u => u.id === r.unidadId) || null
    }));
  }


}
