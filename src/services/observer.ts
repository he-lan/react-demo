let currentEffect: any = null;

export class Dep {
  private _val: any;
  public effects: Set<any>
  constructor(val: any) {
    this._val = val;
    this.effects = new Set();
  }
  get value() {
    this.depend();
    return this._val;
  }
  set value(newVal: any) {
    this._val = newVal;
    this.notify();
  }

  depend() { 
    // 收集依赖时，需要先将收集的依赖存储起来，而且不重复收集依赖
    // 依赖是通过effectWatcher内部的回调函数配合effectWatcher实现的，
    // 所以需要关联到effectWatcher函数，可以先定义一个全局变量currentEffect
    // @ts-ignore
    if(currentEffect) {
      this.effects.add(currentEffect);
    }
  }
  notify() {
    this.effects.forEach(effect => {
      effect();
    })
  }
}

const effectWatcher = (effect: Function) => {
  currentEffect = effect;
  effect();
  currentEffect = null;
}

const dep = new Dep('没有任何最新的动态');
let content;

effectWatcher(() => {
  content = dep.value;
  console.log(content);
})
dep.value = '目标对象发布新消息了';

const effectWatcherTest = (effect: Function) => {
  currentEffect = effect;
  effect();
  currentEffect = null;
}



