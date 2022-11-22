import { useState, useRef } from "react";

import { v4 } from "uuid";
import isOverdueDate from "../functions/isOverdueDate";
import addToDatabase from "../functions/addToDatabase";
import downloadFiles from "../functions/downloadFiles";


const FormTask = () => {
  const inputRef = useRef();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const fileRefInput = useRef();

  const [expirationDate, setExpirationDate] = useState("");

  const handleChangeDescription = (e) => setDescription(e.target.value);

  const handleChangeTitle = (e) => setTitle(e.target.value);

  const createTask = async (e) => {
    e.preventDefault();
    let downloadData = [];
    if (files.length) {
      downloadData = await downloadFiles(files);
    }
    const path = v4();
    const status = isOverdueDate(expirationDate) ? "active" : "overdue";
    addToDatabase(path, {
      id: path,
      title,
      description,
      status,
      files: downloadData,
      expirationDate,
    });

    fileRefInput.current.value = "";
    setTitle("");
    setDescription("");
    setExpirationDate("");
    setFiles([]);
  };

  const deleteFile = (id) => {
    const newFileList = files.filter((file) => file.id !== id);
    setFiles(newFileList);
  };

  return (
    <div className="add_task_form">
      <form action="" onSubmit={createTask}>
        <input
          className="form_task_title"
          type="text"
          onChange={handleChangeTitle}
          value={title}
          ref={inputRef}
          placeholder="Название задачи"
          required
        />
        <textarea
          className="form_task_description"
          value={description}
          onChange={handleChangeDescription}
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="Описание задачи"
        />
        <div className="files">
          {files.map(({ id, selectedFile }) => {
            return (
              <div key={id} className="file">
                <span className="text_file">{selectedFile?.name}</span>
                <span className="detele_file" onClick={() => deleteFile(id)}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.29289 1.29289C1.68342 0.902369 2.31658 0.902369 2.70711 1.29289L8 6.58579L13.2929 1.29289C13.6834 0.902369 14.3166 0.902369 14.7071 1.29289C15.0976 1.68342 15.0976 2.31658 14.7071 2.70711L9.41421 8L14.7071 13.2929C15.0976 13.6834 15.0976 14.3166 14.7071 14.7071C14.3166 15.0976 13.6834 15.0976 13.2929 14.7071L8 9.41421L2.70711 14.7071C2.31658 15.0976 1.68342 15.0976 1.29289 14.7071C0.902369 14.3166 0.902369 13.6834 1.29289 13.2929L6.58579 8L1.29289 2.70711C0.902369 2.31658 0.902369 1.68342 1.29289 1.29289Z"
                      fill="#060E1F"
                    />
                  </svg>
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
            onChange={({ target }) =>
              setFiles((prevFiles) => {
                const [selectedFile] = target.files;
                return [
                  ...prevFiles,
                  { id: `${v4()}_${selectedFile?.name}`, selectedFile },
                ].filter(({ selectedFile }) => selectedFile);
              })
            }
            name="file"
            ref={fileRefInput}
            id=""
          />
        </label>
        <div className="datetime_container">
          <label htmlFor="data">Выполнить до</label>
          <input
            onChange={(e) => setExpirationDate(e.target.value)}
            type="date"
            name=""
            id="data"
            value={expirationDate}
            required
          />
        </div>
        <button className="form_task_submit" type="submit">
          Добавить задачу
        </button>
      </form>
    </div>
  );
};

export default FormTask;
