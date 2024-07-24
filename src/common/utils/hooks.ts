import React, { useEffect, useRef, useState } from "react";

// 用法: const didMount = useDidMount()
export const useDidMount = () => {
  const didMountRef = useRef(true);
  useEffect(() => {
    didMountRef.current = false;
  }, [])
  return didMountRef.current;
}

// 代替componentDidMount
export const useMountedEffect = (fn:Function, depends: any) => {
  const didMountedRef = useRef(true);

  useEffect(() => {
    if(didMountedRef.current) {
      didMountedRef.current = false;
      return fn();
    }
  }, depends)
}

// 代替componentDidUpdate
export const useUpdateEffect = (fn: Function, depends: any) => {
  const didUpdateRef = useRef(false);

  useEffect(() => {
    if(didUpdateRef.current) {
      return fn();
    }
    didUpdateRef.current = true;
  }, depends)
}

type IChangeType = 0|1; //0为开始， 1为end
export const useCountdown = (nextTime: number, showDay = true, onChange = (type: IChangeType) => {}) => {
  const timer = useRef<any>(null);
  const endTime = useRef(0);
  const totalTime = useRef(0);

  const [ leftDays, leftDaysSet ] = useState(0);
  const [ leftHours, leftHoursSet ] = useState(0);
  const [ leftMins, leftMinsSet ] = useState(0);
  const [ leftSeconds, leftSecondsSet ] = useState(0);

  useEffect(() => {
    const hiddenProperty = ['hidden', 'webkitHidden', 'mozHidden'].find(item => (item in document)) || '';

    const handler = () => {
      //@ts-ignore
      if(!document[hiddenProperty]) {
        // 页面可见状态
        clearTimeout(timer.current);
        const now = new Date().getTime();
        const isEnd = nextTime - now < 0;
        if(isEnd) {
          leftDaysSet(0);
          leftHoursSet(0);
          leftMinsSet(0);
          leftSecondsSet(0);
          onChange(1);
          return;
        }
        onChange(0);
        totalTime.current = nextTime - now;
        countdown()
      }
    }
    const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilityChange');
    document.addEventListener(visibilityChangeEvent, handler, false);
    return () => {
      document.removeEventListener(visibilityChangeEvent, handler, false);
    }
  }, [nextTime])

  useEffect(() => {
		if(!nextTime) return;
		clearTimeout(timer.current);
		endTime.current = nextTime;
		const now = new Date().getTime();
		const isEnd = nextTime - now < 0;
		if(isEnd) { onChange(1); return; };

		onChange(0);
		totalTime.current = nextTime - now;
		countdown();
		return () => {
			clearTimeout(timer.current);
			timer.current = null;
		}
		/* eslint-disable-next-line */
	}, [nextTime])

  const countdown = () => {
    const diff = totalTime.current - 1000;
    totalTime.current = diff;
    let day = parseInt(diff / 1000 / 60 / 60 / 24 + '');
    let hour = parseInt((!showDay ? (diff / 1000 / 60 / 60) : (diff / 1000 / 60 / 60 % 24)) + '');
    let minute = parseInt(diff / 1000 / 60 % 60 + '');
    let second = parseInt(diff / 1000 % 60 + '');
    
    leftDaysSet(day);
    leftHoursSet(hour);
    leftMinsSet(minute);
    leftSecondsSet(second);
    if(diff < 0) {
      leftDaysSet(0);
			leftHoursSet(0);
			leftMinsSet(0);
			leftSecondsSet(0);
      onChange(1);
			return;
    }
    timer.current = setTimeout(() => countdown(), 1000)
  }
  return {
    leftDays,
    leftHours,
    leftMins,
    leftSeconds
  }
}

export const useXState = (initState: any) => {
  const [state, setState] = useState(initState);
  let isUpdate = useRef<any>(null);

  const setXState = (state: any, cb: any) => {
    setState((prev: any) => {
      isUpdate.current = cb;
      return typeof state === 'function' ? state(prev) : state
    })
  }

  useEffect(() => {
    if(isUpdate.current) {
      isUpdate.current();
    }
  })
  return [state, setXState];
}


export const useDebounce = (fn: any, delay = 500) => {
  const timer = useRef<any>(null);

  return (...args: any) => {
    if(timer.current) { clearTimeout(timer.current) }
    timer.current = setTimeout(() => {
      fn().apply(null, args);
    }, delay);
  }
}

export const useThrottle = (fn: any, delay = 500) => {
  const timeout = useRef<any>(null);

  return (...args: any) => {
    if(timeout.current) { return; }
    timeout.current = true;
    setTimeout(() => {
      fn().apply(null, args)
      timeout.current = false;
    }, delay)
  };
}


const useScroll = (scrollRef: any) => {
  const [ pos, setPos ] = useState([0, 0]);
  
  useEffect(() => {
    const handleScroll = (e: any) => {
      setPos([scrollRef.current.scrollLeft, scrollRef.current.scrollRight]);
    }
    scrollRef.current.addEventListener('scroll', handleScroll, false);
    return () => {
      scrollRef.current.removeEventListener('scroll', handleScroll, false);
    }
  }, [])
  return pos;
}
