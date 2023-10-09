import React, { useState, useRef } from "react";
import './style.scss';

interface ILotteryRound {
  num: number,
  roulette: any,
  startBtn: any,
  onStartRoll: Function,
  onCompleteRoll: Function

}

export const LotteryRound = React.forwardRef((props: ILotteryRound, ref: any) => {
  const {
    num,
    roulette,
    startBtn,
    onStartRoll,
    onCompleteRoll
  } = props;
  const [ style, styleSet ] = useState({});
  const [ to, toSet ] = useState(0);
  const [ isDisable, isDisableSet ] = useState(false);
  
  const disabled = () => {
    isDisableSet(true);
  }
  const enable = () => {
    isDisableSet(false);
  }
  const rollTo = (pos: number) => {
    toSet(pos);
    styleSet({
      transition: 'all 5s',
      transform: `rotate(${(360 - 360 / num * pos) + 360 * 8}deg)`
    })
  }

  const start = () => {
    if(isDisable) { return; }
    disabled();
    onStartRoll();
  }

  const onTransitionEnd = () => {
    enable();
    styleSet({
      transition: 'all 0s',
      transform: `rotate(${360 - 360 / num * to}deg)`
    })
    onCompleteRoll();
  }

  ref && (ref.current = {
    enable,
    disabled,
    rollTo
  })
  return (
    <div className="lottery-round">
      <img alt=""
        ref={ ref }
        style={ style }
        className="lottery-round-roulette"
        src={ roulette }
        onTransitionEnd={ onTransitionEnd }
        onAnimationEnd={ onTransitionEnd }
      />
      <img alt="" className="lottery-round-startbtn" src={ startBtn } onClick={ start }/>
    </div>
  )
})