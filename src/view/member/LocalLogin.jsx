import React, { useEffect, useState } from "react";
import instance from '../../api/axios';
import '../../css/member/LocalLogin.css';
import { useNavigate } from "react-router-dom";

const LocalLogin = ({jwt, setJwt}) => {
    const navigate = useNavigate();
    const [m_id, setM_id] = useState('');
    const [m_pw, setM_pw] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
            setJwt(storedToken);

        }
    }, [navigate, setJwt]); // 의존성 배열에 navigate, setJwt 추가

    const handleInputData = (event) => {
        event.target.name === "m_id" ? setM_id(event.target.value) : setM_pw(event.target.value);
    };

    const handleSubmit = () => {
        console.log("useState values", {m_id, m_pw})

        const formData = new FormData();
        formData.append("m_id", m_id)
        formData.append("m_pw", m_pw)

        instance.post('/member/localLogin', formData)
        .then(response => {
            console.log("[로그인 성공]", response.data);
            let accessToken = response.data.accessToken;
            localStorage.setItem("accessToken", response.data.accessToken);
            setJwt(accessToken);
            navigate("/");
        })
        .catch(err => {
            console.log("[로그인 실패]", err);
        });
    }

    return(
        <article>
            <div className="title">
                로그인
            </div>
            <div className="container">
                <div className="conetent">
                    <form action="/member/login_confirm" name="login_form" method="post">
                        <input type="text" name="m_id" placeholder="ID" onChange={handleInputData} />
                        <input type="password" name="m_pw" placeholder="PW" onChange={handleInputData} />


                        <div className="find_account">
                            <a href="/member/id_find_form">아이디 찾기</a>
                            <a href="/member/pw_find_form">비밀번호 찾기</a>
                        </div>

                        <input type="button" value="로그인" onClick={handleSubmit}/>
                    </form>
                </div>
                <div className="social_title">
                    <h4>Social Login</h4>
                    <a href="/auth/google">
                        <div className="google_logo"><img src="/img/google_logo.png" alt="Google Logo" /></div>
                        Goole Login
                    </a>
                    <a href="/auth/kakao">
                        <div className="kakao_logo"><img src="/img/kakao_logo.png" alt="kakao Logo" /></div>
                        kakao Login
                    </a>
                </div>
            </div>
        </article>
    )
}
export default LocalLogin;