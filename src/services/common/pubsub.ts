/**
 * 发布订阅服务
 */

interface IPubSub {
  subscribe: (event: string, listener: Function) => void;
  unsubscribe: (event: string, listener: Function) => void;
  publish: (event: string) => void;
}

export class PubSub implements IPubSub {
  private _events = new Map();

  subscribe(event: string, listener: Function) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push(listener);
    return {
      unsubscribe: () => this.unsubscribe(event, listener)
    }
  }

  unsubscribe(event: string, listener: Function) {
    if(!this._events.has(event)) { return; }

    let listeners = this._events.get(event);
    const index = listeners?.indexOf(listener);

    if(index > -1) {
      listeners.splice(index, 1)
    }
  }

  publish(event: string, ...args: any) {
    if(!this._events.has(event)) { return; }
    
    let listeners = this._events.get(event) || [];
    listeners?.forEach((listener: Function) => {
      listener(...args)
    })
  }
}