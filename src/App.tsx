import React from 'react';
import { BrowserRouter ,Routes, Route } from 'react-router-dom';
import './App.css';


import { VirtualListDemo } from './render/virtual.list.demo/virtual.list.demo';
import { MemoDemo } from './render/memo/memo';
import { EffectDemo } from './render/effect/effect';
import { LoadMoreDemo } from './render/loadmore.demo/loadmore.demo';

const App = () => {
  return (  
    <BrowserRouter>
      <Routes>
        <Route path='/virtual/list/*' element={<VirtualListDemo />}></Route>
        <Route path='/memo/*' element={<MemoDemo />}></Route>
        <Route path='/effect/*' element={<EffectDemo />}></Route>
        <Route path='/loadmore/*' element={<LoadMoreDemo />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;


