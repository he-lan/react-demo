import React, { useState, useRef, useEffect } from "react";
import './style.scss';

interface ILotteryProps {
  roulette: string;  //九宫格奖品背景图
  startBtn: string; //开始按钮
  onStartRoll?: Function, //开始抽奖
  onCompleteRoll?: Function //抽奖成功回调
}

export const LotteryRect = React.forwardRef((props: ILotteryProps, ref: any ={}) => {
  const {
    roulette,
    startBtn,
    onStartRoll = () => {},
    onCompleteRoll = () => {}
  } = props;

  const [ active, activeSet ] = useState(0);
  const [ isDisable, isDisableSet ] = useState(false);
  const timer = useRef<any>(null);
  const endTimer = useRef<any>(null);
  const loopLimit = useRef(6);
  const loop = useRef(0);

  const disabled = () => {
    isDisableSet(true);
  };
  const enable = () => {
    isDisableSet(false);
  };

  const rollTo = (pos: number) => {
    const totalRollNum = pos + 8 * loopLimit.current;
    timer.current = setTimeout(() => {
      loop.current+=1;
      if(loopLimit.current <= totalRollNum) {
         activeSet(a => a >= 7 ? 0 : a + 1);
         rollTo(pos);
      } else {
        loop.current = 0;
        end();
      }
    }, 50)
  }

  const start = () => {
    if(isDisable) { return; }
    activeSet(0);
    disabled();
    onStartRoll();
  }

  const end= () => {
    clearTimeout(timer.current);
    clearTimeout(endTimer.current);
    endTimer.current = setTimeout(() => {
      enable();
      onCompleteRoll();
    }, 100);
  }

  ref && (ref.current({
    enable,
    disabled,
    rollTo
  }))

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
      clearTimeout(endTimer.current);
    }
  }, [])

  return (
    <div className="lottery-rect">
      <img src={ roulette } alt="" className="lottery-rect-roulette" />
      <div className="lottery-rect-items">
        <div className={`lottery-rect-item ${active === 0 ? 'active' : ''}`}></div>
        <div className={`lottery-rect-item ${active === 1 ? 'active' : ''}`}></div>
        <div className={`lottery-rect-item ${active === 2 ? 'active' : ''}`}></div>
        <div className={`lottery-rect-item ${active === 7 ? 'active' : ''}`}></div>
        <div className={`lottery-rect-item ${active === 1000 ? 'active' : ''}`}></div>
        <div className={`lottery-rect-item ${active === 3 ? 'active' : ''}`}></div>
        <div className={`lottery-rect-item ${active === 6 ? 'active' : ''}`}></div>
        <div className={`lottery-rect-item ${active === 5 ? 'active' : ''}`}></div>
        <div className={`lottery-rect-item ${active === 4 ? 'active' : ''}`}></div>
      </div>
      <img src={ startBtn } alt="" className="lottery-rect-start_btn" onClick={start} />
    </div>
  )
})