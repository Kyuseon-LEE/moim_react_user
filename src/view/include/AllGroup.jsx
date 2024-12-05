import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Article2 = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/group/all");
        const allGroups = response.data;

        // 데이터 랜덤 섞기
        const shuffledGroups = allGroups.sort(() => Math.random() - 0.5);

        // 최대 8개 선택
        setGroups(shuffledGroups.slice(0, 9));
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <>
      <h2 className="all_group_text">이런 활동을 찾고 있나요?</h2>
      <div className="random_list">
        <ul>
          {groups.map((group) => (
            <li key={group.g_no}>
              <img
                src={group.g_img_name || `${process.env.PUBLIC_URL}/img/exam.png`}
                alt={group.g_name}
              />
              <span className="all_group_name">{group.g_name}</span>
              <br />
              <span className="all_group_info">{group.g_info}</span>
              <br />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/group/${group.g_no}`)}
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

export default Article2;
