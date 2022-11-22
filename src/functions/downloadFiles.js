import { toast } from "react-toastify";
import uploadFile from "./uploadFile";


/**
 * @desc Агрегиурет файлы вместе с URL-адресом по которому файл можно скачать
 * @param {Array} files Файлы, которые добавил пользователь
 */
const downloadFiles = async (files) =>
  await toast.promise(
    Promise.all(
      files.map(async ({ id, name, selectedFile, url }) => {
        const getName = name ? name : selectedFile.name;
        const getId = `${id}_${getName}`;
        const getUrl = url ? url : await uploadFile(getId, selectedFile);
        return { id: getId, name: getName, url: getUrl };
      })
    ),
    {
      pending: "Загружаем файлы",
      success: "Файлы загружены",
      error: "Не удалось загрузить файлы",
    }
);

export default downloadFiles;
