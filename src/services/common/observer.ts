/**
 * 观察者服务
 */

interface IObserver {
  update: (val?: any) => void;
}

interface ISubject {
  addObserver: (observer: IObserver) => void;
  removeObserver: (observer: IObserver) => void;
  notify: () => void;
}

//订阅者
export class Subject implements ISubject {
  private observer: IObserver[] = [];
  
  addObserver(observer: IObserver) {
    const has = this.observer.indexOf(observer) > -1;
    if(has) { return; }
    this.observer.push(observer);
  }

  removeObserver(observer: IObserver) {
    const index =  this.observer.indexOf(observer);
    if(index > -1) {
      this.observer.splice(index, 1);
    }
  }

  notify(param?: any) {
    this.observer.forEach((observer: IObserver) => observer.update(param));
  }
}

// 观察者
export class Observer implements IObserver {
  update(val?: any) { }
}
