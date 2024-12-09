import React from "react";
import '../../css/member/findIdConfirm.css'
import { useLocation } from "react-router-dom";

const FindPwConfirm = () => {

    const location = useLocation();
    const {findId, mRegDate} = location.state || {};

    return(
        <>
        <div className="FindIdConfirm_wrap">
            <h2>비밀번호 찾기 완료</h2>
            <div className="pw_content">
                <span>메일이 정상적으로 발송되었습니다.</span><br />
                <span>고객님의 메일에서 비밀번호를 확인하세요.</span><br />
                <span>감사합니다.</span>
            </div>
        </div>
            <div className="links">
            <div className="login"><a href="/">홈으로</a></div>
            <div className="login"><a href="/login">로그인</a></div>
        </div>
        </>
    );
}

export default FindPwConfirm;