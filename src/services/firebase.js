// Firebase initialization and real-time Firestore / Storage service

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Default Project Firebase Configuration
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD0a8BsK0v8ZkteYr3EuyjywDkBzquD3tw",
  authDomain: "ceren-tahir-love.firebaseapp.com",
  projectId: "ceren-tahir-love",
  storageBucket: "ceren-tahir-love.firebasestorage.app",
  messagingSenderId: "18030151950",
  appId: "1:18030151950:web:c172d38a33134b44352f5f",
  measurementId: "G-YQMZL814SY"
};

// Retrieve config from Vite env or local settings
export const getFirebaseConfig = () => {
  try {
    const savedConfig = localStorage.getItem('lovehub_firebase_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {}

  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (envConfig.apiKey && envConfig.projectId && envConfig.apiKey !== 'your_api_key_here') {
    return envConfig;
  }

  return DEFAULT_FIREBASE_CONFIG;
};

export const isFirebaseConfigured = () => {
  return getFirebaseConfig() !== null;
};

let app = null;
let db = null;
let storage = null;
let auth = null;

export const initFirebase = () => {
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);

    // Sign in anonymously if not already signed in
    if (auth && !auth.currentUser) {
      signInAnonymously(auth).catch((err) => {
        console.warn('Anonymous auth note:', err.message);
      });
    }

    return { app, db, storage, auth };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return null;
  }
};

// Real-time Firestore Listeners
export const subscribeToCollection = (collectionName, callback, sortField = null, sortDir = 'desc') => {
  if (!db) {
    initFirebase();
  }
  if (!db) return () => {};

  try {
    const collRef = collection(db, collectionName);
    const q = sortField ? query(collRef, orderBy(sortField, sortDir)) : collRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(items);
      },
      (error) => {
        console.error(`Firestore snapshot error for ${collectionName}:`, error);
      }
    );

    return unsubscribe;
  } catch (e) {
    console.error(`Error subscribing to ${collectionName}:`, e);
    return () => {};
  }
};

// Document real-time listener (for couple profile)
export const subscribeToDoc = (collectionName, docId, callback) => {
  if (!db) {
    initFirebase();
  }
  if (!db) return () => {};

  try {
    const docRef = doc(db, collectionName, docId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() });
        }
      },
      (error) => {
        console.error(`Firestore doc snapshot error for ${collectionName}/${docId}:`, error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.error(`Error subscribing to doc ${collectionName}/${docId}:`, e);
    return () => {};
  }
};

// Save or update document
export const saveFirestoreDoc = async (collectionName, docId, data) => {
  if (!db) initFirebase();
  if (!db) return false;

  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (e) {
    console.error(`Error saving doc to ${collectionName}:`, e);
    return false;
  }
};

// Add new document with auto ID
export const addFirestoreDoc = async (collectionName, data) => {
  if (!db) initFirebase();
  if (!db) return null;

  try {
    const collRef = collection(db, collectionName);
    const docRef = await addDoc(collRef, {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (e) {
    console.error(`Error adding doc to ${collectionName}:`, e);
    return null;
  }
};

// Delete document
export const deleteFirestoreDoc = async (collectionName, docId) => {
  if (!db) initFirebase();
  if (!db) return false;

  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error(`Error deleting doc from ${collectionName}:`, e);
    return false;
  }
};

// Upload photo to Firebase Storage
export const uploadImageToStorage = async (fileOrDataUrl, path) => {
  if (!storage) initFirebase();
  if (!storage) return null;

  try {
    const storageRef = ref(storage, path);
    let snapshot;

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      // Convert base64 data url to blob
      const res = await fetch(fileOrDataUrl);
      const blob = await res.blob();
      snapshot = await uploadBytes(storageRef, blob);
    } else {
      snapshot = await uploadBytes(storageRef, fileOrDataUrl);
    }

    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (e) {
    console.error('Error uploading image to storage:', e);
    return null;
  }
};
