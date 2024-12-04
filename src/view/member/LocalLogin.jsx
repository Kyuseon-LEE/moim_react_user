import React, { useEffect, useState } from "react";
import instance from '../../api/axios';
import '../../css/member/LocalLogin.css';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

const LocalLogin = ({ jwt, setJwt, setIsLoggedIn, setUserInfo }) => {
    const navigate = useNavigate();
    const [m_id, setM_id] = useState('');
    const [m_pw, setM_pw] = useState('');
    const [memberInfo, setMemberInfo] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
            setJwt(storedToken);
        }

        // 카카오 SDK 초기화
        if (window.Kakao && !window.Kakao.isInitialized()) {
            const kakaoKey = '98bd1ca17adb47e88bf6bada6f92b822'; // 실제 JavaScript 키
            window.Kakao.init(kakaoKey);
            console.log("Kakao SDK initialized");
        }
    }, [setJwt]);

    const handleInputData = (event) => {
        event.target.name === "m_id" ? setM_id(event.target.value) : setM_pw(event.target.value);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("m_id", m_id);
        formData.append("m_pw", m_pw);

        instance.post('/member/localLogin', formData)
            .then(response => {
                const { accessToken, memberInfo } = response.data;
                localStorage.setItem("accessToken", accessToken);
                // localStorage.setItem("m_id", m_id);
                // localStorage.setItem("m_no", memberInfo.m_no);
                // localStorage.setItem("m_profile_img", memberInfo.m_profile_img);
                setMemberInfo(memberInfo);
                setJwt(accessToken);
                setIsLoggedIn(true);
                navigate(memberInfo.m_category === null ? "/signup_success" : "/");
            })
            .catch(err => {
                const errorMessage = err.response?.status === 401 ? err.response.data.message : "아이디 또는 비밀번호가 일치하지 않습니다.";
                alert(errorMessage);
            });
    };
    //구글 로그인
    const handleGoogleLoginSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        instance.post('/auth/google', { ID_token: credentialResponse.credential })
            .then(response => {

                let existMember = response.data.userFromDb;

                if(existMember === 11) {
                    const accessToken = response.data.accessToken;
                    const user = {
                        m_mail: response.data.user.m_mail,
                        m_name: response.data.user.m_name,
                        m_profile_img: response.data.user.m_profile_img,
                    };
                    localStorage.setItem("accessToken", accessToken);
                    setUserInfo(user);
                    setJwt(accessToken);
                    setIsLoggedIn(true);
                    navigate("/signup_success");

                } else {
                    console.log("######", response.data.user);
                    const user = {
                        m_mail: response.data.user.m_mail,
                        m_name: response.data.user.m_name,
                        m_profile_img: response.data.user.m_profile_img,
                    };
                    setUserInfo(user);
                    navigate("/social_login")
                }

            })
            .catch(err => alert("Google 로그인 실패!"));
    };

    //카카오 로그인
    const handleKakaoLogin = () => {
        if (!window.Kakao || !window.Kakao.Auth) {
            alert("Kakao SDK가 초기화되지 않았습니다.");
            return;
        }

        window.Kakao.Auth.login({
            success: function (authObj) {
                instance.post('/auth/kakao', { access_token: authObj.access_token })
                    .then(response => {
                        const jwtToken = response.data.accessToken;
                        localStorage.setItem("accessToken", jwtToken);

                        const user = {
                            m_kakao_id : response.data.user.m_kakao_id,
                            m_name: response.data.user.m_nickname,
                            m_profile_img: response.data.user.m_profile_img,
                        };

                        setUserInfo(user);
                        setJwt(jwtToken);
                        setIsLoggedIn(true);
                        navigate("/social_login");
                    })
                    .catch(() => alert("Kakao 로그인 실패!"));
            },
            fail: function () {
                alert("[fail]]Kakao 로그인 실패!");
            }
        });
    };

    return (
        <article className="local_article">
            <div className="title">로그인</div>
            <div className="container">
                <div className="conetent">
                    <form>
                        <input type="text" name="m_id" placeholder="ID" onChange={handleInputData} />
                        <input type="password" name="m_pw" placeholder="PW" onChange={handleInputData} />
                        <div className="find_account">
                            <a href="/member/id_find_form">아이디 찾기</a>
                            <a href="/member/pw_find_form">비밀번호 찾기</a>
                        </div>
                        <input type="button" value="로그인" onClick={handleSubmit} />
                    </form>
                </div>
                <div className="social_title">
                    <h4>Social Login</h4>
                    <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => alert("Google 로그인 실패!")} />
                    <a href="javascript:void(0);" onClick={handleKakaoLogin}>
                        <div className="kakao_logo">
                            <img src="/img/kakao_logo.png" alt="kakao Logo" />
                        </div>
                        Kakao Login
                    </a>
                </div>
            </div>
        </article>
    );
};

export default LocalLogin;
