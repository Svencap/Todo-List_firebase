import { set, ref } from "firebase/database";
import { database } from "../firebase-config";

const addToDatabase = (path, data) => set(ref(database, `/${path}`), data);
export default addToDatabase;
