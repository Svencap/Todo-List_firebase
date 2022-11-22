import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import "./less/index.less";
import reportWebVitals from "./reportWebVitals";
import DateContext from "./context/DateContext.jsx";


import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <DateContext.Provider value={dayjs}>
    <App />
    </DateContext.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();