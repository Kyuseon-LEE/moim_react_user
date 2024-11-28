import React, { useState } from "react";
import '../../css/member/signupSuccess.css';
import instance from '../../api/axios';
import { useNavigate } from "react-router-dom";

const SignupSuccess = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const categories = [
        {id:1, name: "여행"},
        {id:2, name: "운동"},
        {id:3, name: "문화/공연"},
        {id:4, name: "음악"},
        {id:5, name: "게임"},
        {id:6, name: "사진"},
        {id:7, name: "요리"},
    ];

    const handleCategoryClick = (category) => {
        if (selectedCategories.includes(category)) {
            // 이미 선택된 카테고리라면 선택 해제
            setSelectedCategories(selectedCategories.filter((item) => item !== category));
        } else if (selectedCategories.length < 2) {
            // 선택되지 않았고, 선택된 개수가 2개 미만일 경우 추가
            setSelectedCategories([...selectedCategories, category]);
        }
    };
// handler
    const handleSkip = () => {
        console.log("click!!");
        navigate("/login");
    }

    const handleSubmit = () => {
        console.log("넘겨주는 카테고리", selectedCategories);

        instance.post("/member/insertCategories", { m_category: selectedCategories })
        .then(response => {
            console.log("성공적으로 axios 요청이 응답했습니다.",response.data);
            navigate("/");
        })
        .catch(err => {
            console.log("axios 요청에 실패 했습니다.", err);
        })
    } 


    return(
        <section id="section">
            <div className="success_section_wrap">
                <h3>환영합니다!</h3>
                <div className="logo">
                    <img src="/img/logo.png" alt="company logo" />
                </div>
                <div className="contents">
                    <h3>진심으로 회원가입을 축하합니다.</h3><br />
                    <div className="explain">
                        <div>회원님을 취향에 맞게 소개해 드릴께요!</div>
                        <div>관심사를 2가지 선택해주세요!</div>
                    </div>
                </div>
                <div className="categorys">
                    <ul>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <div className={`category-item ${selectedCategories.includes(category.name) ? "selected" : ""}`}
                                     onClick={() => handleCategoryClick(category.name)}
                                >
                                    {category.name}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="btns">
                        <input type="button" value="Select" onClick={handleSubmit}/>
                        <input type="button" value="Skip" onClick={handleSkip}/>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignupSuccess;