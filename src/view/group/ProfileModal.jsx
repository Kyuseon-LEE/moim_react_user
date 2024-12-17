import React from "react";
import "../../css/group/profile_modal.css";

const ProfileModal = ({ member, isOpen, onClose, filterPostsByMember }) => {
  if (!isOpen) return null; // 모달이 열리지 않으면 아무것도 렌더링하지 않음

  const handleViewPosts = () => {
    filterPostsByMember(member.m_no); // 특정 멤버의 게시글 필터링
    onClose(); // 모달 닫기
  };

  return (
    <div className="profile_modal">
      <div className="modal_overlay" onClick={onClose}></div>
      <div className="profile_modal_content">
        <div className="profile_header">
          <img
            src={member.m_profile_img || `${process.env.PUBLIC_URL}/img/profile_default.png`}
            alt="Profile"
            className="profile_image"
          />
          <h3 className="profile_name">{member.m_nickname}</h3>
          <p className="profile_role">
            {{
              1: "일반 회원",
              2: "간부 회원",
              3: "모임장"
            }[member.g_m_role] || "알 수 없음"}
          </p>
          <p className="profile_mail">{member.m_mail}</p>
        </div>
        <div className="profile_info">
          <p>카테고리: {member.m_category}</p>
          <p>
            가입일:{" "}
            {member.g_reg_date
              ? new Date(member.g_reg_date).toLocaleDateString()
              : "-"}
          </p>

        </div>
        <div className="modal_buttons">
          <button className="modal_button modal_button_close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
