import React from 'react';
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';
import { add } from 'ella-npm-packs';
import './App.css';


import VirtualListTest from './frame/virtual.list/virtual.list';
import { MemoDemo } from './render/memo/memo';
import { EffectDemo } from './render/effect/effect';
import { LoadMoreDemo } from './render/loadmore.demo/loadmore.demo';

const Home = () => {
  console.log(add(1), add(2))
  
  return (
    <div>
      <h1>路由练习</h1>
      <nav>
        <Link className='link' to='tab1'>Tab1</Link>
        <Link className='link' to='/tab2'>Tab2</Link>
      </nav>
      <Routes>
        <Route path='/tab1' element={<Tab1 />}></Route>
        <Route path='tab2' element={<Tab2 />}></Route>
      </Routes>
    </div>
  )
}
const Tab1 = () => {
  return (
    <div>
      <h2>我是tab1</h2>
    </div>
  )
}
const Tab2 = () => {
  return (
    <div>
      <h2>我是tab2</h2>
    </div>
  )
}

const App = () => {
  return (  
    <BrowserRouter>
      <Routes>
        <Route path='/home/*' element={<Home />}></Route>
        <Route path='/virtual/list/*' element={<VirtualListTest />}></Route>
        <Route path='/memo/demo/*' element={<MemoDemo />}></Route>
        <Route path='/effect/demo/*' element={<EffectDemo />}></Route>
        <Route path='/loadmore/demo/*' element={<LoadMoreDemo />}></Route>

      </Routes>
    </BrowserRouter>
  )
}
export default App;


