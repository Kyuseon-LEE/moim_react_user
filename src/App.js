import React, { useState } from 'react';
import Header from './view/include/Header';
import MainImg from './view/include/MainImg';
import Article from './view/include/Article';
import Article2 from './view/include/Article2';
import SignUp from './view/member/SignUp.jsx';
import GroupCreate from './view/group/GroupCreate';
import GroupHome from './view/group/GroupHome';
import LocalLogin from './view/member/LocalLogin.jsx'
import KakaoLogin from './view/member/KakaoLogin.jsx'
import GoogleLogin from './view/member/GoogleLogin.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [jwt, setJwt] = useState('');  // jwt 상태 관리

  return (
    <BrowserRouter>
      {/* Routes 설정: / 경로에서 Home 컴포넌트를 렌더링 */}
      <Routes>
        <Route path="/" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} />
            <MainImg jwt={jwt} setJwt={setJwt} />
            <Article jwt={jwt} setJwt={setJwt} />
            <Article2 jwt={jwt} setJwt={setJwt} />
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} />
            <SignUp jwt={jwt} setJwt={setJwt} />
          </>
        } />

        <Route path="/create" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} />
            <GroupCreate jwt={jwt} setJwt={setJwt} />
          </>
        } />

        <Route path="/group/:g_no" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} />
            <GroupHome jwt={jwt} setJwt={setJwt} />
          </>
        } />

        <Route path="/login" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} />
            <LocalLogin jwt={jwt} setJwt={setJwt} />
          </>
        } />       

      </Routes>

    </BrowserRouter>
  );
}

export default App;
