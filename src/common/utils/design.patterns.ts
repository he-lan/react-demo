class Component {
  private name: any;
  constructor(name: any) {
    this.name = name;
  }
  operation() {
    console.log(`Component ${this.name}: 执行操作`)
  }
  add(component: any) {
    console.log('Component: 不支持的操作')
  }
  remove(component: any) {
    console.log('Component: 不支持的操作')
  }
  getChild(index: number) {
    console.log('Component: 不支持的操作')
  }
}
class Leaf extends Component {
  constructor(name:any) {
    super(name)
  }
}
class Compsite extends Component {
  private children: any;
  constructor(name: any) {
    super(name);
    this.children = [];
  }
  add(component: any) {
    this.children.push(component);
  }
  remove(component: any) {
    const index = this.children.indexOf(component);
    if(index >= 0) {
      this.children.splice(index, 1);
    }
  }
  getChild(index: number): void {
    return this.children[index]
  }
}

class FlyweightFactory {
  private  flyweights: any = {}
  
  getFlyweigh(key: string) {
    if(!this.flyweights[key]) {
      this.flyweights[key] = new ConcreteFlyweight(key)
    }
    return this.flyweights[key]
  }
}

class ConcreteFlyweight {
  private key: string
  constructor(key: string) {
    this.key = key;
  }
  operation() {
    console.log(`concreteFlyweight ${this.key}: 执行操作`)
  }
}

class Strategy {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
  execute() {}
}
class StrategyA extends Strategy {
  excute() {
    console.log('AAA')
  }
}
class StrategyB extends Strategy {
  excute() {
    console.log('BBB')
  }
}

class Context {
  private _strategy: Strategy
  constructor(strategy: Strategy) {
    this._strategy = strategy
  }
  executeStrategy() {
    this._strategy.execute();
  }
}

class Game {
  setup() {}
  start() {
    this.setup();
    this.play();
    this.finish();
  }
  play() {}
  finish() {}
}

class Chess extends Game {
  setup() {
    console.log('setting up chess game');
  }
  play() {
    console.log('playing chess');
  }
  finish() {
    console.log('finishing chess game')
  }
}

class TicTacToe extends Game {
  setup(): void {
    console.log('setting up TicTacToe game')
  }
  play() {
    console.log('playing TicTacToe')
  }
  finish() {
    console.log('finishing TicTacToe')
  }
}

class Subject {
  private _observers: any[] = [];

  attach(observer: any) {
    this._observers.push(observer);
  }
  detach(observer: any) {
    const index = this._observers.indexOf(observer);
    if(index > -1) {
      this._observers.splice(index,1)
    }
  }
  notify() {
    this._observers.forEach(observer => {
      observer.update(this);
    })
  }
}

class Observer {
  update(subject: any) {}
}

class ConcreteSubject extends Subject {
  private _state: any;
  constructor(state: any) {
    super();
    this._state = state;
  }
  set_state(state: any) {
    this._state = state;
    this.notify();
  }
  get_state() {
    return this._state;
  }
}
class ConcreteObserver extends Observer {
  update(subject: any): void {
    console.log('test')
  }
}

class Iterator {
  private items: any;
  private cursor = 0;

  constructor(items: any[]) {
    this.items = items;
    this.cursor = 0;
  }

  has_next() {
    return this.cursor < this.items.length;
  }
  next() {
    const item = this.items[this.cursor];
    this.cursor+=1;
    return item;
  }
}

class Collection {
  private _items: any[];
  constructor() {
    this._items = [];
  }
  add_item(item: any) {
    this._items.push(item);
  }
  iterator() {
    return new Iterator(this._items);
  }
}

class Handler {
  private _nextHandler: any = null;

  setNextHandler(handler: any) {
    this._nextHandler = handler;
  }
  handleRequest(request: any) {
    if(!this._nextHandler) { return null}
    return this._nextHandler.handleRequest(request);
  }
}

class ConcreteHandlerA extends Handler {
  handleRequest(request: any) {
    if(request === 'A') {
      return `handle request ${request}`;
    }
    return super.handleRequest(request);
  }
}

class ConcreteHandlerB extends Handler {
  handleRequest(request: any) {
    if(request === 'B') {
      return `handle request ${request}`;
    }
    return super.handleRequest(request);
  }
}

class ConcreteHandlerC extends Handler {
  handleRequest(request: any) {
    if(request === 'C') {
      return `handle request ${request}`;
    }
    return super.handleRequest(request);
  }
}

class Command {
  public receiver;
  constructor(receiver: any) {
    this.receiver = receiver
  }
  execute() {
    throw new Error('you have to implement the method execute!')
  }
}

class ConcreteCommandA extends Command {
  execute(): void {
    this.receiver.actionA();
  }
}

class ConcreteCommandB extends Command {
  execute(): void {
    this.receiver.actionB();
  }
}

class Receiver {
  actionA () {
    console.log('aaa');
  }
  actionB () {
    console.log('bbb');
  }
}
class  Invoker {
  public commands = new Map();
  
  setCommand(key: string, command: Command) {
    this.commands.set(key, command);
  }
  executeCommand(key: string) {
    const command = this.commands.get(key);
    if(!command) {
      console.log('命令不存在');
      return;
    }
    command.execute();
  }
}

const receiver = new Receiver();
const invoker = new Invoker();

invoker.setCommand('A', new ConcreteCommandA(receiver));
invoker.setCommand('B', new ConcreteCommandB(receiver));

invoker.executeCommand('A');
invoker.executeCommand('B');



export const a = 1;
