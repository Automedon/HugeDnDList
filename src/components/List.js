import React from "react";
import { Tree, Input } from "antd";
const { TreeNode } = Tree;
const { Search } = Input;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.nodes) {
      if (node.nodes.some(item => item.code === key)) {
        parentKey = node.code;
      } else if (getParentKey(key, node.nodes)) {
        parentKey = getParentKey(key, node.nodes);
      }
    }
  }
  return parentKey;
};
class List extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: "",
    autoExpandParent: true,
    gData: [],
    dataList: []
  };
  componentDidMount() {
    this.setState({
      gData: this.props.data,
      dataList: this.props.dataList
    });
  }
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.code === key) {
          return callback(item, index, arr);
        }
        if (item.nodes) {
          return loop(item.nodes, key, callback);
        }
      });
    };
    const data = [...this.state.gData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, item => {
        item.nodes = item.nodes || [];
        item.nodes.push(dragObj);
      });
    } else if (
      (info.node.props.nodes || []).length > 0 &&
      info.node.props.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, item => {
        item.nodes = item.nodes || [];
        item.nodes.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      gData: data
    });
  };
  onDragEnter = info => {
    this.setState({
      expandedKeys: info.expandedKeys
    });
  };
  onChange = e => {
    const { value } = e.target;
    if (value === "") {
      this.setState({
        expandedKeys: [],
        searchValue: ""
      });
      return;
    }
    const { gData, dataList } = this.state;
    const expandedKeys = dataList
      .map(item => {
        if (item.description.indexOf(value) > -1) {
          return getParentKey(item.code, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    });
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent, gData } = this.state;
    const loop = data =>
      data.map(item => {
        const name = `${item.code} ${item.description}`;
        const index = name.indexOf(searchValue);
        const beforeStr = name.substr(0, index);
        const afterStr = name.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: "#f50" }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{`${item.code} ${item.description}`}</span>
          );
        if (item.nodes) {
          return (
            <TreeNode key={item.code} title={title}>
              {loop(item.nodes)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.code} title={title} />;
      });
    return (
      <>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="Search"
          onChange={this.onChange}
        />
        <Tree
          className="draggable-tree"
          checkable
          draggable
          blockNode
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {loop(gData)}
        </Tree>
      </>
    );
  }
}

export default List;
