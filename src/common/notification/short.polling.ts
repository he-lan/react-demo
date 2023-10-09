/* setTimeout 实现setInterval */
type cbFunc = () => Promise<any>
const mySetInterval = (cb: cbFunc, time: number) => {
  let timer: any;
  let stop = false;
  const fn = async () => {
    top = await cb();
    if(stop) { return; } /* 回调函数内部终止循环 */
    timer = setTimeout(fn, time);
  }
  fn();
  return {
    clear() {
      clearTimeout(timer)
    }
  };
}

/**
 * 
 * @param time 短轮询时间间隔
 * @param requestFn http请求及其数据处理
 * @returns 
 */

export const shortPollingNotification = (time: number, requestFn: cbFunc) => {
  let timer: any;
  const subscribe = () => {
    timer = mySetInterval(requestFn, time)
  }
  const unsubscribe = () => {
    timer && timer.clear();
  }
  return {
    subscribe,
    unsubscribe
  }
}



