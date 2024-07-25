
/* 无限加载 */
import React, { useEffect, useRef  } from "react";

interface ILoadMore {
  isLoading: boolean, 
  isComplete: boolean, 
  onLoad: Function
}

export const LoadMore = ({isLoading, isComplete, onLoad}: ILoadMore) => {

  const ref = useRef<any>(null);

  useEffect(() => {
    if(!ref.current) { return }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
         // 进入视口
        if(entry.intersectionRatio > 0) {
          if(isComplete || isLoading) {
            return;
          }  
          onLoad();
        }
      })
    }, {})
    observer.observe(ref.current)
    
    return () => {
      observer && observer.unobserve(ref.current)
    }
    /* eslint-disable-next-line */
  }, [isComplete, isLoading])

  return (
    <div className="load-more" ref={ref}>
      {
        isLoading ? '加载中' : isComplete ? '加载完成' : '加载更多'
      }
    </div>
  )
}