import { useEffect, useState, useRef } from "react";

import { ref, onValue } from "firebase/database";
import { storage, database, storRef } from "../firebase-config";
import { deleteObject } from "firebase/storage";
import { v4 } from "uuid";

import { toast } from "react-toastify";

import isOverdueDate from '../functions/isOverdueDate';
import updateToDatabase from "../functions/updateToBase";
import uploadFile from "../functions/uploadFile";


const EditModalTask = ({ isShow, setShow, taskId }) => {

  const [newDate, setNewDate] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [files, setFiles] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const titleRef = useRef();

  useEffect(() => {
    const getTask = () => {
      onValue(ref(database, `/${taskId}`), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const { title, description, files, expirationDate } = data;
          setNewTitle(title);
          setNewDescription(description);
          setFiles(files ? files : []);
          setNewDate(expirationDate);
        }
      });
    };
    getTask();
  }, [taskId]);


  const editTask = async (e) => {
    e.preventDefault();

    setShow(false);
    let downloadData = [];
    if (selectedFiles.length) {
      downloadData = await toast.promise(
        Promise.all(
          selectedFiles.map(async ({ id, name, selectedFile, url }) => {
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
    }

    const status = isOverdueDate(newDate) ? 'active' : 'overdue';
    const getFiles = downloadData.length ? [...files, ...downloadData] : files;
    updateToDatabase(taskId, { title: newTitle, description: newDescription, status, expirationDate: newDate, files: getFiles });
  };

  const deleteSelectedFile = (id) => (e) => {
    e.preventDefault();
    const newSelectedList = selectedFiles.filter((file) => file.id !== id);
    setSelectedFiles(newSelectedList);
  };

  const deleteFile = (id) => (e) => {
    e.preventDefault();
    const deletedFileRef = storRef(storage, `files/${id}`);
    deleteObject(deletedFileRef);

    const newFileList = files.filter((file) => file.id !== id);
    setFiles(newFileList);

    updateToDatabase(taskId, { files: newFileList });
  };

  return (
    <div
      onClick={() => setShow(false)}
      className={isShow ? "modal active" : "modal"}
    >
      <div onClick={(e) => e.stopPropagation()} className="modal_content">
        <form onSubmit={editTask} action="">
          <input
            className="form_task_title"
            type="text"
            onChange={(e) => setNewTitle(e.target.value)}
            value={newTitle}
            ref={titleRef}
            placeholder="Название задачи"
            required
          />
          <textarea
            className="form_task_description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Описание задачи"
          />
          <div className="selected_files">
            {selectedFiles.length ? <span>Выбранные файлы:</span> : null}
            {selectedFiles.map(({ id, name, url }) => {
              return (
                <div key={id} className="file">
                  <span className="text_file">{name}</span>
                  <span
                    className="detele_file"
                    onClick={deleteSelectedFile(id)}
                  >
                    X
                  </span>
                </div>
              );
            })}
          </div>
          <div className="files attached_files">
            {files.length ? <span>Прикрепленные файлы:</span> : null}
            {files.map(({ id, name, url }) => {
              return (
                <div key={id} className="file">
                  <span className="text_file">{name}</span>
                  <button type="submit" className="delete_file" onClick={deleteFile(id)}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 22 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="bucket"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 5C8 3.34315 9.34315 2 11 2H13C14.6569 2 16 3.34315 16 5L18 5C18.5523 5 19 5.44772 19 6C19 6.55229 18.5523 7 18 7L15 7L9.00099 7L9 7L8.99901 7L6 7C5.44772 7 5 6.55228 5 6C5 5.44771 5.44772 5 6 5L8 5ZM13 4C13.5523 4 14 4.44772 14 5H10C10 4.44772 10.4477 4 11 4H13ZM7 8C6.44772 8 6 8.44772 6 9V20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20V9C18 8.44772 17.5523 8 17 8H7Z"
                        fill="#FC0D54"
                      />
                    </svg>
                    {/* Удалить */}
                  </button>
                </div>
              );
            })}
          </div>
          <input
            type="file"
            onChange={(e) =>
              setSelectedFiles((prevFiles) => {
                const selectedFile = e.target.files[0];
                return [
                  ...prevFiles,
                  { id: v4(), selectedFile, name: selectedFile?.name },
                ].filter(({ selectedFile }) => selectedFile);;
              })
            }
            name="file"
            id=""
          />
          <div className="datetime_container">
            <label htmlFor="data">Выполнить до</label>
            <input
              onChange={(e) => setNewDate(e.target.value)}
              type="date"
              name=""
              id="data"
              required
              value={newDate}
            />
          </div>
          <button className="form_task_submit" type="submit">
            Редактировать
          </button>
        </form>
        <span onClick={() => setShow(false)}>X</span>
      </div>
    </div>
  );
};
export default EditModalTask;
