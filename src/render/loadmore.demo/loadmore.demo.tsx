import { useState } from "react";
import { LoadMore } from "../../frame/loadmore/loadmore";
import './style.scss'

export const LoadMoreDemo = () => {
  const [ list, listSet ] = useState<any>([])
  const [ isLoading,  ] = useState(false);
  const [ isComplete,  ] = useState(false);

  const query = () => {
    setTimeout(() => {
      const arr = new Array(10).fill(1111);
      listSet((list: any) => ([...list, ...arr]));
    })
  }

  return (
    <div className="load-more-demo">
      {
        list.map((item: any, index: number) => {
          return (
            <div className="load-more-demo-item" key={index}>{index}</div>
          )
        })
      }
      <LoadMore isLoading={isLoading} isComplete={isComplete} onLoad={query} />
    </div>
  )
}