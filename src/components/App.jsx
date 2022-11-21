import "../css/App.css";
import FromTask from "./FromTask";
import Tasks from "./Tasks";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <div className="App">
      <h1 className="title_app">TO DO LIST</h1>
      <div className="container">
        <FromTask />
        <Tasks />
        <ToastContainer autoClose={1500}/>
      </div>
    </div>
  );
}

export default App;
