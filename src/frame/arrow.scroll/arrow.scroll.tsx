import React, { useEffect, useRef, useState } from "react";
import './style.scss';


interface IScrollArrowList {
  children: any,
  moveRatio?: number,
  moveDistance?: number,
  className?: string,
  type?: 'gradient' | 'block',
}
export const ArrowScroll = ({ children, moveDistance, moveRatio, className = '', type = 'block' } : IScrollArrowList) => {
  const startRef = useRef<any>();
  const endRef = useRef<any>();
  const contentRef = useRef<any>();

  const [ showLeft, showLeftSet ] = useState(false);
  const [ showRight, showRightSet ] = useState(false);

  const scroll = (side:-1|1) => {
		const dom = contentRef.current;
    const childNodesNum = dom.childNodes.length;
    const offset = moveRatio ? moveRatio : (1/childNodesNum)
  
    const x = moveDistance ? moveDistance : dom.getBoundingClientRect().width * offset
		const left = dom.scrollLeft +  side * x  
    
		if(dom){
			dom.scrollTo(left, 0);
		}
	}

  useEffect(() => {
    const startItem = startRef.current as HTMLElement;
    const endItem = endRef.current as HTMLElement;
   
    const intersection = new IntersectionObserver((entries) => {
      const start = entries.find(item => item.target === startItem);
      const end = entries.find(item => item.target === endItem);
    
      start && showLeftSet(!(start.intersectionRatio > 0));
      end && showRightSet(!(end.intersectionRatio > 0));
    })
    

    startItem && intersection.observe(startItem);
    endItem && intersection.observe(endItem);

    return () => {
      startItem && intersection.unobserve(startItem);
      endItem && intersection.unobserve(endItem);
      intersection?.disconnect();
    }
  }, [children.length])

  if(!children.length) { return null; }
  return (
    <div className={`bksass-arrow-scroll ${className}`}>
      {
        showLeft ? (
          <div className={ `bksass-arrow-scroll-left_arrow ${type === 'gradient' ? 'gradient-arrow' : 'block-arrow'}` } onClick={ () => scroll(-1) }>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.934 12l3.89 3.89-1.769 1.767L8.398 12l1.768-1.768 3.89-3.889 1.767 1.768-3.889 3.89z" fill="currentColor"></path></svg>
          </div>
        ) : null
      }
      <div className={`bksass-arrow-scroll-content `} ref={contentRef}>
        <div className="bksass-arrow-scroll-content-start" ref={startRef}>&nbsp;</div>
        { children }
        <div className="bksass-arrow-scroll-content-end" ref={endRef}>&nbsp;</div>
      </div>
      {
        showRight ? (
          <div className={ `bksass-arrow-scroll-right_arrow ${type === 'gradient' ? 'gradient-arrow' : 'block-arrow'}`} onClick={ () => scroll(1)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z" fill="currentColor"></path></svg>
          </div>
        ) : null
      }
    </div>
  )
}