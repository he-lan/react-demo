// 快速排序
export const quickSort = (arr: any[], begin: number, end: number) => {
  if(begin > end) {
    return;
  }
  let temp = arr[begin];
  let i = begin;
  let j = end;
  while(i !== j) {
    while(arr[j] >= temp && j > i) {
      j--;
    }
    while(arr[i] <= temp && j > i) {
      i++;
    }
    if(j > i) {
      let t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
  }
  arr[begin] = arr[i];
  arr[i] = temp;
  quickSort(arr, begin, i - 1);
  quickSort(arr, i + 1, end);
}

//冒泡排序 两个相邻的相互比较，每轮结尾总是最大值
export const bubbleSortTest = (arr: number[]): number[] => {
  let temp;
  for(let i = 0; i < arr.length - 1; i++) {
    for(let j = 0; j < arr.length - i - 1; j++) {
      if(arr[j] > arr[j + 1]) {
        temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

//选择排序 每轮比较选出最大或者最小值
export const selectionSort = (arr: number[]): number[] => {
  let temp;
  for(let i = 0; i < arr.length; i++) {
    for(let j = i + 1; j < arr.length; j++) {
      if(arr[i] > arr[j]) {
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}



/**
 * 业务知识点
 * 区块链
 * 去中心化
 * 公钥私钥
 */

/**
 * 缓存知识点：
 * 存储：sessionStorage, localStorage, indexDB, cookie
 * 浏览器缓存：（协商缓存，强制缓存，cdn, qingniu, service worker...）
 * http请求缓存
 */

/**
 * sessionStorage和localStorage共同点：存储字符串类型数据；存储空间5M
 * sessionStorage：关闭标签页清楚数据； 不可跨页面通讯（iframe同源除外）
 * localStorage: 需要手动清楚数据； 可跨页面通讯（同源可读取并修改）
 * cookie: 有效期可设置，默认关闭浏览器失效； 存储空间4K; 可与服务器通讯
 */

/**
 * 强缓存：
 * expires: 设置过期时间，与本地时间比较，本地时间可能不准，所以这个字段已经废弃
 * cache-control: no-cache -> 协商缓存 no-store -> 禁止缓存 max-age -> 缓存时间
 * 协商缓存：
 * 1，读取文件修改时间，2.将该修改时间赋给last-modified,3.设置cache-control: no-cache，4.再次请求携带if-modified-since(last-modified的数据)比较，若未修改，则304，否则重新请求
 */

/**
 * server-worker可以WebpackManifestPlugin搭配使用，在打包时生成缓存文件
 */


/**
 * 单例模式
 * 发布订阅模式
 * 观察者模式
 * 依赖注入IOC
 */

/**
 * react知识点
 * useEffect和useLayoutEffect区别
 */

/**
 * 组件
 * 虚拟列表（固定高度，动态高度）
 */

/**
 * websocket
 * web worker
 */

