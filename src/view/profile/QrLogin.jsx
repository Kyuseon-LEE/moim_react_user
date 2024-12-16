import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code"; 
import instance from '../../api/axios';
import '../../css/profile/qrLogin.css';

const QRLogin = ({ jwt, setJwt, isLoggedIn, setIsLoggedIn }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState("");  // QR 코드 생성할 URL
    const [token, setToken] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머 (초 단위)
    const [memberInfo, setMemberInfo] = useState('');
    const navigate = useNavigate();

    // 회원 정보 가져오기
    useEffect(() => {
        instance.post('/member/getMemberInfo')
            .then(response => {
                console.log("성공적으로 사용자의 정보를 가져왔습니다.");
                setMemberInfo(response.data.memberDtos);
            })
            .catch(err => {
                console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
            });
    }, []);

    // QR 코드 URL 생성 요청
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        axios
            .get("http://192.168.2.13:5000/qr/create-qr", {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Authorization 헤더에 accessToken을 넣음
                },
                withCredentials: true
            })
            .then((response) => {
                setQrCodeUrl(response.data.qrCodeUrl);  // QR 코드에 사용될 URL
                setToken(response.data.token);  // 인증용 토큰
            })
            .catch((error) => console.error("QR 코드 생성 실패:", error));
    }, []);

    // 타이머 설정
    useEffect(() => {
        if (timeLeft === 0 || authenticated) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, [timeLeft, authenticated]);

    // QR 코드 인증 상태 확인 (SSE)
    useEffect(() => {
        if (!token) return;

        const eventSource = new EventSource(`http://192.168.2.13:5000/qr/sse?token=${token}`, {
            withCredentials: true,
        });

        eventSource.onmessage = (event) => {
            console.log("SSE 메시지:", event.data);

            if (event.data === "인증 성공") {
                setAuthenticated(true);
                eventSource.close();  // SSE 연결 종료
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE 오류:", error);
            eventSource.close(); // 오류 발생 시 연결 종료
        };

        return () => eventSource.close(); // 컴포넌트 언마운트 시 SSE 종료
    }, [token]);

    // 만료 시간 처리
    useEffect(() => {
        if (timeLeft === 0) {
            alert("QR 코드의 유효 시간이 만료되었습니다. 새로 고침 후 다시 시도하세요.");
        }
    }, [timeLeft]);


    return (
        <div id="qr">
            {!authenticated ? (
                <div className="qr_wrap">
                    <h3>안녕하세요, {memberInfo.m_nickname}님</h3>
                    <h3>QR 코드를 스캔하여 로그인하세요.</h3>
                    {qrCodeUrl && <QRCode value={qrCodeUrl} className="img"/>}
                    <div className="guide-text">QR 코드를 스마트폰으로 스캔해 주세요.</div>
                    <div className="qr-timer">남은 시간: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</div>
                    <span className="network-warning">
                        공용 네트워크 또는 PC에서는 보안에 유의해 주세요.
                    </span>
                </div>
            ) : (
                <div className="qr_wrap success">
                    <h3>로그인 성공!</h3>
                </div>
            )}
        </div>
    );
};

export default QRLogin;
