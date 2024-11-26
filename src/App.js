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
import Profile from './view/profile/Profile.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [jwt, setJwt] = useState('');  // jwt 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(!!jwt);

  return (
    <BrowserRouter>
      {/* Routes 설정: / 경로에서 Home 컴포넌트를 렌더링 */}
      <Routes>
        <Route path="/" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <MainImg jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            {isLoggedIn && (
                <Article
                  jwt={jwt}
                  setJwt={setJwt}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )}
            <Article2 jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <SignUp jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />

        <Route path="/create" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <GroupCreate jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />

        <Route path="/group/:g_no" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <GroupHome jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </>
        } />

        <Route path="/login" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <LocalLogin jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />       

        <Route path="/profile" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Profile jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />

        

      </Routes>

    </BrowserRouter>
  );
}

export default App;
