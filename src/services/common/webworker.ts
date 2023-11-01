/**
 * 动态创建web worker
 */

import { BehaviorSubject, Observable, Observer } from "rxjs";

export interface IMessage {
  data: any
}

export class DynamicWorker {
  private worker: Worker | null;
  private _message$ = new BehaviorSubject<any>(null);

  constructor(handle: Function) {
    const handleFn = `const handle = ${handle.toString()}`;    // worker异步处理的具体事件
  
    const onmessageFn = `onmessage = ({data}) => {
      postMessage(handle(data.data)); 
    }`
    const blob = new Blob([`${handleFn};${onmessageFn};`], {type: 'text/javascript'}); 
    this.worker = new Worker(URL.createObjectURL(blob)); // 浏览器识别并重新解析为该函数的 url 
    //@ts-ignore
    URL.revokeObjectURL(blob); //释放被引用的 url 对象，就算释放了也能重复访问创建的 Web Worker的
  }

  // 动态调用
  send(data: IMessage) {
    if(!this.worker) { return; }
    this.worker?.postMessage(data);
    this.worker.addEventListener('message', ({data}: MessageEvent) => {
      this._message$.next(data);
    });

    return new Observable((observer: Observer<any>) => {
      this._message$.subscribe(res => {
        observer.next(res); 
      })
    });
  }

  close() {
    this.worker?.terminate();
  }
}

/*
  tips用法：
  const worker = new DynamicWorker((data: any) => {
      let arr: any
      arr = data.map((item: any) => {
        return {
          name: item.name,
          age: item.age+2
        }
      })
    
      return arr
  })
  const arr = [
    {
      name: 'Tom',
      age: 18,
    }, {
      name: 'Lily',
      age: 20,
    }
  ]
  worker.send({data: arr}).subscribe(res => {
    console.log(res)
  })
 */