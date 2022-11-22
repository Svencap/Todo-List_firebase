import { database } from "../firebase-config";
import { update, ref } from "firebase/database";


/**
 * Эта функция обновляет данные в Realtime Database
 * @see {@link https://firebase.google.com/docs/database Firebase Realtime Database}
 * @see {@link https://firebase.google.com/docs/database/web/read-and-write#updating_or_deleting_data Обновить определенные поля в Realtime Database}
 * @param {string} taskId Идентификатор по которому нужно обновлять данные в Realtime Database
 * @param {object} data Данные которые нужно обновить
 */

const updateToDatabase = (taskId, data) => update(ref(database, `/${taskId}`), data);

export default updateToDatabase;