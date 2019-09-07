import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import data from "./okveds";

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { description, code } = node;
    dataList.push({ code, description: `${code} ${description}` });
    if (node.nodes) {
      generateList(node.nodes);
    }
  }
};
generateList(data);

ReactDOM.render(
  <App dataList={dataList} data={data} />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
