// 快速排序
export const quickSort = (arr: any[], begin: number, end: number) => {
  if(begin > end) {
    return;
  }
  let temp = arr[begin];
  let i = begin;
  let j = end;
  while(i !== j) {
    while(arr[j] >= temp && j > i) {
      j--;
    }
    while(arr[i] <= temp && j > i) {
      i++;
    }
    if(j > i) {
      let t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
  }
  arr[begin] = arr[i];
  arr[i] = temp;
  quickSort(arr, begin, i - 1);
  quickSort(arr, i + 1, end);
}

//冒泡排序
export const bubbleSort = (arr: any[]) => {
  let temp;
  for(let i = 0; i < arr.length; i ++) {
    for(let j = 0; j < arr.length - 1 - i; j++) {
      if(arr[j] > arr[j + 1]){
        temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}
