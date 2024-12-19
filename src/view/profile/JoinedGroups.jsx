import React, { useState, useEffect } from "react";
import instance from '../../api/axios';
import { useParams } from "react-router-dom";

const JoinedGroups = () => {

  const [memberInfo, setMemberInfo] = useState('');
  const [groups, setGroups] = useState([]);
  const userId = memberInfo?.m_id || memberInfo?.m_social_id;
  const [error, setError] = useState(null);


  const handleKickMember = async (g_no, m_no) => {
    const confirmKick = window.confirm("해당 모임을 탈퇴하시겠습니까?");
    if (!confirmKick) {
      return;
    }
  
    console.log("탈퇴 요청 데이터:", { g_no, m_no });
  
    if (!g_no || !m_no) {
      alert("잘못된 요청입니다.");
      return;
    }
  
    try {
      const response = await fetch(`http://3.34.115.75:5000/group/${g_no}/kick`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m_no }),
      });
  
      const data = await response.json();
  
      console.log("서버 응답:", data);
  
      if (data.success) {
        alert("해당 모임을 탈퇴했습니다.");
        setGroups((prevGroups) => prevGroups.filter((group) => group.g_no !== g_no)); // UI 업데이트
      } else {
        alert(data.message || "탈퇴 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("탈퇴 요청 오류:", error);
      alert("탈퇴 처리 중 오류가 발생했습니다.");
    }
  };
  

  // 회원 정보 가져오기
  useEffect(() => {
    instance.post('/member/getMemberInfo')
        .then(response => {
            console.log("성공적으로 사용자의 정보를 가져왔습니다.");
            setMemberInfo(response.data.memberDtos);
        })
        .catch(err => {
            console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
        });
  }, []);

   // 그룹 정보 가져오기
   useEffect(() => {
   
    console.log("Fetching groups for user ID:", userId); // 사용자 ID 확인
  
    // Node.js 서버에 요청
    fetch(`http://3.34.115.75:5000/group/user-groups/${userId}`, {
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
    <tbody>
      {groups.length > 0 ? (
        groups
          .filter((group) => group.g_m_role === 1 || group.g_m_role === 2) // g_m_role 조건 추가
          .map((group, index) => (
            <tr key={index}>
              <td>
                <img
                  src={group.g_img_name}
                  alt="그룹 이미지"
                  className="my_group_image"
                />
              </td>
              <td>{group.g_name}</td>
              <td>{group.g_location}</td>
              <td>{group.g_category}</td>
              <td>{group.memberCount}명</td>
              <td>{group.g_m_role === 1 ? "일반 회원" : "간부 회원"}</td>
              <td
                style={{ cursor: "pointer" }}  
                onClick={() => handleKickMember(group.g_no, memberInfo.m_no)}              
              >
                탈퇴
              </td>

            </tr>
          ))
      ) : (
        <tr>
          
        </tr>
      )}
    </tbody>
  );  
};

export default JoinedGroups;
