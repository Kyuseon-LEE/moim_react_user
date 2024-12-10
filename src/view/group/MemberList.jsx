import React, { useState } from "react";
import ProfileModal from "./ProfileModal";

const MemberList = ({ loading, members, getMemberGrade, gMRole, g_no }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); 
  const [selectedRoleMember, setSelectedRoleMember] = useState(null); 
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedMemberRole, setSelectedMemberRole] = useState(null);
  const [activeSection, setActiveSection] = useState("members");
  const [searchQuery, setSearchQuery] = useState("");

  // 프로필 모달 열기
  const openProfileModal = (member) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  // 프로필 모달 닫기
  const closeProfileModal = () => {
    setSelectedMember(null);
    setIsProfileModalOpen(false);
  };

  // 등급 관리 모달 열기
  const openRoleModal = (member) => {
    setSelectedRoleMember(member);
    setSelectedMemberRole(member.g_m_role); // 현재 멤버의 역할 설정
    setIsRoleModalOpen(true);
  };

  // 등급 관리 모달 닫기
  const closeRoleModal = () => {
    setSelectedRoleMember(null);
    setSelectedMemberRole(null);
    setIsRoleModalOpen(false);
  };

  // 등급 변경 요청
  const handleRoleChange = async (m_no, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/update-role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m_no, g_m_role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        alert("등급이 성공적으로 변경되었습니다.");
        setSelectedMemberRole(newRole); // 로컬 상태 업데이트
        window.location.reload(); // 변경된 등급을 반영하기 위해 새로고침
      } else {
        alert(data.message || "등급 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("등급 변경 오류:", error);
      alert("등급 변경 중 오류가 발생했습니다.");
    }
  };

  // 강퇴 요청
  const handleKickMember = async (m_no) => {
    const confirmKick = window.confirm("해당 멤버를 강퇴하시겠습니까?");
    if (!confirmKick) {
      return;
    }

    console.log("강퇴 요청 데이터:", { g_no, m_no });

    if (!g_no || !m_no) {
      alert("잘못된 요청입니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/kick`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m_no }),
      });

      const data = await response.json();

      console.log("서버 응답:", data);

      if (data.success) {
        alert("해당 멤버를 강퇴했습니다.");
        window.location.reload();
      } else {
        alert(data.message || "강퇴 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("강퇴 요청 오류:", error);
      alert("강퇴 처리 중 오류가 발생했습니다.");
    }
  };

  const handleApproveMember = async (m_no) => {
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/update-role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m_no, g_m_role: 1 }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("회원 승인이 완료되었습니다.");
        window.location.reload(); // 변경된 데이터를 반영하기 위해 새로고침
      } else {
        alert(data.message || "회원 승인에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원 승인 오류:", error);
      alert("회원 승인 처리 중 오류가 발생했습니다.");
    }
  };
  
  const handleRejectMember = async (m_no) => {
    const confirmReject = window.confirm("해당 멤버를 거절하시겠습니까?");
    if (!confirmReject) return;
  
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/kick`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m_no }),
      });

  
      const data = await response.json();
  
      if (data.success) {
        alert("멤버가 성공적으로 거절되었습니다.");
        window.location.reload(); // 변경된 데이터를 반영하기 위해 새로고침
      } else {
        alert(data.message || "거절 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("거절 요청 오류:", error);
      alert("거절 처리 중 오류가 발생했습니다.");
    }
  };
  // 멤버 검색
  const filteredMembers = members.filter(
    (member) =>
      member.g_m_role !== 0 && // 가입된 멤버만 필터링
      (!searchQuery || // 검색어가 없거나
        member.m_nickname.toLowerCase().includes(searchQuery.toLowerCase())) // 닉네임에 검색어 포함
  );

  const filteredPendingMembers = members.filter(
    (member) =>
      member.g_m_role === 0 && // 대기중인 멤버만 필터링
      (!searchQuery || // 검색어가 없거나
        member.m_nickname.toLowerCase().includes(searchQuery.toLowerCase())) // 닉네임에 검색어 포함
  );
  
  return (
    <>
      <div className="member_search">
        <h3>
          멤버 {filteredMembers.length}
        </h3>
        <div className="search_input">
          <input
            type="text"
            placeholder="멤버검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="member_list_wrap">
        <div className="member_list">
          <h4
            className={`toggle_section ${
              activeSection === "members" ? "active" : ""
            }`}
            onClick={() => setActiveSection("members")}
          >
            멤버 목록
          </h4>
          {gMRole === 3 && (
            <h4
              className={`toggle_section ${
                activeSection === "pending" ? "active" : ""
              }`}
              onClick={() => setActiveSection("pending")}
            >
              가입 대기자 목록
            </h4>
          )}

          {activeSection === "members" && (
            <div className="member_section">
              {loading ? (
                <p>로딩 중...</p>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    className="member_info"
                    key={member.m_no || member.g_m_no}
                  >
                    <img
                      src={
                        member.m_profile_img ||
                        `${process.env.PUBLIC_URL}/img/profile_default.png`
                      }
                      alt="Profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`;
                      }}
                      onClick={() => openProfileModal(member)}
                    />
                    <p className="member_nick">
                      {member.m_nickname}
                      <span
                        className={`member_grade ${
                          member.g_m_role === 1
                            ? "role-normal"
                            : member.g_m_role === 2
                            ? "role-manager"
                            : member.g_m_role === 3
                            ? "role-leader"
                            : "role-unknown"
                        }`}
                      >
                        {getMemberGrade(member.g_m_role)}
                      </span>
                      <div className="member_status">
                        {((gMRole === 2 && member.g_m_role === 1) ||
                          (gMRole === 3 && member.g_m_role < 3)) && (
                          <span
                            className="status"
                            onClick={() => handleKickMember(member.m_no)}
                          >
                            강퇴
                          </span>
                        )}
                        {gMRole === 3 && member.g_m_role < 3 && (
                          <span
                            className="status"
                            onClick={() => openRoleModal(member)}
                          >
                            등급 관리
                          </span>
                        )}
                      </div>
                    </p>
                  </div>
                ))
              ) : (
                <p>멤버가 없습니다.</p>
              )}
            </div>
          )}

          {activeSection === "pending" && (
            <div className="pending_section">
              {filteredPendingMembers.length > 0 ? (
                filteredPendingMembers.map((member) => (
                  <div
                    className="member_info"
                    key={member.m_no || member.g_m_no}
                  >
                    <img
                      src={
                        member.m_profile_img ||
                        `${process.env.PUBLIC_URL}/img/profile_default.png`
                      }
                      alt="Profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`;
                      }}
                    />
                    <p className="member_nick">
                      {member.m_nickname}
                      <span className="member_grade role-pending"></span>
                      <span
                        className="member_public"
                        onClick={() => handleRejectMember(member.m_no)}
                      >
                        거절
                      </span>
                      <span
                        className="member_public"
                        onClick={() => handleApproveMember(member.m_no)}
                      >
                        승인
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="no_pending_members">가입 대기자 목록이 없습니다.</p>
              )}
            </div>
          )}
        </div>

        {isProfileModalOpen && selectedMember && (
          <ProfileModal
            member={selectedMember}
            isOpen={isProfileModalOpen}
            onClose={closeProfileModal}
            g_m_role={gMRole}
          />
        )}

        {isRoleModalOpen && selectedRoleMember && (
          <div className="role_modal">
            <div className="modal_overlay" onClick={closeRoleModal}></div>
            <div className="role_modal_content">
              <h4>등급 관리 - {selectedRoleMember.m_nickname}</h4>
              <p>현재 등급: {getMemberGrade(selectedMemberRole)}</p>
              <select
                value={selectedMemberRole}
                onChange={(e) =>
                  setSelectedMemberRole(parseInt(e.target.value))
                }
              >
                <option value={1}>일반 회원</option>
                <option value={2}>간부 회원</option>
              </select>
              <div className="modal_buttons">
                <button
                  onClick={() =>
                    handleRoleChange(selectedRoleMember.m_no, selectedMemberRole)
                  }
                >
                  저장
                </button>
                <button onClick={closeRoleModal}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MemberList;
