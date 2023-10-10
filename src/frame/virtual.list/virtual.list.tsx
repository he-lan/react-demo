import React, { useState, useRef, useMemo, useCallback } from "react";
import './style.scss';

// 高度固定
export const VirtualList = ({list=[], containerHeight=800, ItemBox=<></>, itemHeight = 50}: any) => {
  const containerRef = useRef<any>();
  const [startIndex, startIndexSet] = useState(0);

  // 用于撑开container的盒子，计算高度
  const wrapHeight = useMemo(() => {
    return list.length * itemHeight;
  }, [list, itemHeight])
  // 可视区域最多显示的条数
  const limit = useMemo(() => {
    return Math.ceil(containerHeight/itemHeight)
  }, [containerHeight, itemHeight])
  //当前可视区域显示的列表的结束索引
  const endIndex = useMemo(() => {
    return Math.min(startIndex + limit, list.length-1);
  }, [startIndex, limit, list.length])


  const handleScroll = (e: any) => {
    if(e.target !== containerRef.current) { return; }
     const scrollTop = e.target.scrollTop;
     let currentIndex = Math.floor(scrollTop / itemHeight);
     if(currentIndex !== startIndex) {
      startIndexSet(currentIndex);
     }
  }

  const renderList = useCallback(() => {
    const rows: any[] = [];
    for(let i = startIndex; i <= endIndex; i++) {
      rows.push(
        <ItemBox
          data={list[i]} 
          key={i} 
        />
      )
    }
    return rows;
  }, [startIndex, endIndex, ItemBox, list])

  return (
    <div className="container" ref={containerRef} style={{height: containerHeight + 'px'}} onScroll={handleScroll}>
      <div className="list-box" style={{height: wrapHeight + 'px', transform: `translate3d(0,${containerRef.current?.scrollTop || 0}px, 0)`}}>
        { renderList() }
      </div>
    </div>
  )
}



