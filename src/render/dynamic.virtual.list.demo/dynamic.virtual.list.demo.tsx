import React, { useEffect, useState } from "react";
import faker from "faker"
import { DynamicVirtualList } from "frame/dynamic.virtual.list/dynamic.virtual.list";
import './style.scss'

export const DynamicVirtualListDemo = () => {
  const [ data, dataSet ] = useState< any>([]);

  useEffect(() => {
    let arr: any = []
    for(let i = 0; i < 200; i++) {
      arr.push(faker.lorem.sentences())
    }
    dataSet(arr);
  }, [])

  return (
    <div className="dynamic-vitual-list-demo">
      <DynamicVirtualList 
        containerHeight={ 600 }
        list={ data }
        buffer={ 0 }
        ItemRender={ Item }
      />
    </div>
  )
}

const Item = (props: any) => {
  const { number, data } = props;
  return (
    <div className="dynamic-vitual-list-demo-item" >
      <p>{number} --- {data}</p>
    </div>
  )
}