import React, { useEffect, useState } from "react";
import instance from '../../api/axios';
import '../../css/member/LocalLogin.css';
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';


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

        axios.post('http://localhost:5000/member/localLogin', formData, {
            headers : {
                'Content-Type' : 'application/json'
            },
            withCredentials: true,
        })
            .then(response => {
                const { accessToken,  memberInfo } = response.data;
                localStorage.setItem("accessToken", accessToken);
                // localStorage.setItem("m_id", m_id);
                // localStorage.setItem("m_no", memberInfo.m_no);
                // localStorage.setItem("m_profile_img", memberInfo.m_profile_img);
                // localStorage.setItem("m_category", memberInfo.m_category);
                // localStorage.setItem("m_address", memberInfo.m_address);
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
    const handleGoogleLoginSuccess = async (tokenResponse) => {
        const { access_token } = tokenResponse;
    
        try {
            // 서버로 id_token 전달
            const response = await instance.post('/auth/google', { access_token });
            const existMember = response.data.userFromDb;
    
            if (existMember === 11) {
                // 기존 회원 처리
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
                // 신규회원
                const user = {
                    m_mail: response.data.user.m_mail,
                    m_name: response.data.user.m_name,
                    m_profile_img: response.data.user.m_profile_img,
                };
                setUserInfo(user);
                navigate("/social_login");
            }
        } catch (err) {
            console.error("Google Login Error:", err);
            alert("Google 로그인 실패!");
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => alert("Google 로그인 실패!"),
        clientId: "378518007722-pt147i1dec56ncndfmlvi9q6hppqnkaf.apps.googleusercontent.comOUR_GOOGLE_CLIENT_ID",
        scope: 'openid email profile',
        response_type: 'token id_token',
    });

    //카카오 로그인
    const handleKakaoLogin = async () => {
        if (!window.Kakao || !window.Kakao.Auth) {
            alert("Kakao SDK가 초기화되지 않았습니다.");
            return;
        }
    
        window.Kakao.Auth.login({
            success: async function (authObj) {
                const access_token = authObj.access_token;
    
                try {
                    // 서버로 access_token 전달
                    const response = await instance.post('/auth/kakao', { access_token });
                    const existMember = response.data.userFromDb;
    
                    if (existMember === 11) {
                        // 신규 회원 처리
                        const accessToken = response.data.accessToken;
                        const user = {
                            m_kakao_id: response.data.user.m_kakao_id,
                            m_name: response.data.user.m_nickname,
                            m_profile_img: response.data.user.m_profile_img,
                        };
                        localStorage.setItem("accessToken", accessToken);
                        setUserInfo(user);
                        setJwt(accessToken);
                        setIsLoggedIn(true);
                        navigate("/signup_success");  // 신규 회원 페이지로 이동
                    } else {
                        // 기존 회원 처리
                        const user = {
                            m_kakao_id: response.data.user.m_kakao_id,
                            m_name: response.data.user.m_nickname,
                            m_profile_img: response.data.user.m_profile_img,
                        };
                        setUserInfo(user);
                        navigate("/social_login");  // 기존 회원 페이지로 이동
                    }
                } catch (err) {
                    console.error("Kakao Login Error:", err);
                    alert("Kakao 로그인 실패!");
                }
            },
            fail: function (error) {
                console.log("Kakao login failed:", error);
                alert("Kakao 로그인 실패!");
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
                            <a href="/id_find_form">아이디 찾기</a>
                            <a href="/pw_find_form">비밀번호 찾기</a>
                        </div>
                        <input type="button" value="로그인" onClick={handleSubmit} />
                    </form>
                </div>
                <div className="social_title">
                    <h4>Social Login</h4>
                        <button className="google-login-button" onClick={googleLogin}>
                            <img src="/img/google_logo.png" alt="" /> Continue with Google
                        </button>
                    <a href="javascript:void(0);" onClick={handleKakaoLogin}>
                        <div className="kakao_logo">
                            <img src="/img/kakao_logo.png" alt="kakao Logo" />
                        </div>
                        Continue with kakao
                    </a>
                </div>
            </div>
        </article>
    );
};

export default LocalLogin;