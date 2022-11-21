import { database } from "../firebase-config";
import { update, ref } from "firebase/database";

const updateToDatabase = (taskId, data) => update(ref(database, `/${taskId}`), data);

export default updateToDatabase;