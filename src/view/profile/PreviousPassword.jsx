import React, { useState } from "react";
import '../../css/member/PreviousPassword.css';
import instance from '../../api/axios';
import { useNavigate } from "react-router-dom";

const PreviousPassword = () => {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const passwordConfirm = () => {
        let accessToken =localStorage.getItem("accessToken");
        let formData = new FormData();
        formData.append('m_pw', password);
        formData.append("accessToken", accessToken);

        instance.post('/member/passwordConfirm', formData)
        .then(res => {
            console.log("password confirm successful", res.data);
            if(res.data === true) {
                console.log(res.data);
                navigate("/change_password")
            } else {
                    alert("비밀번호가 일치하지 않습니다.");

            }
        })
        .catch(err => console.log("password confirm Err", err));
                
    }

    return(
        <div className="previous_password">
            <h2>비밀번호 확인</h2>
            <div className="content">
                <span>비밀번호:</span>
                <input type="password" onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <input type="button" value="확인" onClick={passwordConfirm} />
        </div>
    );
}

export default PreviousPassword;