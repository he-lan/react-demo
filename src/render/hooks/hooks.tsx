const render = require('react-dom');

export const a = 1;

let memoriedStates: any = [];
let lastIndex = 0;

const useState = (initialState: any) => {
  memoriedStates[lastIndex] = memoriedStates[lastIndex] || initialState;
  const setState = (newState: any) => {
    memoriedStates[lastIndex] = newState;
    render();
  }
  return [memoriedStates[lastIndex], setState];
}

// 实现useEffect
let lastDependencies: any;  
const useEffect = (callback: any, dependencies: any[]) => {
  if(lastDependencies) {
    const isChange = dependencies && dependencies.some((dep, index) => dep !== lastDependencies[index]);
    if(isChange) {
      typeof callback === 'function' && callback();
      lastDependencies = dependencies;
    }
  } else {
    typeof callback === 'function' && callback()
    lastDependencies = dependencies;
  }
}

let lastCallback: any; 
let lastCallbackDependencies: any = [];
const useCallback = (callback: any, dependencies = []) => {
  if(lastCallback) {
    const isChange = dependencies && dependencies.some((dep, index) => dep !== lastCallbackDependencies[index])
    if(isChange) {
      typeof callback === 'function' && callback();
      lastCallbackDependencies = dependencies;
    }
  } else {
    typeof callback === 'function' && callback()
    lastCallbackDependencies = dependencies;
  }

  return lastCallback;
}