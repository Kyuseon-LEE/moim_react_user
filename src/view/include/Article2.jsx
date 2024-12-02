import React, { useState, useEffect } from "react";
import axios from "axios";

import '../../css/article.css';
import {Link} from "react-router-dom";

const Article2 = () => {

    const [ad, setAd] = useState({});

    useEffect(() => {
        fetchCurrentAd();
    }, [])
    const fetchCurrentAd = () => {
        axios.get('http://localhost:5000/ad/fetchCurrentAd')
            .then(res => {
                setAd(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    console.log(ad);
  return (
    <article className="article_2">
      <div className="article_wrap2">
          <h2>프리미엄 모임</h2>
          <div className="premium_list">
            <ul>
              <li>
                <img src={process.env.PUBLIC_URL + '/img/exam.png'} alt="exam" />
                <span>지금 []명이 함께하고 있어요</span><br />
                <span>모임이름</span>
              </li>
            </ul> 
        </div>
      </div>
      <div className="banner">
          <Link to={ad.ad_link}><img src={ad.ad_img} alt={ad.ad_name} /></Link>
      </div>
      <div className="article_wrap2">
          <h2>최근 활동이 활발한 모임</h2>
          <div className="premium_list">
            <ul>
              <li>
                <img src={process.env.PUBLIC_URL + '/img/exam.png'} alt="exam" />
                <span>지금 []명이 함께하고 있어요</span><br />
                <span>모임이름</span>
              </li>
            </ul>
        </div>        
      </div>
      <div className="article_wrap2">
          <h2>이런 활동을 찾고 있나요?</h2>
          <div className="random_list">
            <ul>
              <li>
                <img src={process.env.PUBLIC_URL + '/img/exam.png'} alt="exam" />
                <span>모임명</span><br />
                <span>모임설명</span><br />
                <span>[]모임 더보기</span><br />
              </li>
              <li>
                <img src={process.env.PUBLIC_URL + '/img/exam.png'} alt="exam" />
                <span>모임명</span><br />
                <span>모임설명</span><br />
                <span>[]모임 더보기</span><br />
              </li>
              <li>
                <img src={process.env.PUBLIC_URL + '/img/exam.png'} alt="exam" />
                <span>모임명</span><br />
                <span>모임설명</span><br />
                <span>[]모임 더보기</span><br />
              </li>
              <li>
                <img src={process.env.PUBLIC_URL + '/img/exam.png'} alt="exam" />
                <span>모임명</span><br />
                <span>모임설명</span><br />
                <span>[]모임 더보기</span><br />
              </li>
              <li>
                <img src={process.env.PUBLIC_URL + '/img/exam.png'} alt="exam" />
                <span>모임명</span><br />
                <span>모임설명</span><br />
                <span>[]모임 더보기</span><br />
              </li>
              
            </ul>
        </div>        
      </div>
    </article>
  );
};

export default Article2;
