import { container, singleton } from 'tsyringe';

@singleton()
class RefreshManagerService {
  private _tasks: Record<string, () => Promise<any>> = {};

  add(key: string, task: () => Promise<any>) {
    this._tasks[key] = task;
  }

  refresh() {
    const promises = [...Object.values(this._tasks)].map(func => func())
    return Promise.all(promises)
  }

  delete(key: string) {
    delete this._tasks[key];
  }

	clear(){
		this._tasks = {};
	}
}

export const refreshManagerServiceFactory = () => {
  return container.resolve(RefreshManagerService);
}
