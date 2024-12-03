import React from "react";

const MemberList = ({ loading, members, getMemberGrade }) => {
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
                </p>
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
