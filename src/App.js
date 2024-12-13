import React, { useState } from 'react';
import Header from './view/include/Header';
import MainImg from './view/include/MainImg';
import SearchResults from './view/search/SearchResults';
import Article from './view/include/Article';
import Article2 from './view/include/Article2';
import Footer from './view/include/Footer.jsx';
import SignUp from './view/member/SignUp.jsx';
import GroupCreate from './view/group/GroupCreate';
import GroupHome from './view/group/GroupHome';
import GroupAll from './view/group/GroupAll';
import LocalLogin from './view/member/LocalLogin.jsx'
import Profile from './view/profile/Profile.jsx'
import SignupSuccess from './view/member/SignupSuccess.jsx';
import Credit from './view/profile/Credit.jsx';
import Paysuccess from './view/profile/Paysuccess.jsx';
import Payfail from './view/profile/Payfail.jsx';
import SocialLogin from './view/member/SocialLogin.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import QRLogin from './view/profile/QrLogin.jsx';
import Membership from './view/profile/Membership.jsx';
import MobileLoginConfirm from './view/profile/MobileLoginConfirm.jsx';
import FindId from './view/member/FindId.jsx';
import Nav from './view/profile/Nav.jsx';
import FindIdConfirm from './view/member/FindIdConfirm.jsx';
import FindPw from './view/member/FindPw.jsx';
import FindPwConfirm from './view/member/FindPwConfirm.jsx';
import PreviousPassword from './view/profile/PreviousPassword.jsx';
import ChangePassword from './view/profile/ChangePassword.jsx';
import MyGroupList from './view/profile/MyGroupList.jsx';
import AnnouncementList from "./view/announcement/AnnouncementList";
import AnnouncementDetail from "./view/announcement/AnnouncementDetail";
import CustomerHome from "./view/customer/CustomerHome";
import ContactUs from "./view/customer/ContactUs";
import Faq from "./view/customer/Faq";
import ContactUsList from "./view/customer/ContactUsList";

function App() {

  const CLIENT_ID = '378518007722-pt147i1dec56ncndfmlvi9q6hppqnkaf.apps.googleusercontent.com'

  const [jwt, setJwt] = useState('');  // jwt 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(!!jwt);
  const [userInfo, setUserInfo] = useState(null); //social
  const [memberInfo, setMemberInfo] = useState(null);

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
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
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

        <Route path="/search" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <SearchResults jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
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
        <Route path="/group/all" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <GroupAll jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />

        <Route path="/login" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} userInfo={userInfo}/>
            <LocalLogin jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} userInfo={userInfo}/>
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />       

        <Route path="/profile" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Profile jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
        <Route path="/credit" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Credit jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setMemberInfo={setMemberInfo}/>
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
          <Route path="/pay_success" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Paysuccess jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
          <Route path="/pay_fail" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Payfail jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
          <Route path="/social_login" element={
          <>
            <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <SocialLogin jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userInfo={userInfo}/>
            <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
        } />
         <Route path="/qr_login" element={
          <>
            <QRLogin jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
         } />
         <Route path='/mobile_login_confirm' element={
          <>
          <MobileLoginConfirm jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo}/>
          </>
         }/>
          <Route path='/membership' element={
          <>
          <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <Membership jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo} setMemberInfo={setMemberInfo}/>
          <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
         }/>
          <Route path='/id_find_form' element={
          <>
          <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <FindId jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo} setMemberInfo={setMemberInfo}/>
          <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
         }/>
          <Route path='/find_id_confirm' element={
          <>
          <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <FindIdConfirm jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo} setMemberInfo={setMemberInfo}/>
          <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
         }/>
          <Route path='/pw_find_form' element={
          <>
          <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <FindPw jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo} setMemberInfo={setMemberInfo}/>
          <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
         }/>
          <Route path='/pw_find_confirm' element={
          <>
          <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <FindPwConfirm jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo} setMemberInfo={setMemberInfo}/>
          <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
         }/>
          <Route path='/previous_password' element={
          <>
          <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <PreviousPassword jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo} setMemberInfo={setMemberInfo}/>
          </>
         }/>
         <Route path='/my_group_list' element={
          <>
          <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <MyGroupList jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo} setMemberInfo={setMemberInfo}/>
          <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </>
         }/>
          <Route path='/change_password' element={
          <>
          <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <ChangePassword jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} memberInfo={memberInfo} setMemberInfo={setMemberInfo}/>
          </>
         }/>
        <Route path='/announcement_list' element={
            <>
                <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <AnnouncementList jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            </>
        }/>
          <Route path='/announcement_detail/:an_no' element={
              <>
                  <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                  <AnnouncementDetail jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                  <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
              </>
          }/>
          <Route path='/customer_home' element={
              <>
                  <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                  <CustomerHome jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                  <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
              </>
          }/>
          <Route path='/contact_us' element={
              <>
                  <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                  <ContactUsList jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                  <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
              </>
          }/>
          <Route path='/faq' element={
              <>
                  <Header jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                  <Faq jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                  <Footer jwt={jwt} setJwt={setJwt} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
              </>
          }/>
      </Routes>

    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
