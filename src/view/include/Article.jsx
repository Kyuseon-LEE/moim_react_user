import React, { useState, useEffect } from "react";

import '../../css/article.css';

const Article = () => {
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [randomPhrase, setRandomPhrase] = useState(""); 

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
          console.log("Latitude:", latitude, "Longitude:", longitude);
          fetchCityName(latitude, longitude);
        },
        (err) => {
          setError("위치 정보를 가져올 수 없습니다.");
          console.error(err);
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
        console.log("Kakao API Response:", data);
        if (data.documents && data.documents[0] && data.documents[0].address) {
          const cityName = data.documents[0].address.region_2depth_name;
          setCity(cityName);
        } else {
          setError("주소 정보를 가져올 수 없습니다.");
        }
      })
      .catch((err) => {
        setError("주소 정보를 가져오는 중 오류가 발생했습니다.");
        console.error(err);
      });
  };

  return (
    <article className="article_1">
      <div className="article_wrap">
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
              <li className="create">
                <p>+</p>
                <p>만들기</p>
              </li>
              <li>
                <img src={process.env.PUBLIC_URL + '/img/exam.png'} alt="exam" />
                <div className="info">
                  <p>이름</p>
                  <p>멤버</p>
                </div>
              </li>
            </ul>
        </div>
      </div>
    </article>
  );
};

export default Article;
