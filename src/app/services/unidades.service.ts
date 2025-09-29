// src/app/services/unidades.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from '@angular/fire/firestore';
import type { Unidad } from '../apartamentos/apartamentos.component'; // ajusta la ruta si cambia
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnidadesService {
  private fs = inject(Firestore);
  private colRef = collection(this.fs, 'unidades');

  /** 🔄 Lectura en vivo (si luego quieres live updates con async pipe) */
  streamUnidades$(): Observable<Unidad[]> {
    return collectionData(this.colRef, { idField: '_id' }) as Observable<Unidad[]>;
  }

  /** 📥 Una sola carga (compatible con tu patrón `await`) */
  async obtenerUnidades(): Promise<Unidad[]> {
    const q = query(this.colRef, orderBy('fecha_creacion', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ _id: d.id, ...(d.data() as any) })) as Unidad[];
  }

  /** ➕ Crear */
  async agregarUnidad(payload: Unidad): Promise<Unidad> {
    // (opcional) asegura `unidades_total` si viene por tipos
    const unidades_por_tipo = payload.unidades_por_tipo || {};
    const total =
      (Number(unidades_por_tipo.casas) || 0) +
      (Number(unidades_por_tipo.apartamentos) || 0) +
      (Number(unidades_por_tipo.locales) || 0);

    const docRef = await addDoc(this.colRef, {
      ...payload,
      unidades_total: payload.unidades_total ?? total,
      fecha_creacion: serverTimestamp(),
      fecha_actualizacion: serverTimestamp(),
    });

    // devolver el objeto con _id ya seteado
    return { _id: docRef.id, ...payload, unidades_total: payload.unidades_total ?? total };
  }

  /** ✏️ Actualizar */
  async actualizarUnidad(id: string, payload: Unidad): Promise<Unidad> {
    const unidades_por_tipo = payload.unidades_por_tipo || {};
    const total =
      (Number(unidades_por_tipo.casas) || 0) +
      (Number(unidades_por_tipo.apartamentos) || 0) +
      (Number(unidades_por_tipo.locales) || 0);

    await updateDoc(doc(this.fs, 'unidades', id), {
      ...payload,
      unidades_total: payload.unidades_total ?? total,
      fecha_actualizacion: serverTimestamp(),
    });

    return { _id: id, ...payload, unidades_total: payload.unidades_total ?? total };
  }

  /** 🗑️ Eliminar */
  async eliminarUnidad(id: string): Promise<{ ok: boolean }> {
    await deleteDoc(doc(this.fs, 'unidades', id));
    return { ok: true };
  }
}
