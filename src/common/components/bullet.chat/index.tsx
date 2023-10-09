import React, { useEffect, useState, useRef } from "react";
import { useMountedEffect, useUpdateEffect } from "../../utils/hooks";
import './style.scss'

const rand = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
}

interface IMsgType {
  label: string,
  uid: string | number,
  active?: boolean,
  children?: any,
  userID?: string | number,
  userName?: string,
  avatar?: string,
  isHighlight?: boolean,
  onAnimationEnd?: Function,
}

export const BulletChatTest = ({ways, msgs}: {ways: number, msgs: any[]}) => {
  const [ wayArr, wayArrSet ] = useState(new Array(ways).fill(''));
  const [ insertMsgs, insertMsgsSet ] = useState<any>([]);
  const preMsgs = useRef<any>(msgs);
  
  const diff = (nextMsgs: IMsgType[], prevMsgs: IMsgType[]): IMsgType[] => {
    const diff: IMsgType[] = [];
    nextMsgs.forEach((nextMsg: IMsgType) => {
      const index = prevMsgs.findIndex((prevMsgs: IMsgType) => {
        return prevMsgs.uid === nextMsg.uid;
      })
      if(index < 0) {
        diff.push(nextMsg);
      }
    });
    return diff;
  }

  const update = (msgs: IMsgType[], isInsert = false) => {
     if(isInsert) {
      const inserts = msgs.map((msg: IMsgType) => {
        return Object.assign({}, msg, {isHighlight: true});
      })
      insertMsgsSet((insertMsgs: IMsgType[]) => ([...insertMsgs, ...inserts]))
     }

     const arr = JSON.parse(JSON.stringify(wayArr));

     msgs.forEach((msg: IMsgType) => {
      msg.uid = new Date().getTime();
      const way = rand(0, ways);

      if(!arr[way]) {
        arr[way] = [];
      }
      arr[way].push(msg);
     })
     wayArrSet([...arr]);
  }

  const removeInsert = (msg: IMsgType) => {
    const res = insertMsgs.filter((item: IMsgType) => item.uid !== msg.uid);
    insertMsgsSet([...res]);
  }

  useMountedEffect(() => {
    update(msgs);
    preMsgs.current = msgs;
  }, [msgs])

  useUpdateEffect(() => {
    const diffMsgs = diff(msgs, preMsgs.current);
    update(diffMsgs, true);
    preMsgs.current = msgs;
  }, [msgs])

  return (
    <div className="bullet-chat">
      {
        wayArr.map((item, index) => {
          return item && item.length && <BulletChatWay
            key={ index }
            msgs={ item }
            top={ index / ways * 100 } />
        })
      }
      {
        insertMsgs && insertMsgs.length > 0 && <div className="bullet-chat-insert">
          {
            insertMsgs.map((msg: IMsgType) => {
              return (
                <BulletChatItem
                  key={ 'insert:' + msg.uid }
                  active={ true }
                  msg={msg}
                  onAnimationEnd={ () => removeInsert(msg) }
                />
              );
            })
          }
        </div>
      }
    </div>
  )
}

interface IBulletChatWay {
  top: number,
  msgs: IMsgType[],
}
const BulletChatWay = (props: IBulletChatWay) => {
  const { top, msgs } = props;
  const [ active, activeSet ] = useState(0);

  const next = () => {
    let temp = active + 1;
    temp = temp >= msgs.length ? 0 : temp;
    activeSet(temp);
  }
  return (
    <div className="bullet-chat-way"
      style={{ top: top + '%' }}>
      {
        msgs.map((msg: IMsgType, index: number) => {
          return active === index && (
            <BulletChatItem 
              key={ index + '' + msg.uid }
              active={ active === index }
              msg={msg}
              onAnimationEnd={ () => next()} />
          );
        })
      }
    </div>
  )
}


const animation = [{
  transform: 'translate(100vw, 0px)'
}, {
  transform: 'translate(-100%, 0px)'
}]

interface IBulletChatItem {
  active: boolean,
  msg: IMsgType,
  onAnimationEnd: Function
}
const BulletChatItem = (props: IBulletChatItem) => {
  const { active, msg, onAnimationEnd } = props;
  const ref = useRef<any>();
  const speed = useRef(rand(4, 8));
  const timer = useRef<any>(null);

  const run = () => {
    if(!active) { return; }
    const defaultOpts = {
      duration: speed.current * 1000,
      fill: 'backwards',
      easing: 'linear'
    }
    ref.current.animate(
      animation,
      defaultOpts
    ).onfinish = () => {
      onAnimationEnd();
    }
  }

  useEffect(() => {
    timer.current = setTimeout(() => {
      ref.current.style.width = ref.current.offsetWidth + 1 + 'px';
      run();
    })
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [active])

  const { isHighlight, label, avatar } = msg;
  return (
    <div
      className={ `bullet-chat-item ${ isHighlight ? 'bullet-chat-item-highlight' : ''}` }
      ref={ ref }>
      { label }
      { avatar && <div
        className="bullet-chat-item-avatar"
        style={{'backgroundImage': `url(${avatar})`}}></div> }
    </div>
  )
}