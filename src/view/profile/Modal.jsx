import React, { useEffect, useState } from 'react';
import '../../css/profile/modal.css';  // 모달 스타일을 따로 정의한 CSS 파일

const Modal = ({ isOpen, closeModal, onCategoryChange, handleSaveClick, initialCategories }) => {
    const [selectedCategories, setSelectedCategories] = useState(initialCategories || []); // 초기값 설정

    const categories = [
        { id: "travel", name: "여행" },
        { id: "health", name: "운동" },
        { id: "culture", name: "문화/공연" },
        { id: "music", name: "음악" },
        { id: "game", name: "게임" },
        { id: "picture", name: "사진" },
        { id: "cook", name: "요리" },
    ];

    const handleCategoryClick = (category) => {
        // selectedCategories가 null이거나 빈 문자열인 경우 빈 문자열로 초기화
        if (selectedCategories === null || selectedCategories === '') {
            setSelectedCategories(category);  // 첫 번째 카테고리 선택
        } 
        // 이미 선택된 카테고리 제거
        else if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.replace(category, '').trim());
        } 
        // 선택되지 않은 카테고리 추가, 최대 2개까지 선택 가능
        else if (selectedCategories.split(' ').filter(Boolean).length < 2) {
            setSelectedCategories(selectedCategories + ' ' + category);  // 공백을 기준으로 카테고리 추가
        }
    };

    useEffect(() => {
        if (selectedCategories.length > 0) {
            onCategoryChange(selectedCategories);  // 부모에게 선택된 카테고리 전달
        }
    }, [selectedCategories, onCategoryChange]);

    const handleSave = () => {
        handleSaveClick();  // 서버 요청 함수
        closeModal();       // 모달 닫기
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>카테고리</h2>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <div
                                className={`category-item ${selectedCategories.includes(category.name) ? "selected" : ""}`}
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                {category.name}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="btns">
                    <input type="button" value="변경" onClick={handleSave} />
                    <input type="button" value="취소" onClick={handleCancel} />
                </div>
            </div>
        </div>
    );
};


export default Modal;
