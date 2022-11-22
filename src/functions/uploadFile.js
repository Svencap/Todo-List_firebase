import { storage, storRef } from "../firebase-config";
import { getDownloadURL, uploadBytes } from "firebase/storage";


/**
 * Эта функция загружает выбранный файл в Storage, затем получает URL-адресс по которому можно скачать этот файл.
 * Eсли файла нет, функция вернет пустую строку
 * @see {@link https://firebase.google.com/docs/storage Облачное хранилище для Firebase}
 * @see {@link https://firebase.google.com/docs/storage/web/upload-files Загрузка файлов с помощью облачного хранилища}
 * @see {@link https://firebase.google.com/docs/storage/web/download-files Скачивание файлов с помощью облачного хранилища }
 * @param {String} id Уникальное значение файла
 * @param {File} file Файл который нужно загрузить
 * @return {Promise<string>} Сылка по которой можно скачать файл
 * 
 */
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
