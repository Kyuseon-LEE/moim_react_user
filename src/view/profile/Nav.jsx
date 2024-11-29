import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../css/profile/profile.css';

const Nav = ({activeIndex, setActiveIndex}) => {
    return(
            <div className="side_bar">
                <ul>
                    {['내 정보', '결제', '###', '###'].map((text, index) => (
                        <li
                            key={index}
                            className={activeIndex === index ? "active" : ""}
                            onClick={() => setActiveIndex(index)}
                        >
                        <div><Link to={index === 0 ? "/profile" : index === 1 ? "/credit" : "#none"}>{text}</Link></div>
                            <img src="/img/arrow-left.png" alt="arrow-left" />
                        </li>
                    ))}
                </ul>
            </div>
    );
}

export default Nav;