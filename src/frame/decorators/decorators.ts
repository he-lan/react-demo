// 某个时间内，同一个函数被触发多次。第一次函数调用有效
export const throttle = (time = 200) => {
  let isRunning = false;
  return (target: any, name: any, descriptor: any) => {
    const fun = descriptor.value;
    descriptor.value = (...args: any) => {
      if(isRunning) {
        return;
      }
      isRunning = true;
      try {
        fun.apply(this, args);
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        isRunning = false;
      }, time)
    }
  }
}

// 某个时间内，同一个函数被触发多次，最后一次调用有效
export const debounce = (time = 200) => {
  let timer: any;
  return (target: any, name: any, descriptor: any) => {
    const fun = descriptor.value;
    descriptor.value = (...args: any) => {
      try {
        if(timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fun.apply(this, args);
        }, time)
      } catch (error) {
        console.error(error)
      }
    }
     
  }
}

// 用法
// @singleton
// class A {}
export const singleton = (Class: any) => {
  let ins: any = null;
  return (...args: any[]) => {
    if(!ins) { 
      ins = new Class(...args)
    }
    return ins;
  }
}

// 用法
// @singletonWithParam('test') || @singleton()
// class A {}
export const singletonWithParam = (params: any) => {
  return (Class: any) => {
    let ins: any = null;
    return (...args: any[]) => {
      if(!ins) { 
        ins = new Class(...args)
      }
      return ins;
    }
  }
}

// @readonly name = 'hl'
export const readonly = (target: any, name: any, descriptor: any) => {
  descriptor.writeable = false;
  return descriptor;
}



