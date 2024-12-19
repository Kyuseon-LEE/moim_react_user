import React, { useState, useEffect } from "react";
import axios from "axios";

import '../../css/article.css';
import {Link} from "react-router-dom";
import RandomGroup from "./RandomGroup";
import MatchingGroup from "./MatchingGroup";
import PremiumGroup from "../group/PremiumGroup";

const Article2 = () => {

    const [ad, setAd] = useState({});

    useEffect(() => {
        fetchCurrentAd();
    }, [])
    const fetchCurrentAd = () => {
        axios.get('http://3.34.115.75:5000/ad/fetchCurrentAd')
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
         <PremiumGroup />
      </div>
      <div className="banner">
          <Link to={ad.ad_link}><img src={ad.ad_img} alt={ad.ad_name} /></Link>
      </div>
      <div className="article_wrap2">
        <MatchingGroup />
      </div>
    </article>
    <article className="article_3">
      <div className="article_wrap3">
          <RandomGroup />       
      </div>
    </article>
    </>
  );
};

export default Article2;
