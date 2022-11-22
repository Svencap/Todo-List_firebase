import { useEffect, useState, useRef } from "react";

import { ref, onValue } from "firebase/database";
import { storage, database, storRef } from "../firebase-config";
import { deleteObject } from "firebase/storage";
import { v4 } from "uuid";

import isOverdueDate from "../functions/isOverdueDate";
import updateToDatabase from "../functions/updateToBase";
import downloadFiles from "../functions/downloadFiles";


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
      downloadData = await downloadFiles(selectedFiles);
    }

    const status = isOverdueDate(newDate) ? "active" : "overdue";
    const getFiles = downloadData.length ? [...files, ...downloadData] : files;
    updateToDatabase(taskId, {
      title: newTitle,
      description: newDescription,
      status,
      expirationDate: newDate,
      files: getFiles,
    });
  };

  const deleteSelectedFile = (id) => (e) => {
    e.preventDefault();
    const newSelectedList = selectedFiles.filter((file) => file.id !== id);
    setSelectedFiles(newSelectedList);
  };

  const deleteFile = (id) => async (e) => {
    e.preventDefault();

    const deletedFileRef = storRef(storage, `files/${id}`);
    const newFileList = files.filter((file) => file.id !== id);
    try {
      await deleteObject(deletedFileRef);
      setFiles(newFileList);
      updateToDatabase(taskId, { files: newFileList });
    } catch (error) {
      setFiles(newFileList);
      // Возможно поменять ошибку
      // Удалить блоки эти
      throw Error(error.message);
    }
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
          <div className="files attached_files">
            {files.length ? <span>Прикрепленные файлы:</span> : null}
            {files.map(({ id, name, url }) => {
              return (
                <div key={id} className="file">
                  <span className="text_file">{name}</span>
                  <button
                    type="submit"
                    className="delete_file"
                    onClick={deleteFile(id)}
                  >
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
                  </button>
                </div>
              );
            })}
          </div>
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
          <label className="label_file">
            Добавить файл
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.1018 4.55342C16.1973 3.64886 14.6651 3.64886 13.7605 4.55342L6.03908 12.2749C4.48697 13.827 4.48697 16.4418 6.03908 17.9939C7.59119 19.5461 10.2061 19.5461 11.7582 17.9939L19.4796 10.2725C19.8701 9.88198 20.5033 9.88198 20.8938 10.2725C21.2843 10.663 21.2843 11.2962 20.8938 11.6867L13.1724 19.4082C10.8392 21.7413 6.95803 21.7413 4.62487 19.4082C2.29171 17.075 2.29171 13.1938 4.62487 10.8606L12.3463 3.13921C14.0319 1.4536 16.8304 1.4536 18.516 3.13921C20.201 4.82411 20.2017 7.62098 18.5182 9.30682L10.7111 17.2031L10.7071 17.2071L10.7071 17.2071C9.53471 18.3795 7.88284 17.919 6.99423 17.0304C5.95616 15.9923 5.95616 14.2765 6.99423 13.2384L6.99465 13.238L14.1279 6.1131C14.5187 5.72281 15.1519 5.72318 15.5422 6.11393C15.9325 6.50469 15.9321 7.13785 15.5413 7.52815L8.40845 14.6526C8.40836 14.6527 8.40826 14.6528 8.40817 14.6529C8.15143 14.91 8.15152 15.3592 8.40845 15.6162C8.58823 15.796 8.79498 15.8856 8.95709 15.903C9.09984 15.9183 9.20317 15.8819 9.29143 15.7944L17.0978 7.89877L17.1018 7.89474C18.0064 6.99018 18.0064 5.45799 17.1018 4.55342Z"
                fill="#ffffff"
              />
            </svg>
            <input
              type="file"
              className="input_files"
              onChange={(e) =>
                setSelectedFiles((prevFiles) => {
                  const selectedFile = e.target.files[0];
                  return [
                    ...prevFiles,
                    { id: v4(), selectedFile, name: selectedFile?.name },
                  ].filter(({ selectedFile }) => selectedFile);
                })
              }
              name="file"
              id=""
            />
          </label>
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
        <span className="close_modal" onClick={() => setShow(false)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L12 10.5858L19.2929 3.29289C19.6834 2.90237 20.3166 2.90237 20.7071 3.29289C21.0976 3.68342 21.0976 4.31658 20.7071 4.70711L13.4142 12L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L12 13.4142L4.70711 20.7071C4.31658 21.0976 3.68342 21.0976 3.29289 20.7071C2.90237 20.3166 2.90237 19.6834 3.29289 19.2929L10.5858 12L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289Z"
              fill="#ffffff"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};
export default EditModalTask;
