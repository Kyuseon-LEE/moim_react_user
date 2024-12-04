import React, { useState } from 'react';
import Header from './view/include/Header';
import MainImg from './view/include/MainImg';
import Article from './view/include/Article';
import Article2 from './view/include/Article2';
import SignUp from './view/member/SignUp.jsx';
import GroupCreate from './view/group/GroupCreate';
import GroupHome from './view/group/GroupHome';
import GroupPost from './view/group/GroupPost';
import LocalLogin from './view/member/LocalLogin.jsx'
import Profile from './view/profile/Profile.jsx'
import SignupSuccess from './view/member/SignupSuccess.jsx';
import Credit from './view/profile/Credit.jsx';
import Paysuccess from './view/profile/Paysuccess.jsx';
import Payfail from './view/profile/Payfail.jsx';
import SocialLogin from './view/member/SocialLogin.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  const CLIENT_ID = '378518007722-pt147i1dec56ncndfmlvi9q6hppqnkaf.apps.googleusercontent.com'

  const [jwt, setJwt] = useState('');  // jwt 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(!!jwt);
  const [userInfo, setUserInfo] = useState(null); //social

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
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

        <Route path="/signup_success" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <SignupSuccess jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
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
        <Route path="/group/:g_no/posts/:m_no" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <GroupPost jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </>
        } />

        <Route path="/login" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} userInfo={userInfo}/>
            <LocalLogin jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} userInfo={userInfo}/>
          </>
        } />       

        <Route path="/profile" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Profile jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
        <Route path="/credit" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Credit jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
          <Route path="/pay_success" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Paysuccess jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
          <Route path="/pay_fail" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Payfail jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
          <Route path="/social_login" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <SocialLogin jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userInfo={userInfo}/>
          </>
        } />
        

      </Routes>

    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
