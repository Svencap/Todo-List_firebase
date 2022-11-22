import { set, ref } from "firebase/database";
import { database } from "../firebase-config";


/**
 * Эта функция записывает данные в Realtime Database
 * @see {@link https://firebase.google.com/docs/database Firebase Realtime Database}
 * @see {@link https://firebase.google.com/docs/database/web/read-and-write Read and Write Data on the Realtime Database}
 * @param {string} path Путь по которому запишутся данные в Realtime Database
 * @param {object} data Данные которые нужно записать в Realtime Database
 */
const addToDatabase = (path, data) => set(ref(database, `/${path}`), data);
export default addToDatabase;
