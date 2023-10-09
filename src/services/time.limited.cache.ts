/** 带时间限制的缓存 */
export class TimeLimitedCache {
  public map: Map<string, any>;
  constructor() {
    this.map = new Map();
  }
  set(key: string, value: any, duration: number): void {
    const has = this.map.has(key);
    const isExpires = has && this.map.get(key).expires < Date.now();

    if(!has || isExpires) {
      const expires = Date.now() + duration;
      this.map.set(key, {
        value, 
        expires
      })
    }
  }

  get(key: string): any {
    const has = this.map.has(key);
    const isExpires = has && this.map.get(key).expires < Date.now();
    if(isExpires) {
      this.map.delete(key);
      return;
    }
    return this.map.get(key);
  }

  delete(key: string): void {
    this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }
}

