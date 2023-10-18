/**
 * 简易实现rxjs的BehaviorSubject， Observable, 以及rxjs-hooks的useObservable
 */
import { useEffect, useState } from "react";

class BehaviorSubject {
  public value: any;
  private observers: any = []; //观察者列表
  constructor(initValue: any) {
    this.value = initValue; //初始值
  }

  //订阅观察者
  subscribe(observer: any) {
    this.observers.push(observer);
    observer(this.value);
    return () => {
      this.observers = this.observers.filter((obs: any) => obs !== observer)
    }
  }
  // 更新值并通知观察者
  next(value: any) {
    this.value = value;
    this.observers.forEach((observer: any) => observer(value))
  }

  asObservable () {
    return new Observable(this)
  }  
}

class Observable {
  private subject: any;
  constructor(subject: any) {
    this.subject = subject;
  }
  subscribe(observer: any) {
    this.subject.subscribe(observer);
  }
}

const useObservable = (callback: () => Observable) => {
  const [ val, valSet ] = useState(null)
  useEffect(() => {
    const temp = callback();

    temp.subscribe((res: any) => {
      valSet(res);
    })
  }, [callback])

  return val
}