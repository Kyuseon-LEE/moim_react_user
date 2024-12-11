import React, { useEffect, useState } from "react";
import '../../css/profile/my_group_list.css';
import Nav from './Nav';
import instance from '../../api/axios';
import JoinedGroups from "./JoinedGroups";
import PendingGroups from "./PendingGroups";

const MyGroupList = ({ memberInfo, setMemberInfo }) => {
  const [groups, setGroups] = useState([]); // 그룹 데이터 상태
  const [error, setError] = useState(null);
  const [membershipState, setMembershipState] = useState(false);
  const [toggleState, setToggleState] = useState({});
  const [selectedTab, setSelectedTab] = useState("managed"); // 탭 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedGroup, setSelectedGroup] = useState(null); // 선택된 그룹 정보


  const managedGroups = groups.filter((group) => group.type === "managed");
  const joinedGroups = groups.filter((group) => group.type === "joined");
  const pendingGroups = groups.filter((group) => group.type === "pending");

  // 그룹 정보 들고오기
  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    instance.post('/group/getMyGroup', { accessToken: accessToken })
      .then(response => {
        console.log("나의 그룹 가져오기 성공---->", response.data.groupDtos);
        let group = response.data.groupDtos;
        setGroups(group);

        // 토글 상태 설정
        const initialToggleState = group.reduce((acc, curr) => {
          acc[curr.g_no] = curr.g_status === 1;
          return acc;
        }, {});
        setToggleState(initialToggleState);
      })
      .catch(err => {
        console.log("나의 그룹 가져오기 실패", err);
      });
  }, []);

  // 멤버 정보 들고오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await instance.post('/member/getMemberInfo');
        setMemberInfo(response.data.memberDtos);
        let m_grade = response.data.memberDtos.m_grade;
        if (m_grade === 1) {
          setMembershipState(true);
        } else {
          setMembershipState(false);
        }
      } catch (err) {
        console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
      }
    };

    fetchMemberInfo();
  }, []);

  // 토글 스위칭
  const handleToggle = (g_no) => {
    if (!membershipState) {
      alert("프리미엄 멤버만 사용할 수 있습니다.");
      return;
    }

    const newState = !toggleState[g_no];

    setToggleState((prevStates) => ({
      ...prevStates,
      [g_no]: !prevStates[g_no] // 해당 그룹의 토글 상태만 반전
    }));

    const newStatus = newState ? 1 : 0;
    instance.post(`/group/updateGroupStatus`, { g_no, g_status: newStatus })
      .then(response => {
        console.log("그룹 상태 업데이트 성공", response.data);
      })
      .catch(err => {
        console.log("그룹 상태 업데이트 실패", err);
        setToggleState((prevStates) => ({
          ...prevStates,
          [g_no]: !newState,
        }));
      });
  };

  const handleDeleteClick = (group) => {
    setSelectedGroup(group); // 삭제할 그룹 설정
    setIsModalOpen(true); // 모달 열기
  };
  
  const confirmDeleteGroup = async () => {
    if (!selectedGroup) return;
  
    try {
      const response = await fetch(`http://localhost:5000/group/${selectedGroup.g_no}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("그룹이 삭제되었습니다.");
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group.g_no !== selectedGroup.g_no)
        ); // UI 업데이트
      } else {
        alert(data.message || "그룹 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("그룹 삭제 오류:", error);
      alert("그룹 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsModalOpen(false); // 모달 닫기
      setSelectedGroup(null); // 선택된 그룹 초기화
    }
  };
  
  

  const renderTable = () => {
    switch (selectedTab) {
      case "managed":
        return (
          <tbody>
            {groups.length > 0 ? (
              groups.map((group, index) => (
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
                  <td>
                    <div className="premium">
                      <div
                        className={`toggle-switch ${toggleState[group.g_no] ? "on" : "off"}`}
                        onClick={() => handleToggle(group.g_no)}
                      >
                        <div className="slider"></div>
                      </div>
                    </div>
                  </td>
                  <td 
                    style={{ cursor: "pointer" }} onClick={() => handleDeleteClick(group)}>
                    그룹 삭제
                  </td>
                  {isModalOpen && (
                    <div className="modal">
                      <div className="modal-content">
                        <p>정말로 "{selectedGroup?.g_name}" 그룹을 삭제하시겠습니까?<br />
                        모임장이 그룹 삭제 시 모든 데이터가 사라집니다.</p>
                        <div className="modal-buttons">
                          <button onClick={confirmDeleteGroup}>삭제</button>
                          <button onClick={() => setIsModalOpen(false)}>취소</button>
                        </div>
                      </div>
                    </div>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>

          
        );
      case "joined":
        return <JoinedGroups groups={joinedGroups} />;
      case "pending":
        return <PendingGroups groups={pendingGroups} />;
      default:
        return null;
    }
  };

  return (
    <article className="my_group_article">
      <div className="my_group_article_wrap">
        <Nav />      

        <div className="my_group_list">
        <div className="tab_navigation">
          <h2
            className={selectedTab === "managed" ? "active" : ""}
            onClick={() => setSelectedTab("managed")}
          >
            내가 관리하는 그룹
          </h2>
          <h2
            className={selectedTab === "joined" ? "active" : ""}
            onClick={() => setSelectedTab("joined")}
          >
            내가 속한 그룹
          </h2>
          <h2
            className={selectedTab === "pending" ? "active" : ""}
            onClick={() => setSelectedTab("pending")}
          >
            가입 대기중인 그룹
          </h2>
        </div>
        <table className="group_table">
          <thead>
            {selectedTab === "managed" && (
              <tr>
                <th>이미지</th>
                <th>그룹 이름</th>
                <th>위치</th>
                <th>카테고리</th>
                <th>멤버 수</th>
                <th>프리미엄 여부</th>
                <th>삭제</th>
              </tr>
            )}
            {selectedTab === "joined" && (
              <tr>
                <th>이미지</th>
                <th>그룹 이름</th>
                <th>위치</th>
                <th>카테고리</th>
                <th>멤버 수</th>
                <th>그룹 역할</th>
                <th>그룹 탈퇴</th>
              </tr>
            )}
            {selectedTab === "pending" && (
              <tr>
                <th>이미지</th>
                <th>그룹 이름</th>
                <th>위치</th>
                <th>카테고리</th>
                <th>승인 여부</th>
                <th>취소</th>
              </tr>
            )}
          </thead>
          {renderTable()}
      </table>

        </div>
      </div>
    </article>

    
  );
};

export default MyGroupList;