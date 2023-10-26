export const i18nTool = function(input: string, vars={}) {
  if (!input) { return ''; }

  const tokens:any = [];
  let isStart = false;
  let varname = '';

  // 语法解析
  for (let i = 0; i < input.length; i++) {
    let currentChar = input[i];
    let nextChar = input[i + 1];
    if (currentChar === '{' && nextChar === '{') {
      isStart = true;
      i = i + 1;
    } else if (currentChar === '}' && nextChar === '}') {
      isStart = false;
      i = i + 1;
      tokens.push({
        name: 'variable',
        value: varname
      });
      varname = '';
    } else if (isStart) {
      varname += currentChar;
    } else {
      tokens.push({
        name: 'string',
        value: currentChar
      });
    }
  }

  // 拼接结果
  let result = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.name === 'string') {
      result += token.value;
    } else if (token.name === 'variable') {
      // @ts-ignore
      result += vars[token.value] || '';
    }
  }
  return result;
}

export const isType = (val: any, type: any) => {
  return Object.prototype.toString.call(val) === '[object ' + type + ']';
}

export const isNumber = (val: any) => {
  return isType(val, 'Number');
}

export const isString = (val: any) => {
  return isType(val, 'String');
}

export const isUndefined = (val: any) => {
  return isType(val, 'Undefined');
}

export const isNull = (val: any) => {
  return isType(val, 'Null');
}

export const isObject = (val: any) => {
  return isType(val, 'Object');
}

export const isArray = (val: any) => {
  return isType(val, 'Array');
}

// null undefined [] {} ''
export const isEmpty = (val: any) => {
  if (isNull(val)) {
    return true;
  }
  if(isUndefined(val)) {
    return true;
  }
  if (isArray(val)) {
    return val.length <= 0;
  }
  if (isString(val)) {
    return val.replace(/\s/g, '') === '';
  }
  if (isObject(val)) {
    return Object.keys(val).length <= 0;
  }
}

export const chunk = (arr: any[], size: number): any[] => {
  const length = Math.ceil(arr.length / size);
  const newArr = [];
  for(let i = 0; i <= length; i++) {
      newArr[i] = arr.slice(i * size, (i+1) * size);
  }
  return newArr;
}

export const groupBy = (arr: any[], fn: Function) => {
  const res: Record<string, any> = {};
  for(let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = fn(item);
    if(!res[key]) {
      res[key] = [];
    }
    res[key].push(item)
  }
  return res;
}

/* 根据id合并数组 */
export const join = (arr1: any[], arr2: any[]) => {
  const arr = [...arr1, ...arr2];
  const map = new Map();
  arr.forEach(item => {
    if(map.has(item.id)) {
      map.set(item.id, Object.assign(map.get(item.id), item))
    } else {
      map.set(item.id, item)
    }
  })
  //@ts-ignore
  return [...map.values()]
}

export const flat = (arr: any[], n: number): any[] => {
  if(n <= 0) {
    return arr;
  }
  const result: any = [];
 
  arr.forEach((item) => {
    if(Array.isArray(item)) {
      result.push(item);
    } else {
      flat(item, n - 1);
    }
  })
  return result;
}

// 柯里化函数
export const curry = (fn: Function, ...args:any) => {
  let length = fn.length;
  return (...args2: any) => {
    let newArgs = args.concat(...args2);
    if(newArgs.length < length) {
      return curry.call(this, fn, newArgs);
    } else {
      return fn.apply(this, newArgs)
    }
  }
}


