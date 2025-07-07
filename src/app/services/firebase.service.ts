import { inject, Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { User } from '../models/user.model';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query, updateDoc, deleteDoc
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  /* ============================== AUTENTICACION ============================== */
  getAuth() {
    return getAuth();
  }

  /* ========== ACCEDER ========== */
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  /* ========== CREAR USUARIO ========== */
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  /* ========= ACTUALIZAR USUARIO ========== */
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  /* ========== RECUPERAR CONTRASEÑA ============ */
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  /* ========= CERRAR SESION ========== */
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  /* ============================== DATABASE ============================== */

  /* =========== OBTENER DOCUMENTOS DE UNA COLECCION ========= */
  getCollectionData(path: string, collectionQuery?: any[]) {
  const ref = collection(getFirestore('geohub-origin77'), path);

  // Verificamos si collectionQuery fue enviado
  if (collectionQuery && Array.isArray(collectionQuery)) {
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
  } else {
    return collectionData(ref, { idField: 'id' });
  }
}


  /* ========= SETEAR UN DOCUMENTO */
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore('geohub-origin77'), path), data);
  }

  /* ========= ACTUALIZAR UN DOCUMENTO */
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore('geohub-origin77'), path), data);
  }

  /* ========= ELIMINAR UN DOCUMENTO */
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore('geohub-origin77'), path));
  }

  /* ========= OBTENER UN DOCUMENTO ======== */
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore('geohub-origin77'), path))).data();
  }

  /* ========== AGREGAR DOCUMENTO ========== */
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore('geohub-origin77'), path), data);
  }

  /* ============================== ALMACENAMIENTO ============================== */

  /* ========== SUBIR IMAGEN =========*/
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  /* ========= OBTENER PATH DE IMAGEN ========= */
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  /* =========== ELIMINAR ARCHIVO ============ */
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}
