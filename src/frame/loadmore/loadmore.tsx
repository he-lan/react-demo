import { useEffect, useRef  } from "react";

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
        if(entry.intersectionRatio > 0) {
          // 进入视口
          if(isComplete || isLoading) {
            return;
          }  
          onLoad();
        }
      })

      return () => {
        observer && observer.unobserve(ref.current)
      }
    }, {})
    observer.observe(ref.current)
    
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