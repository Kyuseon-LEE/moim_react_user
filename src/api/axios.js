import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,  // 쿠키를 포함하여 요청
    headers: {
        'Content-Type': 'application/json',
    }
});

console.log("axios()");

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response;
}, async (err) => {
    if (err.response && err.response.status === 401) {
        try {
            // 리프레시 토큰을 사용하여 새로운 액세스 토큰 요청
            const refreshResponse = await axios.post('http://localhost:5000/member/refresh_token', {}, {
                withCredentials: true,
            });

            const newAccessToken = refreshResponse.data.accessToken;

            // 새로운 액세스 토큰을 로컬 스토리지에 저장
            localStorage.setItem('accessToken', newAccessToken);

            // 기존 요청에 새로운 액세스 토큰을 추가
            err.config.headers["Authorization"] = `Bearer ${newAccessToken}`;

            // 실패한 요청을 새로운 액세스 토큰으로 재시도
            return axios(err.config);
        }
        catch (refreshErr) {
            console.log("리프레시 토큰 갱신 실패!", refreshErr);

            // 리프레시 토큰 갱신 실패 시, 로컬 스토리지에서 토큰 제거
            localStorage.removeItem('accessToken');
            // 로그인 페이지로 리다이렉션하거나 적절한 처리
            // window.location.href = "/login";  // 예시로 로그인 페이지로 리다이렉트
            return Promise.reject(refreshErr);
        }
    }

    return Promise.reject(err);
});

export default instance;
