import { useState, useRef } from "react";


import { v4 } from "uuid";
import uploadFile from "../functions/uploadFile";
import isOverdueDate from "../functions/isOverdueDate";
import addToDatabase from "../functions/addToDatabase";

import { toast } from "react-toastify";

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
      downloadData = await toast.promise(
        Promise.all(
          files.map(async ({ id, selectedFile }) => {
            return {
              id,
              name: selectedFile.name,
              url: await uploadFile(id, selectedFile),
            };
          })
        ),
        {
          pending: "Загружаем файлы",
          success: "Файлы загружены",
          error: "Не удалось загрузить файлы",
        }
      );
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
                  X
                </span>
              </div>
            );
          })}
          <input
            type="file"
            onChange={(e) =>
              setFiles((prevFiles) => {
                const selectedFile = e.target.files[0];
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
        </div>
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
