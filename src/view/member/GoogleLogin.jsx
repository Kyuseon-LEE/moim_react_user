import React from "react";
import { Google } from '@react-oauth/google';
import instance from '../../api/axios';

const GoogleLogin = () => {

    const handleLoginSuccess = (response) => {
        const googleOauthToken  = response.credential;
        instance.post("/member/googleLogin")
        .then(response => {
            response.json();
            // localStorage.setItem("googleAccessToken") 받은토큰을 로컬스토리지에 저장
        })
        .catch(err => {
            console.error("Error", err);
        })
    }

    return(
        <div>
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
      </div>
    )
}

export default GoogleLogin;