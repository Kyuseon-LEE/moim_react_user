import React, { useState, useEffect } from "react";
import "../../css/group/group_setting.css";

const GroupSettingsModal = ({ isOpen, onClose, groupData, onSettingsUpdated }) => {
  const [updatedGroupData, setUpdatedGroupData] = useState({ ...groupData });

  const categories = ["여행", "운동", "문화/공연", "음악", "게임", "사진", "요리"]; // 주제 목록

  useEffect(() => {
    if (isOpen) {
      setUpdatedGroupData(groupData);
    }
  }, [isOpen, groupData]);
  

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedGroupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://3.34.115.75:5000/group/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const data = await response.json();
      if (data.success && data.filePath) {
        setUpdatedGroupData((prev) => ({
          ...prev,
          g_img_name: data.filePath,
        }));
        alert("이미지 업로드 성공");
      } else {
        alert("이미지 업로드 실패: 서버 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error.message);
      alert("이미지 업로드 실패");
    }
  };

  // 수정 내용 저장 핸들러
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://3.34.115.75:5000/group/${groupData.g_no}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGroupData),
      });

      if (!response.ok) {
        throw new Error("그룹 정보 업데이트 실패");
      }

      alert("그룹 정보가 성공적으로 업데이트되었습니다.");
      onSettingsUpdated(updatedGroupData);
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("그룹 정보 업데이트 오류:", error.message);
      alert("그룹 정보 업데이트 실패");
    }
  };

  // 모달이 닫혀 있으면 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  return (
    <div className="group_modal">
      <div className="group_modal_contents">
        <h3>그룹 설정</h3>
        <label>
          그룹 이름:
          <input
            type="text"
            name="g_name"
            value={updatedGroupData.g_name || ""}
            onChange={handleInputChange}
          />
        </label>
        <label>
          그룹 소개:
          <textarea
            name="g_info"
            value={updatedGroupData.g_info || ""}
            onChange={handleInputChange}
          />
        </label>
        <label>
          카테고리:
          <select
            name="g_category"
            value={updatedGroupData.g_category || ""}
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          최대인원:
          <select
            name="g_max_number"
            value={updatedGroupData.g_max_number || ""}
            onChange={handleInputChange}
          >
            {[...Array(groupData.g_status === 1 ? 41 : 21).keys()].map((i) => (
              <option key={i + 10} value={i + 10}>
                {i + 10}명
              </option>
            ))}
          </select>
        </label>

        <label>
          공개 여부:
          <select
            name="g_public"
            value={updatedGroupData.g_public}
            onChange={handleInputChange}
          >
            <option value="1">공개</option>
            <option value="0">비공개</option>
          </select>
        </label>
        <label>
          가입 확인 여부:
          <select
            name="g_confirm"
            value={updatedGroupData.g_confirm}
            onChange={handleInputChange}
          >
            <option value="1">즉시 가입</option>
            <option value="2">승인 후 가입</option>
          </select>
        </label>
        <label>
          가입 여부:
          <select
            name="g_regist"
            value={updatedGroupData.g_regist}
            onChange={handleInputChange}
          >
            <option value="1">가입 가능</option>
            <option value="0">가입 불가</option>
          </select>
        </label>
        <label>
          그룹 프로필:
          <input type="file" onChange={handleImageUpload} />
          {updatedGroupData.g_img_name && (
            <img
              src={updatedGroupData.g_img_name}
              alt="Group Profile"
              style={{ maxWidth: "100px", maxHeight: "100px", marginTop: "10px" }}
            />
          )}
        </label>
        <div className="modal_buttons">
          <button onClick={handleSaveChanges}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
