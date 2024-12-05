import React, { useState, useEffect } from "react";
import axios from "axios";

import '../../css/article.css';
import {Link} from "react-router-dom";
import AllGroup from "./AllGroup";

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
    <>
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
    </article>
    <article className="article_3">
      <div className="article_wrap3">
          <AllGroup />       
      </div>
    </article>
    </>
  );
};

export default Article2;
