import React, { useState } from "react";
import { VirtualList } from "frame/virtual.list/virtual.list";
import './style.scss'

const ItemBox = ({data}: {data: any}) => {
  return (
    <div className="item-box">{ data }</div>
  )
}

export const VirtualListDemo = () => {
  const [items] = useState(Array(100).fill(1).map((_, i) => i + 1));

  return (
    <div className="test">
      <VirtualList list={items} containerHeight={500} ItemBox={ ItemBox } ></VirtualList>
    </div>
  )
}

