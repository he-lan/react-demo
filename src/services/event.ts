
/**
 * 发布订阅
 */

interface IEventType {
  type: 'string',
  message?: any,
  target?: any
}

export class Event {
  private _listeners: Record<string, any[]> = {};

  addEventListener(type: string, listener: (event: IEventType) => void) {
    if(!this._listeners[type]) {
      this._listeners[type] = [];
    }
    if(this._listeners[type].indexOf(listener) === -1) {
      this._listeners[type].push(listener);
    }
    return {
      remove: () => {
        this.remove(type, listener)
      }
    }
  }

  has(type: string, listener: (event: IEventType) => void) {
    if(!this._listeners[type]) {
      return false;
    }
    return this._listeners[type].indexOf(listener) > -1;
  }

  remove(type: string, listener: (event: IEventType) => void) {
    if(!this._listeners[type]) return;
    
    const index = this._listeners[type].indexOf(listener);

    if(index > -1) {
      this._listeners[type].splice(index, 1)
    }
  }

  dispatch(type: string, event: IEventType) {
    if(!this._listeners[type]) {
      return
    }
    this._listeners[type].forEach((cb: Function) => {
      cb(event);
    })
  }
}