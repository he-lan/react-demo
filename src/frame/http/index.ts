import { singleton, container } from 'tsyringe';

import { 
  IInterceptorOptions,
  IInterceptors, 
  InterCeptorsType,
  IHttpXHR, 
  IBKRequest,
  IHttpOptions,
  ICacheConfig
} from "./interface"


class HTTPStatusManager {
  private _cache = new Map<string, IHttpXHR>();

  set(uuid: string, cache: IHttpXHR) {
    this._cache.set(uuid, cache);
  }

  get(uuid: string): IHttpXHR | undefined {
    return this._cache.get(uuid);
  }

  delete(uuid: string): void {
    this._cache.delete(uuid);
  }

  clear(): void {
    this._cache.clear();
  }
  
  
  log() {
    const items = new Map<string, IHttpXHR>();
    const itemsParsed = new Map<string, IHttpXHR>();

    this._cache.forEach((value, key) => {
      items.set(key, value);
      itemsParsed.set(key, value);
    });

    console.group(`HTTPStatusManager Storage`);
    let globalValues: { key: string, value: IHttpXHR }[] = [];
    items.forEach((value, key) => {
      globalValues.push({ key, value });
    });
    console.table(globalValues);
    console.groupEnd();

    console.log(itemsParsed);
  }
}

/**
 * http请求类
 * get请求，可以配置http请求缓存，在缓存有效时间内，不会多次发起http请求
 * @class BKRequest
 * @implements {IBKRequest}
 */
@singleton()
class BKRequest implements IBKRequest {
  readonly _interceptors: IInterceptors = {
    request: [],
    response: []
  }

  constructor(
    private httpStatusManager: HTTPStatusManager
  ) {}

  private requestInterceptor(config: IInterceptorOptions) {
    const requestInterceptor = this._interceptors.request;

    requestInterceptor.forEach(interceptor => {
      config = interceptor(config);
    })

    return config;
  }

  private responseInterceptor(r: any, url: string) {
    const responseInterceptor = this._interceptors.response;

    responseInterceptor.forEach(interceptor => {
      r = interceptor(r, url);
    })

    return r;
  }

  private ajax(type: 'GET' | 'POST', url: string, options: IHttpOptions ={}): Promise<any> {
    const { headers = {}, body ={} } = options;
    const config = this.requestInterceptor({
      type, 
      url,
      headers: Object.assign({}, headers),
      body
    })
    //上传FormData数据时，浏览器会自动生成Content-Type,因此不能设置Content-Type参数, 且不要将body转为string类型
    body instanceof FormData && delete config.headers['Content-Type']

    return fetch(url, {
      method: type,
      headers: config.headers,
      body: typeof body === 'object' && !(body instanceof FormData) ? JSON.stringify(config.body) : config.body
    })
    .then(r => {
      if([404, 403, 500, 501, 502, 503].indexOf(r.status) >= 0) {
        return Promise.reject({
          status: r.status,
          message: `Network error: ${r.statusText}(${r.status})`
        });
      } else {
        return r.json();
      }
    })
    .then(r => this.responseInterceptor(r, url))
    .catch(error => {
      if(error && error instanceof ProgressEvent) {
        const lang = window.document.querySelector('html')?.getAttribute('lang') as 'en' | 'zh' | 'zh-tw';
        const isChinese = lang.indexOf('zh') >= 0;
        const msg = isChinese ? '网络异常：您可以切换网络节点后再次尝试！' : 'Network error: Please switch to a different network provider and try again.'
        return Promise.reject(msg);      
      }
      return Promise.reject(error);
    })
  }

  get(url: string, options: IHttpOptions = {}): Promise<any> {
    return this.ajax('GET', url, options);
  }

  post(url: string, options: IHttpOptions = {}): Promise<any> {
    return this.ajax('POST', url, options);
  }

  //tip: 这里的终止请求并不会实际上取消请求，只是阻止了promise的后续then不会执行
  shutup(key: string, promise: Promise<any>) {
    let cancel = () => {};
    
    const abort = new Promise(function(_, _abort) {
      cancel = () => {
        _abort(`request "${key}" had aborted`);
      }
    })

    return {
      promise: Promise.race([promise, abort]),
      cancel
    }
  }

  startup(key: string, promise: () => Promise<any>, cacheConfig?: ICacheConfig): Promise<any> {
    let httpXHR = this.httpStatusManager.get(key);
    const nowTime = new Date().getTime();
    const { dedupingInterval = 2000, isRefresh = 1 } = cacheConfig || { dedupingInterval: 2000 };

    //如果强制刷新，则删除缓存
    if(isRefresh) {
      this.httpStatusManager.delete(key);
    }
    //如果请求缓存已经过期，则删除缓存
    if(httpXHR && (httpXHR.status === 'complete' && httpXHR.expires < nowTime)) {
      this.httpStatusManager.delete(key)
    }

    if(httpXHR && 
        (httpXHR.status === 'pending' ||  // 请求中
        httpXHR.status === 'complete' && httpXHR.expires >= nowTime ) // 请求已经完成并在有效期
      ) {
        return httpXHR.promise;
      }

    const promiseFn = promise();
    this.httpStatusManager.set(key, {
      status: 'pending',
      promise: promiseFn,
      expires: nowTime + dedupingInterval
    });

    return promiseFn.then(r => {
      this.httpStatusManager.set(key, {
        status: 'complete',
        promise:  Promise.resolve(r),
        expires: nowTime + dedupingInterval
      })
      return r;
    })
    .catch(error => {
      this.httpStatusManager.set(key, {
        status: 'error',
        promise: Promise.resolve(error),
        expires: nowTime
      })
      return Promise.reject(error)
    })
  }

  deleteCache(key: string) {
    this.httpStatusManager.delete(key);
  }

  use(middleware: (r: any) => any, type: InterCeptorsType) {
    const funName = middleware.name;
    if(!funName) {
      console.error('拦截器请不要使用匿名函数（函数名可以用来避免重复添加）');
      return;
    }
    const isHad = this._interceptors[type].findIndex((f: Function) => f.name === funName) > -1;
    !isHad && this._interceptors[type].push(middleware);
  }

  log() {
    this.httpStatusManager.log();
  }

  clear() {
    this.httpStatusManager.clear();
  }
}

const bkRequest = container.resolve(BKRequest);

export const get = (url: string, options = {}) => bkRequest.get(url, options);

export const post = (url: string, options = {}) => bkRequest.post(url, options);

export const startupHttp = (key: string, promise: () => Promise<any>, options?: ICacheConfig) => bkRequest.startup(key, promise, options);

export const shutupHttp = (key: string, promise: Promise<any>) => bkRequest.shutup(key, promise);

export const deleteHttpCache = (key: string) => bkRequest.deleteCache(key);

export const addMiddlewareForHTTP = (middleware: (r: any) => any, type: InterCeptorsType) => bkRequest.use(middleware, type)

export const logHTTPCache = () => bkRequest.log();

export const clearHTTPCache = () => bkRequest.clear();