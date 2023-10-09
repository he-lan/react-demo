import LZString from 'lz-string';
import { Observable, Observer } from 'rxjs';
import { singleton, container } from 'tsyringe';
import { Storage } from '../storage';

/* http请求未返回结果时先取缓存数据，请求结束后再更新 */

@singleton()
class BKCacheRequest {
  private _storage = new Storage();

  request(key: string, promise: Promise<any>): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      const cache = this._storage.get(key);
      if(cache) {
        const decompress = LZString.decompress(cache);
        const isString = typeof decompress === 'string';
        const response = isString ? JSON.parse(decompress) : decompress;
        observer.next(response);
      }
      promise.then((response: any) => {
        observer.next(response);
        const compressJSON = LZString.compress(JSON.stringify(response));
        this._storage.set('bkcacheRequest.' + key, compressJSON);
        observer.complete();
      })
    })
  }
}

const cacheRequest = container.resolve(BKCacheRequest);

export const bkcacheRequest = (key: string, promise: Promise<any>) => cacheRequest.request(key, promise);