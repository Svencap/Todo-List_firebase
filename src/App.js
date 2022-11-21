import logo from "./logo.svg";
import "./App.css";
import FromTask from "./components/FromTask";
import Tasks from "./components/Tasks";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
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
