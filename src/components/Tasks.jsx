import { useState, useEffect } from "react";

import Task from "./Task.jsx";
import { database } from "../firebase-config";
import { onValue, ref } from "firebase/database";


const Tasks = () => {
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    onValue(ref(database), (snapshot) => {
      const data = snapshot.val();
      const newState = data ? Object.values(data) : [];
      setTasks(newState);
    });
  }, []);

  
  return (
    <div className="tasks_container">
      <div className="active_tasks">
        <div>ACTIVE</div>
        {tasks.map(({ id, title, description, status, expirationDate, url, fileName, files }) => (
          <Task
            key={id}
            id={id}
            title={title}
            description={description}
            status={status}
            expirationDate={expirationDate}
            files={files}
          />
        ))}
      </div>
    </div>
  );
};

export default Tasks;