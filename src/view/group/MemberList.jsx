import React, { useState } from "react";
import ProfileModal from "./ProfileModal";

const MemberList = ({ loading, members, getMemberGrade }) => {
  const [selectedMember, setSelectedMember] = useState(null); // 클릭된 멤버 정보
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [filterByMember, setFilterByMember] = useState(null); // 필터링할 멤버의 m_no

  const handleMemberClick = (member) => {
    setSelectedMember(member); // 클릭된 멤버 정보 저장
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setSelectedMember(null); // 선택된 멤버 초기화
    setIsModalOpen(false); // 모달 닫기
  };

  const filterPostsByMember = (m_no) => {
    setFilterByMember(m_no); // 특정 멤버로 필터링
  };
  
  return (
    <div className="member_list_wrap">
      <div className="member_list">
        <h4>멤버 목록</h4>
        {loading ? (
          <p>로딩 중...</p>
        ) : members.length > 0 ? (
          members
            .filter((member) => member.g_m_role !== 0)
            .map((member) => (
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
                <p className="member_nick" onClick={() => handleMemberClick(member)}>
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
                </p>
                <ProfileModal member={selectedMember} isOpen={isModalOpen} onClose={closeModal} filterPostsByMember={filterPostsByMember} />
              </div>
            ))
        ) : (
          <p>멤버가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MemberList;
