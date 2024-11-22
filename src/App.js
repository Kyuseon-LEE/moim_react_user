import React from 'react';
import Header from './view/include/Header';
import MainImg from './view/include/MainImg';
import Article from './view/include/Article';
import Article2 from './view/include/Article2';
import Article2 from './view/include/Article2.jsx';
import SignUp from './view/member/SignUp.jsx';
import LocalLogin from './view/member/LocalLogin.jsx'
import KakaoLogin from './view/member/KakaoLogin.jsx'
import GoogleLogin from './view/member/GoogleLogin.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    {/* Routes 설정: / 경로에서 Home 컴포넌트를 렌더링 */}
    <Routes>
      <Route path="/" element={
        <>
          <Header />
          <MainImg />
          <Article />
          <Article2 />
        </>
      } />
      <Route path="/signup" element={
        <>
        <Header />
        <SignUp />
        </>
      }></Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
