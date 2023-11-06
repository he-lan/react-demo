/**
 * Web Worker中Promise对象无法直接传递给主线程，因为Promise对象是不可序列话的，
 * 无法进行克隆操作，通过postMessage将Promise对象传递给主线程时，会引发错误
 * http请求的路径需要为绝对路径，相对路径获取不到
 */

const createWorker = (fn: any) => {
  const blob = new Blob([`(function ${fn.toString()})()`]);
  const url = window.URL.createObjectURL(blob);
  const worker = new Worker(url);
  return worker;
};

export default class WebWorkerFetch {
  private worker;
  private requestInterceptor;
  private responseInterceptor;
  constructor({ requestInterceptor, responseInterceptor }: any = {}) {
    this.worker = createWorker(this.workerRegister);
    if (requestInterceptor && typeof requestInterceptor === "function") {
      this.requestInterceptor = requestInterceptor;
    } else {
      this.requestInterceptor = (opt: any) => opt;
      console.error("requestInterceptor must be a function");
    }
    if (responseInterceptor && typeof responseInterceptor === "function") {
      this.responseInterceptor = responseInterceptor;
    } else {
      this.responseInterceptor = (opt: any) => opt;
      console.error("responseInterceptor must be a function");
    }
  }

  private workerRegister() {
    //@ts-ignore
    this.addEventListener(
      "message",
      async function (e: any) {
        const { id, url, option } = e.data;
        try {
          const res = await fetch(url, option);
          const data = await res.json();
          //@ts-ignore
          this.postMessage({
            id,
            status: true,
            data: data
          });
        } catch (e) {
          //@ts-ignore
          this.postMessage({
            id,
            type: false,
            data: e
          });
        }
      },
      false
    );
  }

  fetch(url: string, opt: any) {
    return new Promise((resolve, reject) => {
      const option = this.requestInterceptor(opt);
      const fetchId = new Date() + Math.random().toFixed(5);
      this.worker.postMessage({ id: fetchId, url, ...option });
      this.worker.onmessage = (event) => {
        const { id, data, status } = event.data;
        if (id === fetchId) {
          status ? resolve(this.responseInterceptor(data)) : reject(data);
        }
      };
    });
  }
}

/**
 * const webWorkerFetch = new WebWorkerFetch();
 * webWorkerFetch.fetch('absoluteUrl', {method: 'GET', ...props}).then(res => console.log(res))
 */