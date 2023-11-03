import React, { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { binarySearchAdjacent } from "common/utils/search.func";
import './style.scss'

interface IDynamicVirtualList {
  list: any[],                   //数据列表
  ItemRender: any,               //每项列表DOM
  containerHeight: number        //可视窗口高度
  estimatedItemHeight?: number;  //预估每项高度
  buffer?: number                //缓存数据（防止滚动过程页面空白）
}

export const DynamicVirtualList = ({
  list,
  ItemRender,
  containerHeight,
  estimatedItemHeight = 20,
  buffer = 10,
}: IDynamicVirtualList) => {
  const wrapRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  const [ start, startSet ] = useState(0);
  const [ scrollTop, scrollTopSet ] = useState(0);
  const [ positionCache, positionCacheSet ] = useState<any>([])

  const end = useMemo(() => {
    const canVisible = Math.ceil(containerHeight / estimatedItemHeight);
    return Math.min(start + canVisible, list.length - 1);
  }, [start, containerHeight, estimatedItemHeight, list.length])

  const wrapHeight = useMemo(() => {
    let length = positionCache.length;
    return length ? positionCache[length - 1]?.bottom : 0
  }, [ positionCache ])


  const getTransform = useCallback(() => {
    return `translate3d(0, ${ start >= 1 ? positionCache[start-1].bottom : 0 }px, 0)`
  }, [positionCache, start]) 

  useEffect(() => {
    const positions = list.map((_: any, index: number) => ({
      index,
      height: estimatedItemHeight,
      top: index * estimatedItemHeight,
      bottom: (index + 1) * estimatedItemHeight
    }));
    positionCacheSet([...positions])
  }, [list, estimatedItemHeight])
  
  useEffect(() => {
    if(!wrapRef.current || !positionCache.length) { return; }

    const nodeList = wrapRef.current.childNodes;
    const positionList = [...positionCache];
    let needUpdate = false;
    nodeList.forEach((node: any) => {
      let newHeight = node.getBoundingClientRect().height;
      const index = Number(node.id);
      const oldHeight = positionList[index].height;
      const dValue = oldHeight - newHeight;
      if(dValue) {
        needUpdate = true;
        positionList[index].height = newHeight;
        positionList[index].bottom -= dValue;
        for(let j = index + 1; j < positionList.length; j++) {
          positionList[j].bottom = positionList[j].bottom - dValue;
          positionList[j].top = positionList[j - 1].bottom;
        }
      }
      if(needUpdate) {
        positionCacheSet(positionList)
      }
    });
  }, [scrollTop, positionCache, wrapRef])

  const getStartIndex = (scrollTop: number) => {
    const list = positionCache.map((item: any) => item.bottom);
    return binarySearchAdjacent(list, scrollTop);
  }

  const handleScroll = (e: any) => {
    const curScrollTop = e.target.scrollTop;
    scrollTopSet(curScrollTop);
    const currentStart = getStartIndex(curScrollTop);
    startSet(currentStart);
  }

  const renderList = useCallback(() => {
    const rows = [];
    const startIndex = Math.max(0, Math.min(start, start - buffer));
    const endIndex = Math.min(end+buffer, list.length - 1);

    for(let i = startIndex; i <= endIndex; i++) {
      const Dom = (
        <div className="dynamic-virtual-list-item" id={i+''} key={i}>
          <ItemRender data={list[i]} number={i} />
        </div>
      )
      rows.push(Dom)
    }
    return rows;
  }, [start, end, ItemRender, list, buffer])

  return (
    <div className="dynamic-virtual-list" style={{height: containerHeight + 'px'}} ref={containerRef} onScroll={handleScroll}>
      <div className="dynamic-virtual-list-main"  style={{height: wrapHeight + 'px'}}>
        <div className="dynamic-virtual-list-wrap" ref={wrapRef} style={{transform: getTransform()}}>
          { renderList() }
        </div>
      </div>
    </div>
  )
}



