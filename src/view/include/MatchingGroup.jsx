import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import instance from '../../api/axios';

const MatchingGroup = () => {
  const [popularGroups, setPopularGroups] = useState([]);
  const [categoryGroups, setCategoryGroups] = useState([]);
  const [locationGroups, setLocationGroups] = useState([]);
  const [randomSectionIndex, setRandomSectionIndex] = useState(null); // 랜덤 섹션 인덱스
  const [memberInfo, setMemberInfo] = useState('null');
  const navigate = useNavigate();

  const extractRegion = (address) => {
    if (!address) return null;
    const parts = address.trim().split(/\s+/);
    if (parts.length >= 3) {
      return `${parts[1]} ${parts[2]}`;
    }
    return null;
  };

  const userRegion = memberInfo?.m_address ? extractRegion(memberInfo.m_address) : null;

  // 회원 정보 가져오기
  useEffect(() => {
    instance.post('/member/getMemberInfo')
        .then(response => {
            if (response.data?.memberDtos) {
                console.log("성공적으로 사용자의 정보를 가져왔습니다.");
                setMemberInfo(response.data.memberDtos);
            } else {
                console.warn("로그인하지 않은 사용자입니다.");
                setMemberInfo(null); // 비로그인 상태로 설정
            }
        })
        .catch(err => {
            console.warn("비로그인 상태로 인해 회원 정보를 가져올 수 없습니다.");
            setMemberInfo(null); // 비로그인 상태로 설정
        });
}, []);


useEffect(() => {
  const fetchGroups = async () => {
      try {
          const response = await axios.get("http://3.34.115.75:5000/group/all");
          const allGroups = response.data || [];

          const sortedGroups = allGroups
              .sort((a, b) => b.memberCount - a.memberCount)
              .slice(0, 5);

          const categoryMatchedGroups = memberInfo?.m_category
              ? allGroups
                    .filter((group) =>
                        memberInfo.m_category
                            .split(",")
                            .map((category) => category.trim())
                            .some((userCategory) => group.g_category === userCategory)
                    )
                    .slice(0, 5)
              : [];

          const locationMatchedGroups = userRegion
              ? allGroups
                    .filter((group) => group.g_location === userRegion)
                    .slice(0, 5)
              : [];

          setPopularGroups(sortedGroups);
          setCategoryGroups(categoryMatchedGroups);
          setLocationGroups(locationMatchedGroups);

          const randomIndex = Math.floor(Math.random() * 3); // 랜덤 인덱스
          setRandomSectionIndex(randomIndex);
      } catch (error) {
          console.error("Error fetching groups:", error);
      }
  };

  fetchGroups();
}, [memberInfo, userRegion]);



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
          {group.g_status === 1 ? (
              <>
                  &nbsp;#프리미엄 
              </>
          ) : null}
        </span>
      </li>
  ));

  
  const renderRandomSection = () => {
    const isLoggedIn = !!memberInfo // 로그인 여부 확인
  
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
              <a href="/group/all">
                <p className="view_all">전체보기 &gt;</p>
              </a>
            </div>
            <div className="premium_list">
              {popularGroups.length > 0 ? (
                <ul>{renderGroups(popularGroups)}</ul>
              ) : (
                <p className="no_groups">활동이 활발한 모임이 없습니다.</p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="header_container">
              <h2 className="all_group_text">당신이 좋아하는 카테고리 모임</h2>
              <a href="/group/all">
                <p className="view_all">전체보기 &gt;</p>
              </a>
            </div>
            <div className="premium_list">
              {categoryGroups.length > 0 ? (
                <ul>{renderGroups(categoryGroups)}</ul>
              ) : (
                <p className="no_groups">
                  당신이 좋아하는 카테고리 모임이 없습니다.
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="header_container">
              <h2 className="all_group_text">당신의 지역 모임</h2>
              <a href="/group/all">
                <p className="view_all">전체보기 &gt;</p>
              </a>
            </div>
            <div className="premium_list">
              {locationGroups.length > 0 ? (
                <ul>{renderGroups(locationGroups)}</ul>
              ) : (
                <p className="no_groups">당신의 지역 모임이 없습니다.</p>
              )}
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
