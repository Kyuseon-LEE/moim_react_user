import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RandomGroup = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/group/all");
        const allGroups = response.data;

        const shuffledGroups = allGroups.sort(() => Math.random() - 0.5);

        setGroups(shuffledGroups.slice(0, 8));
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <>
      <div className="header_container">
        <h2 className="all_group_text">이런 모임을 찾고 있나요?</h2>
        <a href="/group/all"><p className="view_all">전체보기 &gt;</p></a>
      </div>
      <div className="random_list">
        <ul>
          {groups.map((group) => (
            <li key={group.g_no} onClick={() => navigate(`/group/${group.g_no}`)}>
              <img
                src={group.g_img_name || `${process.env.PUBLIC_URL}/img/exam.png`}
                alt={group.g_name}
              />
              <span className="all_group_name">{group.g_name}</span>
              <span className="all_group_info">{group.g_info}</span>              
              <span className="all_group_info">#{group.g_category} #{group.g_location}</span>              
              <span
                style={{ cursor: "pointer" }}
                
              >
                모임 바로가기
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default RandomGroup;
