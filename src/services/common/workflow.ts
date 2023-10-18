/**
 * 工作流监控服务: 主要用来监控服务内部的工作状态
 */
import { BehaviorSubject } from "rxjs";
import { injectable } from "tsyringe";

interface IFlowState {
  code: 'init' | 'success' | 'fail' | 'running',
  state: any
}

@injectable()
export class WorkFlowService {
  private _clearTimer: any = null;
  private _stream$ = new BehaviorSubject<IFlowState>({code: 'init', state: null});
  public stream$ = this._stream$.asObservable();

  start(state?: any) {
    clearTimeout(this._clearTimer)
    this._stream$.next({
      code: 'running',
      state
    })
  }

  success(state?: any) {
    clearTimeout(this._clearTimer)
    this._stream$.next({
      code: 'success',
      state
    })
  }

  fail(state?: any) {
    clearTimeout(this._clearTimer);
    this._stream$.next({
      code: 'fail',
      state
    })
  }

  reset() {
    clearTimeout(this._clearTimer);
    this._clearTimer = setTimeout(() => {
      this._stream$.next({
        code: 'init',
        state: null
      })
    })
  }
}