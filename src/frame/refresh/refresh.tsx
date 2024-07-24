import React, { useState, useEffect, useRef } from "react";
import { animate, easeInOut } from 'popmotion';
import './style.scss';

import logo from 'assets/imgs/logo.png';

interface IRefresh {
  finished: boolean;
  timeout?: number;
  offset?: number;
  dampRateBegin?: number; //阻尼系数，下拉小于offset时的阻尼系数，值越接近0，高度变化越小，表现为越往下拉越难拉
  dampRate?: number; //下拉超过阀值后的阻尼系数，越接近0，下拉高度变化越小，例如0.1时表现是超过阀值后基本就拉不动了
  disabled?: boolean;
  onRefresh?: Function;
  onClose?: Function;
}

export const Refresh = ({
  finished,
  timeout = 6000,
  offset = 44,
  dampRateBegin = 0.4,
  dampRate = 0.2,
  disabled = false,
  onRefresh = () => {},
  onClose = () => {}
}: IRefresh) => {
  const elem = useRef<any>();
  const timer = useRef<any>();
  const minTimer = useRef<any>();
  const startTime = useRef(0);
  const downHeight = useRef(0);

  const [ waiting, waitingSet ] = useState(false);

  const reset = (start: number = getHeight()) => {
    if(!waiting) {
      onRefresh();
      wait();
      startTime.current = new Date().getTime();
    }

    animate({
      from: start,
      to: offset,
      duration: 300,
      ease: easeInOut,
      onUpdate: val => update(val)
    })
  }

  const wait = () => {
    waitingSet(true);
    timer.current = setTimeout(() => close(), timeout)
  }

  const close = (start: number = getHeight() ) => {
    clearTimeout(timer.current);

    animate({
      from: start,
      to: 0,
      duration: 300,
      ease: easeInOut,
      onUpdate: val => update(val),
      onComplete: () => {
        onClose();
        waitingSet(false)
      }
    })
  }

  const update = (val: number) => {
    setHeight(val);
    downHeight.current = val;
  }

  const setHeight = (height: number) => {
    if(!elem.current) { return; }
    elem.current.style.height = (height < 0 ? 0 : height) + 'px';
  }

  const getHeight = () => elem.current?.offsetHeight

  const computeBounces = (height: number, move: number) => {
    if(height + move <= offset) {
      return height + move * dampRateBegin;
    } else {
      const diff = offset - height
      return height + diff * dampRateBegin + (move - diff) * dampRate
    }
  }

  useEffect(() => {
    let startY = 0;
    let startX = 0;
    let moveY = 0;
    let moveX = 0;

    const touchStart = (e: any) => {
      startY = e.targetTouches[0].pageY;
      startX = e.targetTouches[0].pageX;
    }

    const touchMove = (e: any) => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      moveY = e.targetTouches[0].pageY - startY;
      moveX = e.targetTouches[0].pageX - startX;
      
      if(scrollTop > 2 || Math.abs(moveX) > Math.abs(moveY)) { return; }

      const height = computeBounces(downHeight.current, moveY);
      setHeight(height);
    }

    const touchEnd = () => {
      const height = getHeight();
      height < offset ? close(height) : reset(height)
    }

    const bind = () => {
      document.addEventListener('touchstart', touchStart, { passive: false });
      document.addEventListener('touchmove', touchMove, { passive: false });
      document.addEventListener('touchend', touchEnd, { passive: false });
    }

    const remove = () => {
      document.removeEventListener('touchstart', touchStart);
      document.removeEventListener('touchmove', touchMove);
      document.removeEventListener('touchend', touchEnd);
      clearTimeout(timer.current)
    }

    disabled ? remove() : bind();

    return () => remove();
    /* eslint-disable-next-line */
  }, [disabled])

  useEffect(() => {
    if(finished) {
      const minTime = 1000;
      const nowTime = new Date().getTime();
      const useTime = nowTime - startTime.current;
      if(useTime < minTime) {
        clearTimeout(minTimer.current);
        minTimer.current = setTimeout(() => close(), minTime - useTime)
      } else {
        close();
      }
    }
    return () => clearTimeout(minTimer.current)
    /* eslint-disable-next-line */
  }, [finished])

  return (
    <div className="bkreact-refresh">
      <img className={ `bkreact-refresh-logo ${waiting ? 'rotate' : ''}` } src={ logo } alt="" />
    </div>
  )
}