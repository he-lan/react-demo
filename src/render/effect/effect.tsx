import React, { useState, useEffect } from "react";

export const EffectDemo = () => {
  const [ count, countSet ] = useState(0);
  const [ person, personSet ] = useState({name: 'hl', age: 27});
  const [ array, arraySet ] = useState([1,2,3]);

  useEffect(() => {
    console.log('Component re-render by count')
  }, [count])

  useEffect(() => {
    console.log('Component re-render by person')
  }, [person])
  // 
  console.log(array)
  useEffect(() => {
    console.log('Component re-render by array')
  }, [array])
  const change = () => {
    arraySet((res: any) => {
      res[0] = 9;
      return res;
    })
  }
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => countSet(1)}>Update Count</button>
      <button onClick={() => personSet({ name: 'Bob', age: 30 })}>Update Person</button>
      <button onClick={() => change() }>Update Array</button>
    </div>
  );
}