import React, { useState, useEffect } from "react";
import '../../css/include.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import instance from '../../api/axios';
import Cookies from 'js-cookie';

const Header = ({ jwt, setJwt, isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [customerMenuOpen, setCustomerMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  // 페이지 로드 시 localStorage에서 jwt 가져오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
  
    // 로그인 상태에서 로그인 페이지로 접근 시 리다이렉트
    if (isLoggedIn && window.location.href === "/login") {
      navigate("/");
    }
  
    if (accessToken) {
      const decoded = jwtDecode(accessToken);

      const currentTime = Date.now() / 1000;
  
      // 액세스 토큰 만료 확인
      if (decoded.exp < currentTime) {
        // 만료되었으면 리프레시 토큰을 사용해 새로운 액세스 토큰 요청
        instance.post("http://localhost:5000/member/refresh_token")
          .then(response => {
            console.log("새로운 액세스 토큰을 수신했습니다.");
            const newAccessToken = response.data.accessToken;
  
            // 새 액세스 토큰을 로컬스토리지에 저장
            localStorage.setItem("accessToken", newAccessToken);
  
            // 상태 업데이트
            setJwt(newAccessToken);
            setIsLoggedIn(true);
          })
          .catch(err => {
            console.error("리프레시 토큰으로 액세스토큰 갱신 실패", err);
  
            // 토큰 갱신 실패 시 로그아웃 처리
            localStorage.removeItem("accessToken");
            setJwt('');
            setIsLoggedIn(false);
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          });
      } else {
        // 액세스 토큰이 유효하다면 상태 유지
        setJwt(accessToken);
        setIsLoggedIn(true);
      }
    }
  }, []);
  
  

  useEffect(() => {
    setMenuOpen(false); // 경로가 변경되면 메뉴 닫기
    setCustomerMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleCustomerMenu = () => {
    setCustomerMenuOpen(prev => !prev);
  }

  const handleLogout = () => {
    // 서버에 로그아웃 요청
    instance.post('/member/logout')
      .then(() => {
        Cookies.remove("refreshToken", { path: '/' });
        localStorage.removeItem("accessToken");
        setJwt('');
        setIsLoggedIn(false);
        navigate('/');
        alert("로그아웃 되었습니다.");
      })
      .catch(err => {
        console.error("로그아웃 요청 중 오류:", err);
        alert("로그아웃 중 문제가 발생했습니다.");
      });
  };

  console.log("isLoggedIn", isLoggedIn);
  

  const closeMenu = () => {
    setMenuOpen(false); // 메뉴 닫기
  };

  return (
    <header>
      <div className="header_wrap">
        <a href="/">
          <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
        </a>

        <div className="menu_icon" >
          <svg
              onClick={toggleMenu}
              width="25"
              height="25"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M2 4h16v2H2V4zM2 14h16v2H2v-2zM18 9H2v2h16V9z"
                fill="currentColor"
            />
          </svg>
          <svg
              onClick={toggleCustomerMenu}
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              style={{paddingBottom: 1, marginLeft: 20}}
              viewBox="0 0 24 24">
            <path
                fill="currentColor"
                  d="M10.6 16q0-2.025.363-2.912T12.5 11.15q1.025-.9 1.563-1.562t.537-1.513q0-1.025-.687-1.7T12 5.7q-1.275 0-1.937.775T9.125 8.05L6.55 6.95q.525-1.6 1.925-2.775T12 3q2.625 0 4.038 1.463t1.412 3.512q0 1.25-.537 2.138t-1.688 2.012Q14 13.3 13.738 13.913T13.475 16zm1.4 6q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22"/>
          </svg>
        </div>

        <nav className={`menu_bar ${menuOpen ? 'show' : ''}`}>
          <ul>
            {!isLoggedIn ? (
                <>

                  <li><Link to="/signUp" onClick={closeMenu}>회원가입</Link></li>
                  <li><Link to="/login" onClick={closeMenu}>로그인</Link></li>
                </>
            ) : (
                <>
                  <li><Link to="/profile" onClick={closeMenu}>내정보</Link></li>
                  <li><Link to="#none" onClick={handleLogout}>로그아웃</Link></li>
                </>
            )}
          </ul>
        </nav>
        <nav className={`menu_bar ${customerMenuOpen ? 'show' : ''}`}>
          <ul>
            <li><Link to="/announcement_list">공지사항</Link></li>
            <li><Link to="/customer_home">고객센터</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
