import '../../css/group/group_home.css';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GroupHome = () => { 
  const { g_no } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/group/${g_no}`);
        if (!response.ok) {
          throw new Error("Failed to fetch group data");
        }
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.error("Error fetching group data:", error.message);
      }
    };

    fetchGroupData();
  }, [g_no]);

  if (!group) {
    return <p>Loading...</p>;
  }

  return (
    <article className="home_article">
        <div className="home_nav">
            <ul>
              <li>게시글</li>
              <li>일정</li>
              <li>채팅방</li>
              <li>멤버</li>
            </ul>
        </div>
        <div className="home_wrap">
      <h1>{group.g_name}</h1>
      <p>{group.g_info}</p>
      <p>카테고리: {group.g_category}</p>
      <p>위치: {group.g_location}</p>
      <p>최대 인원: {group.g_max_number}</p>
      <img src={`http://localhost:5000/uploads/${group.g_img_name}`} alt={group.g_name} />
    </div>  
    </article>
  );
};

export default GroupHome;
