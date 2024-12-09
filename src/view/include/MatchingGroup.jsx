import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MatchingGroup = () => {
  const [popularGroups, setPopularGroups] = useState([]);
  const [categoryGroups, setCategoryGroups] = useState([]);
  const [locationGroups, setLocationGroups] = useState([]);
  const [randomSectionIndex, setRandomSectionIndex] = useState(null); // 랜덤 섹션 인덱스
  const navigate = useNavigate();

  const extractRegion = (address) => {
    if (!address) return null;
    const parts = address.trim().split(/\s+/);
    if (parts.length >= 3) {
      return `${parts[1]} ${parts[2]}`;
    }
    return null;
  };

  const userRegion = extractRegion(localStorage.getItem("m_address"));

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/group/all");
        const allGroups = response.data;

        const userCategories = localStorage
          .getItem("m_category")
          ?.split(",")
          .map((category) => category.trim());

        const sortedGroups = allGroups
          .sort((a, b) => b.memberCount - a.memberCount)
          .slice(0, 5);

        const categoryMatchedGroups = allGroups.filter((group) =>
          userCategories?.some(
            (userCategory) => group.g_category === userCategory
          )
        );

        const locationMatchedGroups = allGroups.filter(
          (group) => group.g_location === userRegion
        );

        setPopularGroups(sortedGroups);
        setCategoryGroups(categoryMatchedGroups);
        setLocationGroups(locationMatchedGroups);

        // 랜덤으로 노출할 섹션 인덱스 설정
        const randomIndex = Math.floor(Math.random() * 3); // 0, 1, 2 중 하나
        setRandomSectionIndex(randomIndex);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const renderGroups = (groups) =>
    groups.map((group) => (
      <li key={group.g_no} onClick={() => navigate(`/group/${group.g_no}`)}>
        <img
          src={group.g_img_name || "/img/default.png"}
          alt={group.g_name}
        />
        <span>{group.g_name}</span>
        <br />
        <span>
          <strong>{group.memberCount}명</strong>이 함께하고 있어요.<br />          
        </span>
        <span className="group_tag">
          #{group.g_category} #{group.g_location}
        </span>
      </li>
  ));

  
  const renderRandomSection = () => {
    const isLoggedIn = !!localStorage.getItem("m_no"); // 로그인 여부 확인
  
    if (!isLoggedIn) {
      // 로그인하지 않은 경우, case 0만 보여줌
      return (
        <div>
          <div className="header_container">
            <h2 className="all_group_text">활동이 활발한 모임</h2>
            <a href="/group/all"><p className="view_all">전체보기 &gt;</p></a>
          </div>
          <div className="premium_list">
            <ul>{renderGroups(popularGroups)}</ul>
          </div>
        </div>
      );
    }
  
    // 로그인한 경우, 랜덤 섹션 렌더링
    switch (randomSectionIndex) {
      case 0:
        return (
          <div>
            <div className="header_container">
              <h2 className="all_group_text">활동이 활발한 모임</h2>
              <a href="/group/all"><p className="view_all">전체보기 &gt;</p></a>
            </div>
            <div className="premium_list">
              <ul>{renderGroups(popularGroups)}</ul>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="header_container">
              <h2 className="all_group_text">당신이 좋아하는 카테고리 모임</h2>
              <a href="/group/all"><p className="view_all">전체보기 &gt;</p></a>
            </div>
            <div className="premium_list">
              <ul>{renderGroups(categoryGroups)}</ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="header_container">
              <h2 className="all_group_text">당신의 지역 모임</h2>
              <a href="/group/all"><p className="view_all">전체보기 &gt;</p></a>
            </div>
            <div className="premium_list">
              <ul>{renderGroups(locationGroups)}</ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return <div>{renderRandomSection()}</div>;
};

export default MatchingGroup;
