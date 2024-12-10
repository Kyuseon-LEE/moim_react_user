import React, { useState } from "react";
import '../../css/member/PreviousPassword.css';
import instance from '../../api/axios';
import { redirect, useNavigate } from "react-router-dom";

const ChangePassword = ({ setIsLoggedIn }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        // 클라이언트 유효성 검사
        console.log("click!")
        if (!password || !confirmPassword) {
            setErrorMessage("모든 필드를 입력해주세요.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (password.length < 8) {
            setErrorMessage("비밀번호는 최소 8자 이상이어야 합니다.");
            return;
        }

        let accessToken = localStorage.getItem("accessToken");
        instance.post('/member/changePassword', {m_pw : password, accessToken : accessToken})
        .then(res => {
            console.log("비밀번호 업데이트 성공", res.data);
            localStorage.removeItem("accessToken");
            setIsLoggedIn(false);
            navigate("/")
        })
        .catch(err => {
            console.log("비밀번호 업데이트 실패", err)
            if(err.response && err.response.status === 403) {
                alert("비밀번호 변경 권한이 없습니다. 다시 시도해주세요.")
            }
        });
    }


    const cancel = () => {
        navigate("/");
    }

    return(
        <div className="previous_password">
            <h2>새로운 비밀번호</h2>
            <div className="content">
                <span>새 비밀번호:</span>
                <input type="password" onChange={(e) => setPassword(e.target.value)}/><br /><br />
                <span>비밀번호 확인:</span>
                <input type="password" onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input type="button" value="확인"  onClick={handleChangePassword}/>
            <input type="button" value="취소" onClick={cancel} />
        </div>
    );
}

export default ChangePassword;