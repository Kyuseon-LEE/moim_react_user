import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QRLogin = ({jwt, setJwt, isLoggedIn, setIsLoggedIn}) => {
    const [qrCode, setQrCode] = useState("");
    const [token, setToken] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    // QR 코드 생성 요청
    useEffect(() => {
        axios
            .get("http://192.168.2.5:5000/qr/create-qr", {
                withCredentials: true,
            })
            .then((response) => {
                setQrCode(response.data.qrCode); // QR 코드 이미지
                setToken(response.data.token); // 인증용 토큰
            })
            .catch((error) => console.error("QR 코드 생성 실패:", error));
    }, []);

    // SSE를 통한 상태 확인
    useEffect(() => {
        if (!token) return;

        const eventSource = new EventSource(`http://192.168.2.5:5000/qr/sse?token=${token}`, {
            withCredentials: true,
        });

        eventSource.onmessage = (event) => {
            console.log("SSE 메시지:", event.data);

            if (event.data === "인증 성공") {
                setAuthenticated(true);
                navigate("/");
                eventSource.close(); // SSE 연결 종료
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE 오류:", error);
            eventSource.close(); // 오류 발생 시 연결 종료
        };

        return () => eventSource.close(); // 컴포넌트 언마운트 시 SSE 종료
    }, [token]);


    return (
        <div>
            {!authenticated ? (
                <div>
                    <h3>QR 코드를 스캔하여 로그인하세요.</h3>
                    {qrCode && <img src={qrCode} alt="QR Code" />}
                </div>
            ) : (
                <h3>로그인 성공!</h3>
            )}
        </div>
    );
};

export default QRLogin;
