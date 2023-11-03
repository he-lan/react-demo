/**
 * 二分查找，数组有序，且不存在重复
 * @param {array} arr 排序数组
 * @param {number} target 目标数据
 */
export const binarySearch = (arr: Array<number>, target: number): number => {
  if(arr.length <= 1) {
    return arr.length === 0 ? -1 : arr[0] === target ? 0 : -1;
  }
  let start = 0;
  let end = arr.length - 1;
  while(start <= end) {
    const midIndex = Math.floor((start + end) / 2);
    const midValue = arr[midIndex];
    if(target < midValue) {
      end = midIndex - 1;
    } else if(target > midValue) {
      start = midIndex + 1;
    } else {
      return midIndex
    }
  }
  return -1;
} 

/**
 * 二分查找 数组有序，且不重复，查找比目标数据大或者小的相邻数据
 * @param {array} arr 排序数组
 * @param {number} target 目标数据
 */
export const binarySearchAdjacent = (arr: Array<number>, target: number): number => {
  if(arr.length <= 1) {
    return 0;
  }
  let start = 0;
  let end = arr.length - 1; 
  let midIndex = 0;
  while(start <= end) {
    midIndex = Math.floor((start + end) / 2);
    const midValue = arr[midIndex];
    if(target < midValue) {
      end = midIndex - 1;
    } else if(target > midValue) {
      start = midIndex + 1;
    } else {
      return midIndex
    }
  }
  return midIndex;
}

/**
 * 二分查找，数组有序且存在重复，查找第一个值等于给定的元素
 * @param {array} arr 排序数组
 * @param {number} target 目标数据
 */
export const BinarySearchFirst = (arr: Array<number>, target: number): number => {
  if(arr.length <= 1) {
    return arr.length === 0 ? -1 : arr[0] === target ? 0 : -1;
  }
  let start = 0;
  let end = arr.length - 1;
  while(start <= end) {
    const midIndex = Math.floor((start + end) / 2);
    const midValue = arr[midIndex];
    const preMidValue = arr[midIndex - 1];
    if (target < midValue) {
      end = midIndex - 1;
    } else if (target > midValue) {
      start = midIndex + 1;
    } else {
      // 当target 与 midValue相等的时候，如果midIndex 为0或者前一个数比target小，那么就找到了第一个给定的元素，直接返回
      if (midIndex === 0 || preMidValue < target) {
        return midIndex;
      }
      // preMid >= target, 继续向前找等于target的值
      end = midIndex - 1;
    }
  }
  return -1;
}

/**
 * 二分查找，数组有序且重复，查找最后一个值等于给定值的元素
 * @param {array} arr 排序数组
 * @param {number} target 目标数据
 */

export const binarySearchLast = (arr: Array<number>, target: number): number => {
  if(arr.length <= 1) {
    return arr.length === 0 ? -1 : arr[0] === target ? 0 : -1;
  }
  let start = 0;
  let end = arr.length - 1;
  while(start <= end) {
    const midIndex = Math.floor((start + end) / 2);
    const midValue = arr[midIndex];
    const lastMidValue = arr[midIndex + 1];
    if(target < midValue) {
      end = midIndex - 1;
    } else if (target > midValue) {
      start = midIndex + 1;
    } else {
      if(midIndex === 0 || lastMidValue !== target) {
        return midIndex;
      }
      start = midIndex + 1;
    }
  }
  return -1;
}

/**
 * 二分查找，数组有序且重复，查找第一个大于等于给定的值
 * @param {array} arr 排序数组
 * @param {array} target 目标数据
 */

export const binarySearchFirstBig = (arr: Array<number>, target: number): number => {
  if(arr.length <= 1) {
    return arr.length === 0 ? -1 : arr[0] === target ? 0 : -1;
  }
  let start = 0;
  let end = arr.length - 1;
  while(start <= end) {
    const midIndex = Math.floor((start + end) / 2);
    const midValue = arr[midIndex];
    const preMidValue = arr[midIndex - 1];
    if(midValue >= target) {
      if(midIndex === 0 || preMidValue < target) {
        return midIndex;
      }
      end = midIndex - 1;
    } else {
      start = midIndex + 1;
    }
  }
  return -1;
}

/**
 * 二分查找， 数组有序且重复，查找最后一个小于等于给定的值
 * @param {array} arr 排序数组
 * @param {number} target 目标数据
 */
export const binarySearchLastBig = (arr: Array<number>, target: number): number => {
  if(arr.length <= 1) {
    return arr.length === 0 ? -1 : arr[0] === target ? 0 : -1;
  }
  let start = 0;
  let end = arr.length - 1;
  while(start <= end) {
    const midIndex = Math.floor((start + end) / 2);
    const midValue = arr[midIndex];
    const lastMidValue = arr[midIndex + 1];
    if(midValue <= target) {
      if(midIndex === 0 || lastMidValue > target) {
        return midIndex;
      }
      start = midIndex + 1;
    } else {
      end = midIndex - 1;
    }
  }
  return -1;
}
