import React, { useState, useEffect } from "react";
import '../../css/article.css';
import { useNavigate } from "react-router-dom";

const Article = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [randomPhrase, setRandomPhrase] = useState(""); 
  const [groups, setGroups] = useState([]); // 로그인 유저의 그룹 정보
  const userId = localStorage.getItem("m_id")
  const handleGroupClick = (g_no) => {
    navigate(`/group/${g_no}`); // 동적 경로로 이동
  };
  // 문구 배열
  const phrases = [
    "소모임이 궁금하다면?",
    "모임에 참여해보세요!",
    "의 새로운 친구를 만나보세요!",
    "와 함께하는 즐거움을 느껴보세요!",
    "와 활동적인 하루를 만들어보세요!",
  ];

  // 랜덤 문구 설정
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setRandomPhrase(phrases[randomIndex]);
  }, []);

  // 위치 정보 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityName(latitude, longitude);
        },
        (err) => {
          setError("위치 정보를 가져올 수 없습니다.");
        }
      );
    } else {
      setError("브라우저에서 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  // Kakao API 호출
  const fetchCityName = (lat, lon) => {
    const KAKAO_API_KEY = "8ffb170be2406c99a168c968d0d3f336";
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&input_coord=WGS84`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.documents && data.documents[0] && data.documents[0].address) {
          const cityName = data.documents[0].address.region_2depth_name;
          setCity(cityName);
        } else {
          setError("주소 정보를 가져올 수 없습니다.");
        }
      })
      .catch(() => {
        setError("주소 정보를 가져오는 중 오류가 발생했습니다.");
      });
  };

  // 그룹 정보 가져오기
  useEffect(() => {
    console.log("Fetching groups for user ID:", userId); // 사용자 ID 확인
  
    // Node.js 서버에 요청
    fetch(`http://localhost:5000/group/user-groups/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // JSON 요청임을 명시
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched group data from Node.js:", data); // Node.js에서 가져온 데이터 확인
        setGroups(data); // 그룹 데이터 상태 업데이트
      })
      .catch((error) => {
        console.error("Error occurred while fetching groups:", error.message);
        setError("그룹 정보를 가져올 수 없습니다."); // 오류 메시지 설정
      });
  }, [userId]);
  

  return (
    <article className="article_1">
      <div className="article_wrap_main">
        <div className="together">
          <svg
            height="15px"
            width="15px"
            viewBox="0 0 293.334 293.334"
            xmlns="http://www.w3.org/2000/svg"
            fill="#1273e4"
          >
            <path d="M146.667,0C94.903,0,52.946,41.957,52.946,93.721c0,22.322,7.849,42.789,20.891,58.878 c4.204,5.178,11.237,13.331,14.903,18.906c21.109,32.069,48.19,78.643,56.082,116.864c1.354,6.527,2.986,6.641,4.743,0.212 c5.629-20.609,20.228-65.639,50.377-112.757c3.595-5.619,10.884-13.483,15.409-18.379c6.554-7.098,12.009-15.224,16.154-24.084 c5.651-12.086,8.882-25.466,8.882-39.629C240.387,41.962,198.43,0,146.667,0z M146.667,144.358 c-28.892,0-52.313-23.421-52.313-52.313c0-28.887,23.421-52.307,52.313-52.307s52.313,23.421,52.313,52.307 C198.98,120.938,175.559,144.358,146.667,144.358z" />
            <circle cx="146.667" cy="90.196" r="21.756" />
          </svg>
          <p className="city">{city}</p> {randomPhrase}
          {error && <p className="error">{error}</p>}
        </div>
        <div className="my_list">
            <ul>
              <a href="/create">
                <li className="create">
                  <p className="plus">+</p>
                  <p>만들기</p>
                </li>
              </a>
              {groups
                .filter((group) => group.g_m_role !== 0) // g_m_role이 0이 아닌 그룹만 포함
                .map((group) => (
                  <li key={group.g_no} onClick={() => handleGroupClick(group.g_no)}>
                    <a>
                      <img
                        src={`http://localhost:5000/uploads/${group.g_img_name}`}
                        alt={group.g_name}
                      />
                      <div className="info">
                        <p>{group.g_name}</p>
                        <p>{group.memberCount}명</p>
                      </div>
                    </a>
                  </li>
                ))}

            </ul>
        </div>
      </div>
    </article>
  );
};

export default Article;
