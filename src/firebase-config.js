import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';
import { ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlr5iu7iviDEZ6zsm4o3bmPvahIsFV758",
  authDomain: "testovoe-womanup.firebaseapp.com",
  databaseURL: "https://testovoe-womanup-default-rtdb.firebaseio.com",
  projectId: "testovoe-womanup",
  storageBucket: "testovoe-womanup.appspot.com",
  messagingSenderId: "915495424872",
  appId: "1:915495424872:web:81b06a71efdb8292b8bcdd",
  measurementId: "G-S4ENLWHFXH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

/**
 * @constant
 * Realtime Database
 * @see {@link https://firebase.google.com/docs/database} Что такое Realtime Database.
 */
export const database = getDatabase(app);


/**
 * @constant
 * Realtime Database
 * @see {@link https://firebase.google.com/docs/storage} Что такое Облачное хранилище для Firebase
 */
export const storage = getStorage(app);


export const storRef = ref;