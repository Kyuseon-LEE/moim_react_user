import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/profile/profile.css";
import instance from "../../api/axios";

const Nav = () => {
  const [memberInfo, setMemberInfo] = useState(null); // 사용자 정보를 저장
  const [isLoading, setIsLoading] = useState(true);   // 로딩 상태 관리

  useEffect(() => {
    // 사용자 정보를 가져오는 함수
    const fetchMemberInfo = async () => {
      try {
        const response = await instance.post("/member/getMemberInfo");
        console.log("성공적으로 사용자의 정보를 가져왔습니다.");
        setMemberInfo(response.data.memberDtos);
      } catch (err) {
        console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
      } finally {
        setIsLoading(false); // 로딩 상태를 false로 설정
      }
    };

    fetchMemberInfo();
  }, []);

  // 팝업을 여는 함수
  const openPopup = (url) => {
    window.open(
      url, // 팝업에 로드할 URL
      "QRLoginPopup", // 팝업 창의 이름
      "width=420,height=520,scrollbars=yes,resizable=yes" // 팝업 창의 속성 (크기 및 스크롤 가능 설정)
    );
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="side_bar">
      <ul>
        <li><Link to="/profile">내정보</Link></li>
        {memberInfo?.m_grade === 0 ? (
          <>
            <li><Link to="/credit">회원결제</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/membership">멤버쉽</Link></li>
          </>
        )}
        <li onClick={() => openPopup("/qr_login")}><Link to="#">QR로그인</Link></li>
        <li><Link to="/previous_password">비밀번호 변경</Link></li>
        <li><Link to="/my_group_list">내 모임 관리</Link></li>
      </ul>
    </div>
  );
};

export default Nav;
