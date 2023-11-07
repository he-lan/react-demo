import { BehaviorSubject } from "rxjs";
import { singleton } from "tsyringe";

const HEART_CHECK_TIME = 15 * 1000;           // 心跳检测的默认时间
const HEART_CHECK_DATA = { ping:  'ALIVE' };  // 心跳检测的默认参数，跟后端协商的
const CLOSE_ABNORMAL = 1006;                  // websocket 非正常关闭
const MAX_RECONNECT_TIMES= 100;              // 最大重连次数

@singleton()
export class WebsocketService {
  private url: string;
  private websocket: any;
  private reconnectTimes = 0; //重连次数
  private isReconnectionLoading = false; //是否正在重连中;
  private timeId: any = null; // 延时重连ID
  private errorStack:any = []; //错误消息队列
  private heartCheckInterval: any; 
  private _observer$ = new BehaviorSubject(null);

  constructor(url: string) {
    this.url = url;
  }
  
  create() {
    this.websocket = new WebSocket(this.url);
    this.websocket.onopen = () => {
      this.reconnectTimes = 1;
      this.heartCheck();
      //发送重连之前所发送的失败的消息
      this.errorStack.forEach((message: any) => {
        this.send(message);
      })
      this.errorStack = [];
      this.isReconnectionLoading = false;
    }

    this.websocket.onerror = (err: Event) => {
      this.clearHeartCheck();
      this.reconnection();
      this.clearHeartCheck();
      this.isReconnectionLoading = false;
    }

    this.websocket.onclose = (e: CloseEvent) => {
      this.clearHeartCheck();
      e.code === CLOSE_ABNORMAL && this.reconnection();
      this.isReconnectionLoading = false;
      this.reconnectTimes = 0;
    }

    this.websocket.onmessage = (e: MessageEvent) => {
      this._observer$.next(e.data);
    }
  }

  private reconnection() {
    if(this.isReconnectionLoading || this.reconnectTimes > MAX_RECONNECT_TIMES) { return; }
    this.isReconnectionLoading = true;
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      this.create();
      this.reconnectTimes++
    }, 3000)
  }

  private heartCheck() {
    if(this.heartCheckInterval) { this.clearHeartCheck(); }
    this.heartCheckInterval = setInterval(() => {
      this.send(HEART_CHECK_DATA)
    }, HEART_CHECK_TIME)
  }

  private clearHeartCheck() {
    this.heartCheckInterval && clearInterval(this.heartCheckInterval)
  }

  send(message: any) {
    if(this.websocket && this.websocket.readyState !== 1) {
      this.errorStack.push(message);
      return;
    }
    this.websocket?.send(JSON.stringify(message));
  } 

  close() {
    this.websocket.close();
  }

  start() {
    this.reconnection();
  }
  
  get observer$ () {
    return this._observer$.asObservable();
  }
}

