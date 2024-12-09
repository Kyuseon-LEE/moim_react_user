import React from "react";
import '../../css/member/findIdConfirm.css'
import { useLocation } from "react-router-dom";

const FindIdConfirm = () => {

    const location = useLocation();
    const {findId, mRegDate} = location.state || {};

    return(
        <>
        <div className="FindIdConfirm_wrap">
            <h2>아이디 찾기 완료</h2>
            <div className="content">
                <div className="id">
                    <span>ID:</span>
                    <div>{findId}</div>
                </div>
                <div className="reg_date">
                    <span>가입일:</span>
                    <div>{mRegDate}</div>
                </div>
            </div>
        </div>
            <div className="links">
            <div className="login"><a href="/login">로그인</a></div>
            <div><a href="pw_find_form">비밀번호 찾기</a></div>
        </div>
        </>
    );
}

export default FindIdConfirm;