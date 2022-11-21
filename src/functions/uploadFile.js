import { storage, storRef } from "../firebase-config";
import { getDownloadURL, uploadBytes } from "firebase/storage";

const uploadFile = async (id, file) => {
  if (file) {
    // const storeFirebase = storRef(storage, `files/${v4() + file.name}`);
    const storeFirebase = storRef(storage, `files/${id}`);
    await uploadBytes(storeFirebase, file);
    return await getDownloadURL(storeFirebase);
  }
  return "";
};

export default uploadFile;
