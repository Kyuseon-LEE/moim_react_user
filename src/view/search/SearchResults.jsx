import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/search/search_result.css";

const SearchResults = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const location = useLocation(); // 현재 URL의 정보를 가져옴

  const parseQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      location: searchParams.get("location") || "",
      category: searchParams.get("category") || "",
      query: searchParams.get("query") || "",
    };
  };

  const handleGroupClick = (g_no) => {
    navigate(`/group/${g_no}`); // 특정 그룹 페이지로 이동
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const { location, category, query } = parseQueryParams();

      try {
        const response = await axios.get("http://localhost:5000/group/all");
        const allGroups = response.data;

        // 필터링 조건 적용
        const filteredGroups = allGroups.filter((group) => {
          const matchesLocation =
            !location || group.g_location.includes(location);
          const matchesCategory =
            !category || group.g_category === category;
          const matchesQuery =
            !query || group.g_name.toLowerCase().includes(query.toLowerCase());

          return matchesLocation && matchesCategory && matchesQuery;
        });

        setGroups(filteredGroups);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching groups:", err.message);
        setError("검색 결과를 가져오지 못했습니다.");
        setLoading(false);
      }
    };

    fetchGroups();
  }, [location.search]); // 쿼리 파라미터가 변경될 때마다 실행

  if (loading) {
    return <p>검색 중입니다...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <article className="search_article">
      <div className="search_results">
        <h1>검색 결과</h1>
        {groups.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (      
          <> 
            <p className="result_count">
               검색 결과 {groups.length}건
            </p>
            <ul className="group_list">
              {groups.map((group) => (
                <li key={group.g_no} className="group_item"
                onClick={() => handleGroupClick(group.g_no)}>
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
        )}
      </div>
    </article>
  );
};

export default SearchResults;
