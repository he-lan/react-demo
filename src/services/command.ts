import { InjectionToken, singleton, container } from "tsyringe";

/** 
 * 命令模式 
 * 优点：
 * 该模式将请求调用者和请求接收者解耦，互不影响
 * 命令模式强调行为，可以将一些特定的事情封装成指令对象，方便调用
 * 结构：
 * 抽象命令类（Command）角色：声明执行命令的接口，拥有执行命令的抽象方法 exe()。
 * 具体命令角色（ConcreteCommand）角色：是抽象命令类的具体实现类，它拥有接收者对象，并通过调用接收者的功能来完成命令要执行的操作。
 * 实现者/接收者（Receiver）角色：执行命令功能的相关操作，是具体命令对象业务的真正实现者。
 * 调用者/请求者（Invoker）角色：是请求的发送者，它通常拥有很多的命令对象，并通过访问命令对象来执行相关请求，它不直接访问接收者。
*/

export interface ICommand {
  readonly name: string;
  exe(...args: any): void;
}

interface ICommandManagerService {
  readonly commands: Map<string, ICommand>;
  register(name: string, Command: InjectionToken<ICommand>): void;
  exe(name: string): void;
}

@singleton()
export class CommandManager implements ICommandManagerService{
  readonly commands: Map<string, ICommand> = new Map();

  register(name: string, Command: InjectionToken<ICommand>) {
    let tempCommand: ICommand | null = container.resolve(Command);
    if(this.commands.has(name)) {
      console.warn('命令已经存在');
      return;
    }
    if(!tempCommand) {
      throw new Error('命令创建失败');
    }
    this.commands.set(name, tempCommand);
  }

  exe(name: string, ...args: any) {
    if(!this.commands.has(name)) {
      throw new Error('命令未注册');
    }
    this.commands.get(name)?.exe(...args);
  }
}


// class Commands {
//   static readonly SHOW_ACCOUNT_DIALOG = 'show account dialog';
//   static readonly SHOW_SAFETY_TIPS = 'show safety tips';
// }

// class AccountDialogCommand implements ICommand {
//   readonly name = Commands.SHOW_ACCOUNT_DIALOG;
//   open(...args: any) {}
//   close(...args: any) {}
//   exe(action: 'open' | 'close', ...args: any) {
//     this[action](...args);
//   }
// }
// class SafetyTipsCommand implements ICommand {
//   readonly name = Commands.SHOW_SAFETY_TIPS;
//   open(...args: any) {}
//   close(...args: any) {}
//   exe(action: 'open' | 'close', ...args: any) {
//     this[action](...args);
//   }
// }

// const commandManager = container.resolve(CommandManager);

// commandManager.register(Commands.SHOW_ACCOUNT_DIALOG, AccountDialogCommand);
// commandManager.register(Commands.SHOW_SAFETY_TIPS, SafetyTipsCommand);

// commandManager.exe(Commands.SHOW_ACCOUNT_DIALOG, 'open', {})
