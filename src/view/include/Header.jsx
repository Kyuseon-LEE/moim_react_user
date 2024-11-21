import React, { useState, useEffect } from "react";
import '../../css/include.css';
import { Link, useNavigate } from 'react-router-dom';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt"); 
    setIsLoggedIn(false);
    navigate('/');
    alert("로그아웃 되었습니다.");
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
                <li><Link to="/signUp">회원가입</Link></li>
                <li><Link to="/login">로그인</Link></li>
              </>
            ) : (
              <>
                <li><Link to="#none">내정보</Link></li>
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
