import React, { useEffect, useState } from "react";
import '../../css/profile/my_group_list.css';
import "../../css/profile/profile.css";
import Nav from './Nav';

const MyGroupList = () => {
  const [groups, setGroups] = useState([]); // 그룹 데이터 상태
  const userId = localStorage.getItem("m_id")
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching groups for user ID:", userId); // 사용자 ID 확인
  
    // Node.js 서버에 요청
    fetch(`http://localhost:5000/group/user-groups/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // JSON 요청임을 명시
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched group data from Node.js:", data); // Node.js에서 가져온 데이터 확인
        setGroups(data); // 그룹 데이터 상태 업데이트
      })
      .catch((error) => {
        console.error("Error occurred while fetching groups:", error.message);
        setError("그룹 정보를 가져올 수 없습니다."); // 오류 메시지 설정
      });
  }, [userId]);


  return (    
    <article className="my_group_article">
        <div className="my_group_article_wrap">
        <Nav />
            <div className="my_group_list">
            
            <h2>내가 관리하는 그룹</h2>
            <table className="group_table">
                <thead>
                    <tr>
                    <th></th>
                    <th>그룹 이름</th>
                    <th>위치</th>
                    <th>카테고리</th>
                    <th>멤버 수</th>
                    <th>프리미엄 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {groups
                    .filter((group) => group.g_m_role === 3)
                    .map((group) => (
                        <tr key={group.g_no}>
                        <td>
                            <img
                            src={group.g_img_name}
                            alt="그룹이미지"
                            className="my_group_image"
                            />
                        </td>
                        <td>{group.g_name}</td>
                        <td>{group.g_location}</td>
                        <td>{group.g_category}</td>
                        <td>{group.memberCount}명</td>
                        <td>on/off</td>
                        </tr>
                    ))}
                </tbody>
                </table>
                {groups.filter((group) => group.g_m_role === 3).length === 0 && (
                <p>관리하는 그룹이 없습니다.</p>
                )}

            {groups.filter((group) => group.g_m_role === 3).length === 0 && (
                <p>관리하는 그룹이 없습니다.</p>
            )}
            </div>
        </div>
    </article>
  );
  
};

export default MyGroupList;
