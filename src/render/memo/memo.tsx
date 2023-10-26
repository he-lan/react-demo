import React, { useEffect, useState, memo } from "react";

const  A = (props: any) => {
  // const [test, testSet] = useState([...new Array(props.obj.num).fill('111')])
  console.time('筛选')
  const test = [...new Array(props.obj.num).fill('111')];
  console.timeEnd('筛选')
  const test1 = 'test1'
  // useEffect(() => {
  //   testSet([...new Array(props.obj.num).fill('111')])

  // }, [props.obj])
  // console.log(props.obj, test, test.length)
  // 
  return <div>{props.obj.num}{test.length}<C  test={test} test1={ test1 } /></div>
}
const C = (props: any) => {
  return (
    <div>C: { props.test } -- {props.test1}</div>
  )
}
const B = memo(() => {
  console.log('B1');
  useEffect(() => {
    console.log('B2');
  })
  return <div>B</div>
})

export const MemoDemo = () => {
  const [obj, objSet] = useState({num: 0});

  const test = () => {
    objSet((val: any) => {
      const tem = {
        num: val.num+1,
      }
      return {...tem};
    })
  }
  // console.log('obj: ', obj)
  return (
    <div>
      <div onClick={() =>test()}>点击</div>
      <A obj={obj} /><B /></div>
  )
}