import React, { useState, useEffect } from "react";
import '../../css/include.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Header = ({ jwt, setJwt, isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  // 페이지 로드 시 localStorage에서 jwt 가져오기
  useEffect(() => {
    const storedJwt = localStorage.getItem("accessToken");

    if(isLoggedIn && window.location.href === "/login") {
      navigate("/");
    }
  
    if (storedJwt) {
      const decoded = jwtDecode(storedJwt);
      const currentTime = Date.now() / 1000;
  
      if (decoded.exp < currentTime) {
        // 토큰이 만료됨
        localStorage.removeItem("accessToken");
        localStorage.removeItem("m_id");
        localStorage.removeItem("m_no");
        setJwt('');
        setIsLoggedIn(false);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/";
      } else {
        setJwt(storedJwt);
        setIsLoggedIn(true);
      }
    }
  }, [setJwt, setIsLoggedIn, isLoggedIn, navigate]);

  useEffect(() => {
    setMenuOpen(false); // 경로가 변경되면 메뉴 닫기
  }, [location]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");  // localStorage에서 jwt 삭제
    localStorage.removeItem("m_id");
    localStorage.removeItem("m_no");
    setJwt('');  // jwt 상태 초기화
    setIsLoggedIn(false);  // 로그인 상태 변경
    window.location.href = "/";
    alert("로그아웃 되었습니다.");
  };

  const closeMenu = () => {
    setMenuOpen(false); // 메뉴 닫기
  };

  return (
    <header>
      <div className="header_wrap">
        <a href="/">
          <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
        </a>

        <div className="menu_icon" onClick={toggleMenu}>
          <svg
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
      </div>
    </header>
  );
};

export default Header;
