import React from "react";
import { useState, useContext } from "react";

import { database, storage, storRef } from "../firebase-config";
import { ref, remove, update } from "firebase/database";
import { deleteObject } from "firebase/storage";

import DateContext from "../context/DateContext.jsx";

import {
  ActiveStatus,
  FinishedStatus,
  OverdueStatus,
} from "./Statuses/statuses";
import EditModalTask from "./EditModalTask.jsx";
import '../less/Task.less'

const Task = ({ id, title, description, status, expirationDate, files }) => {
  const [showModal, setShowModal] = useState(false);

  const dayjs = useContext(DateContext);

  const deleteTask = (id, files) => {
    if (files?.length) {
      files.forEach(async ({ id }) => {
        const deletedFileRef = storRef(storage, `files/${id}`);
        try {
          await deleteObject(deletedFileRef);
        } catch (error) {
          console.log(`files/${id} Файл уже был удален вручную из базы данных`);
        }
      });
    }
    remove(ref(database, `/${id}`));
  };

  const closeTask = (id) =>
    update(ref(database, `/${id}`), { status: "close" });

  // const isOverdue = () => dayjs().isSameOrBefore(dayjs(expirationDate));
  // Возможно написать setInterval

  return (
    <>
      <div className="task">
        <div className="task_title">{title}</div>
        {status === "active" ? <ActiveStatus /> : null}
        {status === "close" ? <FinishedStatus /> : null}
        {status === "overdue" ? <OverdueStatus /> : null}
        <div className="created_task_time">
          Выполнить до {dayjs(expirationDate).format("ll")}
        </div>
        <div className="task_description">{description}</div>
        {files?.length > 0
          ? files.map(({ id, name, url }) => (
              <div key={id} className="task_file">
                <a href={url} download="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_661_3756)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9 7V1C9 0.447716 8.55228 0 8 0C7.44772 0 7 0.447716 7 1V7H5C4.59554 7 4.2309 7.24364 4.07612 7.61732C3.92134 7.99099 4.0069 8.42111 4.29289 8.70711L7.29289 11.7071C7.68342 12.0976 8.31658 12.0976 8.70711 11.7071L11.7071 8.70711C11.9931 8.42111 12.0787 7.99099 11.9239 7.61732C11.7691 7.24364 11.4045 7 11 7H9ZM2 11C2.55228 11 3 11.4477 3 12V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V12C13 11.4477 13.4477 11 14 11C14.5523 11 15 11.4477 15 12V13C15 14.6569 13.6569 16 12 16H4C2.34315 16 1 14.6569 1 13V12C1 11.4477 1.44772 11 2 11Z"
                        fill="#060E1F"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_661_3756">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="file_name">{name}</span>
                </a>
              </div>
            ))
          : null}
        {status === "active" ? (
          <button onClick={() => setShowModal(true)} className="edit_task">
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
                d="M20.7684 9.44331L20.1428 10.0689L13.8867 3.81306L14.5123 3.18638C16.086 1.64988 19.3149 1.53497 20.8062 3.19901C22.4224 4.77698 22.3846 7.86534 20.7684 9.44331ZM5.91844 21.9544H3.11956C2.44782 21.9544 2 21.5125 2 20.8497V18.0879C2 16.6517 2.24362 15.4423 3.25122 14.448L12.0098 5.68945L18.2659 11.9456L9.50733 20.7041C8.49973 21.6984 7.37387 21.9544 5.91844 21.9544Z"
                fill="#060E1F"
              />
            </svg>
          </button>
        ) : null}
        <div className="buttons">
          {status === "active" ? (
            <button onClick={() => closeTask(id)} className="finished_task">
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
                  d="M15.3839 3.11612C15.872 3.60427 15.872 4.39573 15.3839 4.88389L6.88388 13.3839C6.39573 13.872 5.60427 13.872 5.11612 13.3839L0.616117 8.88389C0.127962 8.39573 0.127962 7.60427 0.616117 7.11612C1.10427 6.62796 1.89573 6.62796 2.38388 7.11612L6 10.7322L13.6161 3.11612C14.1043 2.62796 14.8957 2.62796 15.3839 3.11612Z"
                  fill="#12b76a"
                />
              </svg>
              <span className="button_text">Выполнить</span>
            </button>
          ) : null}
          <button
            type="submit"
            onClick={() => deleteTask(id, files)}
            className="delete_task"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 5C8 3.34315 9.34315 2 11 2H13C14.6569 2 16 3.34315 16 5L18 5C18.5523 5 19 5.44772 19 6C19 6.55229 18.5523 7 18 7L15 7L9.00099 7L9 7L8.99901 7L6 7C5.44772 7 5 6.55228 5 6C5 5.44771 5.44772 5 6 5L8 5ZM13 4C13.5523 4 14 4.44772 14 5H10C10 4.44772 10.4477 4 11 4H13ZM7 8C6.44772 8 6 8.44772 6 9V20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20V9C18 8.44772 17.5523 8 17 8H7Z"
                fill="#FC0D54"
              />
            </svg>
            <span className="button_text">Удалить</span>
          </button>
        </div>
      </div>
      {showModal ? (
        <EditModalTask
          isShow={showModal}
          taskId={id}
          prevFiles={files}
          setShow={setShowModal}
        />
      ) : null}
    </>
  );
};

export default Task;
