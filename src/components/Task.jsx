import { useState, useContext } from "react";

import { database, storage, storRef } from "../firebase-config";
import { ref, remove, update } from "firebase/database";
import { deleteObject } from "firebase/storage";

import DateContext from "../context/DateContext";

import { ActiveStatus, FinishedStatus, OverdueStatus } from "./Statuses/statuses";
import EditModalTask from "./EditModalTask";



/**
 * @desc Добавленная задача
 * @param {object} obj Данные 
 * @param {string} obj.id - Уникальный идентификатор задачи
 * @param {string} obj.title - Заголовок задачи
 * @param {string} obj.description - Описание задачи
 * @param {string} obj.status - Статус задачи
 * @param {string} obj.expirationDate - Дата до которой нужно выполнить задачу
 * @param {Array} obj.files - Прикрепленные файлы
 */


const Task = ({ id, title, description, status, expirationDate, files }) => {


  const [showModal, setShowModal] = useState(false);

  const dayjs = useContext(DateContext);

  const deleteTask = (id, files) => {
    if (files?.length) {
      files.forEach(({ id }) => {
        const deletedFileRef = storRef(storage, `files/${id}`);
        deleteObject(deletedFileRef);
      });
    }
    remove(ref(database, `/${id}`));
  };

  const closeTask = (id) => update(ref(database, `/${id}`), { status: "close" });

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
                    <path
                      d="M9.37132 6.62868C8.19975 5.45711 6.30025 5.45711 5.12868 6.62868L2.12868 9.62868C0.957107 10.8003 0.957107 12.6997 2.12868 13.8713C3.30025 15.0429 5.19975 15.0429 6.37132 13.8713L7.19749 13.0451M6.62868 9.37132C7.80025 10.5429 9.69975 10.5429 10.8713 9.37132L13.8713 6.37132C15.0429 5.19975 15.0429 3.30025 13.8713 2.12868C12.6997 0.957107 10.8003 0.957107 9.62868 2.12868L8.80397 2.95339"
                      stroke="#98A2B3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{name}</span>
                </a>
              </div>
            ))
          : null}
        <button type="submit" onClick={() => deleteTask(id, files)} className="delete_task">
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
          Удалить
        </button>
        {status === "active" ? (
          <>
            <button onClick={() => closeTask(id)} className="finishe_task">
              <svg
                width="16"
                height="15"
                viewBox="0 0 10 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1051_2373)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 6C0 9.3138 2.6862 12 6 12C9.3138 12 12 9.3138 12 6C12 2.6862 9.3138 0 6 0C2.6862 0 0 2.6862 0 6ZM5.8214 8.38579C5.43089 8.77636 4.79768 8.77639 4.40714 8.38584L2.59883 6.57754C2.30598 6.28469 2.30598 5.80989 2.59883 5.51704C2.89168 5.22419 3.36648 5.22419 3.65933 5.51704L5.1143 6.972L8.44323 3.64243C8.73606 3.34953 9.2109 3.34951 9.50377 3.64238C9.7966 3.93521 9.79661 4.40997 9.50381 4.70283L5.8214 8.38579Z"
                    fill="#16B84C"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1051_2373">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Выполнить
            </button>
            <button onClick={() => setShowModal(true)} className="finishe_task">
              Редактировать
            </button>
          </>
        ) : null}
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
