import React from "react";
import List from "./components/List";

function App({ data, dataList }) {
  return (
    <>
      <h3>Created by Automedon</h3>
      <List data={data} dataList={dataList} />
    </>
  );
}

export default App;
