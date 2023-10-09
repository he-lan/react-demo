import React, { createContext, useContext, useReducer, useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";

const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee'
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222'
  }
}

const ThemeContext = createContext(themes.light);

const Test = () => {
  return (
    <ThemeContext.Provider value={ themes.dark }>
      <ToolBar />
    </ThemeContext.Provider>
  )
}

const ToolBar = (props: any) => {
  return (
    <ThemeButton />
  )
}

const ThemeButton = () => {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}> I am styled by theme context! </button>
  )
}

const initialState = { count: 0 };

const reducer = (state: any, action: any) => {
  switch(action.type) {
    case 'increment': 
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}
const Counter = () => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  return (
    <>
      Count: { state.count }
      <button onClick={ () => dispatch({type: 'decrement'}) }> - </button>
      <button onClick={ () => dispatch({type: 'increment'}) } ></button>
    </>
  )
}

const init = (initialCount: any) => {
  return { count: initialCount };
}
const reducer1 = (state: any, action: any) => {
  switch(action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}
const Counter2 = (initialCount: any) => {
  const [ state, dispatch ] = useReducer(reducer1, initialCount, init);
  return (
    <>
      Count: { state.count }
      <button onClick={() => dispatch({type: 'reset', payload: initialCount})}> Reset </button>
      <button onClick={() => dispatch({type: 'decrement'})}> - </button>
      <button onClick={() => dispatch({type: 'increment'})}> + </button>
    </>
  )
}

const Hook = () => {
  const [ count, setCount ] = useState(0);
  const btnRef = useRef<any>(null);

  useEffect(() => {
    console.log('use effect...');
    const onClick = () => {
      setCount(count + 1);
    }
    btnRef.current.addEventListener('click', onClick, false);
    return () => {
      btnRef.current.removeEventListener('click', onClick, false);
    }
  }, [])
  return (
    <div>
      <div>
        { count }
        <button ref={btnRef}> click me </button>
      </div>
    </div>
  )
}

const FancyInput = (props: any, ref: any) => {
  const inputRef = useRef<any>();
  useImperativeHandle(ref, () => {
    focus: () => {
      inputRef.current.focus();
    }
  })
  return <input type="text" ref={ inputRef } />
}
const Fancy = forwardRef(FancyInput);

const useWindowSize = () => {
  const [ width, setWidth ] = useState<any>();
  const [ height, setHeight ] = useState<any>();

  useEffect(() => {
    const { clientWidth, clientHeight } = document.documentElement;
    setWidth(clientWidth);
    setHeight(clientHeight);
  }, [])
  
  useEffect(() => {
    const handWindowSize = () => {
      const { clientWidth, clientHeight } = document.documentElement;
      setWidth(clientWidth);
      setHeight(clientHeight);
    }
    window.addEventListener('resize', handWindowSize, false);
    return () => {
      window.removeEventListener('resize', handWindowSize, false);
    }
  }, [])
  return [ width, height ];
}