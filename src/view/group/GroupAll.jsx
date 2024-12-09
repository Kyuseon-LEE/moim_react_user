import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/group/group_all.css";

const GroupAll = () => {
  const [groups, setGroups] = useState([]); // 전체 그룹 데이터
  const [filteredGroups, setFilteredGroups] = useState([]); // 필터링된 그룹 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/group/all");
        const allGroups = response.data;

        // 기본 정렬: 등록일 기준 오름차순
        const sortedGroups = allGroups.sort(
          (a, b) => new Date(a.g_reg_date) - new Date(b.g_reg_date)
        );

        setGroups(sortedGroups);
        setFilteredGroups(sortedGroups); // 초기에는 모든 그룹을 표시
        setLoading(false); // 로딩 완료
      } catch (err) {
        console.error("Error fetching group data:", err.message);
        setError("그룹 정보를 가져오는데 실패했습니다.");
        setLoading(false); // 로딩 완료
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (g_no) => {
    navigate(`/group/${g_no}`); // 특정 그룹 페이지로 이동
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // 선택된 카테고리 상태 업데이트

    if (category === "전체") {
      // "전체보기" 선택 시 모든 그룹 표시
      setFilteredGroups(groups);
    } else {
      // 선택된 카테고리에 해당하는 그룹 필터링
      const filtered = groups.filter((group) => group.g_category === category);
      setFilteredGroups(filtered);
    }
  };

  if (loading) {
    return <p></p>;
  }

  if (error) {
    return <p></p>;
  }

  return (
    <article className="all_article">
      <h1>모든 모임</h1>
      <div className="group_all">
        <div className="all_category_list">
          <h3>주제 별 모임을 찾아보세요</h3>
          <ul className="all_group_category">
            <li onClick={() => handleCategoryClick("전체")}>
              <img src="/img/all.jpg" alt="all" />
              <br />
              전체
            </li>
            <li onClick={() => handleCategoryClick("여행")}>
              <img src="/img/trip.jpg" alt="trip" />
              <br />
              여행
            </li>
            <li onClick={() => handleCategoryClick("운동")}>
              <img src="/img/working.jpg" alt="working" />
              <br />
              운동
            </li>
            <li onClick={() => handleCategoryClick("문화/공연")}>
              <img src="/img/culture.jpg" alt="culture" />
              <br />
              문화/공연
            </li>
            <li onClick={() => handleCategoryClick("음악")}>
              <img src="/img/music.jpg" alt="music" />
              <br />
              음악
            </li>
            <li onClick={() => handleCategoryClick("게임")}>
              <img src="/img/game.jpg" alt="game" />
              <br />
              게임
            </li>
            <li onClick={() => handleCategoryClick("사진")}>
              <img src="/img/photo.jpg" alt="photo" />
              <br />
              사진
            </li>
            <li onClick={() => handleCategoryClick("요리")}>
              <img src="/img/cook.jpg" alt="cook" />
              <br />
              요리
            </li>
          </ul>
        </div>

        {filteredGroups.length > 0 ? (
        <>
          <h2 className="select_category_name">{selectedCategory}</h2>
         
          <ul className="group_list">
            {filteredGroups.map((group) => (
              <li
                key={group.g_no}
                className="group_item"
                onClick={() => handleGroupClick(group.g_no)}
              >
                <img
                  src={group.g_img_name || "/img/default.png"}
                  alt={group.g_name}
                  className="group_image"
                />
                <div className="group_details">
                  <h3 className="group_name">{group.g_name}</h3>
                  <p className="group_info">{group.g_info}</p>
                  <div className="group_meta">
                    <div className="all_info">
                      <span className="group_all_location">
                        #{group.g_location}
                      </span>
                      <span className="group_all_category">
                        #{group.g_category}
                      </span>
                      <br />
                    </div>
                    <span className="group_member_count">
                      멤버 {group.memberCount || 0}명
                    </span>
                    <span className="group_leader">
                      리더 {group.g_master_nickname}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          </>
        ) : (
        <>
          <h2>{selectedCategory}</h2>  
          <p className="no_groups_message">해당하는 모임이 없습니다.</p>
        </>
        )}
      </div>
      
    </article>
  );
};

export default GroupAll;
