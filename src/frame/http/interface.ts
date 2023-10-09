export interface IHttpOptions {
  body?: any,
  headers?: any,
  isFormData?: boolean
}

export interface IInterceptorOptions {
  type: 'GET' | 'POST',
  url: string,
  body?: any,
  headers?: any,
  isFormData?: boolean
}

export interface ICacheConfig {
  dedupingInterval: number, // 缓存时间，删除一段时间内相同 key 的重复请求（以毫秒为单位）
  isRefresh?: number // 是否强制刷新
}

export type RequestInterceptor = (r: IHttpOptions) => IInterceptorOptions;
export type ResponseInterceptor = (r: any, url: string) => any;

export interface IInterceptors {
  request: RequestInterceptor[],
  response: ResponseInterceptor[]
}

export type InterCeptorsType = 'request' | 'response';

export interface ICanCancelHTTP {
  promise: Promise<any>,
  cancel: () => void
}

export interface IBKRequest {
  //拦截器列表
  readonly _interceptors: IInterceptors;

  //get请求
  get(url: string, options?: IHttpOptions): Promise<any>;

  //post请求
  post(url: string, options?: IHttpOptions): Promise<any>;

  //启动运行http, 并在此处通过配置决定是否启用缓存
  startup(key: string, promise: () => Promise<any>, cacheConfig?: ICacheConfig): Promise<any>;

  //可取消请求对象
  shutup(key: string, promise: Promise<any>): ICanCancelHTTP;

  //添加拦截器
  use(middleware: (r: any) => Promise<any>, type: InterCeptorsType): void;

  //打印所有缓存
  log(): void;

  //删除所有缓存
  clear(): void;
}

export type HttpStatus = 'pending' | 'complete' | 'error';

export interface IHttpXHR {
  status: HttpStatus,
  promise: Promise<any>,
  expires: number
}