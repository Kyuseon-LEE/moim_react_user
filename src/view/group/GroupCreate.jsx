import '../../css/group/create.css';
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const GroupCreate = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSubLocation, setSelectedSubLocation] = useState("");
  const [subLocations, setSubLocations] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupInfo, setGroupInfo] = useState("");
  const [groupConfirm, setGroupConfirm] = useState("1"); // 기본값: 즉시 가입
  const [groupMaxNumber, setGroupMaxNumber] = useState("10"); // 기본값: 10명

  const categories = ["여행", "운동", "문화/공연", "음악", "게임", "사진", "요리"]; // 주제 목록
  const locations = {
    서울: ["서울 강남구", "서울 강동구", "서울 강북구", "서울 강서구", "서울 관악구", "서울 광진구", "서울 구로구", "서울 금천구", "서울 노원구", "서울 도봉구", "서울 동대문구", "서울 동작구", "서울 마포구", "서울 서대문구",
      "서울 서초구", "서울 성동구", "서울 성북구", "서울 송파구", "서울 양천구", "서울 영등포구", "서울 용산구", "서울 은평구", "서울 종로구", "서울 중구", "서울 중랑구" 
  ],
  부산: ["부산 강서구", "부산 금정구", "부산 기장군", "부산 남구", "부산 동구", "부산 동래구", "부산 부산진구", "부산 북구", "부산 사상구",
      "부산 사하구", "부산 서구", "부산 수영구", "부산 연제구", "부산 영도구","부산 중구", "부산 해운대구"
  ],
  대구: ["대구 군위군", "대구 남구", "대구 달서구", "대구 달성군", "대구 동구", "대구 북구", "대구 서구", "대구 수성구", "대구 중구"],
  인천: ["인천 강화군", "인천 계양구", "인천 남동구", "인천 동구", "인천 미추홀구", "인천 부평구", "인천 서구", "인천 연수구", "인천 옹진군", "인천 중구"],
  광주: ["광주 광산구", "광주 남구", "광주 동구", "광주 북구", "광주 서구"],
  대전: ["대전 대덕구", "대전 동구", "대전 서구", "대전 유성구", "대전 중구"],
  울산: ["울산 남구", "울산 동구", "울산 북구", "울산 울주군", "울산 중구"],
  세종: ["세종특별자치시"],
  경기: ["경기 가평군", "경기 고양시", "경기 과천시", "경기 광명시", "경기 광주시", "경기 구리시", "경기 군포시","경기 김포시","경기 남양주시",
      "경기 동두천시", "경기 부천시", "경기 성남시", "경기 수원시", "경기 시흥시", "경기 안산시", "경기 안성시", "경기 안양시", "경기 양주시",
      "경기 양평군", "경기 여주시", "경기 연천군", "경기 오산시", "경기 용인시", "경기 의왕시", "경기 의정부시", "경기 이천시", "경기 파주시",
      "경기 평택시", "경기 포천시", "경기 하남시", "경기 화성시"
  ],
  충북: ["충북 괴산군", "충북 단양군", "충북 보은군", "충북 영동군", "충북 옥천군", "충북 음성군", "충북 제천시", "충북 증평군", "충북 진천군",
      "충북 청주시", "충북 충주시"
  ],
  충남: ["충남 계룡시", "충남 공주시", "충남 금산군", "충남 논산시", "충남 당진시", "충남 보령시", "충남 부여군", "충남 서산시", "충남 서천군",
      "충남 아산시", "충남 예산군", "충남 천안시", "충남 청양군", "충남 태안군", "충남 홍성군"
  ],
  전남: ["전남 강진군", "전남 고흥군", "전남 곡성군", "전남 광양시", "전남 구례군", "전남 나주시", "전남 담양군", "전남 목포시", "전남 무안군",
      "전남 보성군", "전남 순천시", "전남 신안군", "전남 여수시", "전남 영광군", "전남 영암군", "전남 완도군", "전남 장성군", "전남 장흥군",
      "전남 진도군", "전남 함평군", "전남 해남군", "전남 화순군"
  ],
  경북: ["경북 경산시", "경북 경주시", "경북 고령군", "경북 구미시", "경북 김천시", "경북 문경시", "경북 봉화군", "경북 상주시", "경북 성주군",
      "경북 안동시", "경북 영덕군", "경북 영양군", "경북 영주시", "경북 영천시", "경북 예천군", "경북 울릉군", "경북 울진군", "경북 의성군",
      "경북 청도군", "경북 청송군", "경북 칠곡군", "경북 포항시"
  ],
  경남: ["경남 거제시", "경남 거창군", "경남 고성군", "경남 김해시", "경남 남해군", "경남 밀양시", "경남 사천시", "경남 산청군", "경남 양산시",
      "경남 의령군","경남 진주시", "경남 창녕군", "경남 창원시", "경남 통영시", "경남 하동군","경남 함안군","경남 함양군", "경남 합천군"
  ],
  제주: ["제주 서귀포시", "제주 제주시"],
  강원: ["강원 강릉시", "강원 고성군", "강원 동해시", "강원 삼척시", "강원 속초시", "강원 양구군", "강원 양양군", "강원 영월군", "강원 원주시",
      "강원 인제군", "강원 정선군", "강원 철원군", "강원 춘천시", "강원 태백시", "강원 평창군", "강원 홍천군", "강원 화천군", "강원 횡성군"
  ],
  전북: ["전북 고창군", "전북 군산시", "전북 김제시", "전북 남원시", "전북 무주군", "전북 부안군", "전북 순창군", "전북 완주군", "전북 익산시",
      "전북 임실군", "전북 장수군", "전북 전주시", "전북 정읍시", "전북 진안군"
  ],
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }
  
    // 이전 이미지 URL 해제
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  
    // Blob URL 생성 및 미리보기 상태 업데이트
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  
    const formData = new FormData();
    formData.append("image", file);
  
    fetch("http://localhost:5000/group/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success && data.filePath) {
          console.log("SFTP 저장 경로:", data.filePath);
          setUploadedFileName(data.filePath); // SFTP 경로 저장
        } else {
          alert("이미지 업로드 실패: 서버 응답이 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("이미지 업로드 오류:", error.message);
        alert(`이미지 업로드 실패: ${error.message}`);
      });
  };
  
  // 컴포넌트 언마운트 시 Blob URL 해제
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  


  const handleBoxClick = () => {
    document.getElementById("imageInput").click();
  };

  const toggleCategoryModal = () => {
    setIsCategoryModalOpen(!isCategoryModalOpen);
  };

  const toggleLocationModal = () => {
    setIsLocationModalOpen(!isLocationModalOpen);
    if (!isLocationModalOpen) {
      setSelectedLocation(null);
      setSubLocations([]);
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(false);
  };

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setSubLocations(locations[location] || []);
  };

  const selectSubLocation = (subLocation) => {
    setSelectedSubLocation(subLocation);
    setIsLocationModalOpen(false);
  };

  const handleSubmit = () => {
    console.log("Uploaded fileName in handleSubmit:", uploadedFileName); // 확인 로그
    if (!groupName.trim()) {
      alert("모임 제목을 입력해주세요.");
      return;
    }
    if (!selectedCategory.trim()) {
      alert("모임 주제를 선택해주세요.");
      return;
    }
    if (!selectedSubLocation.trim()) {
      alert("모임 지역을 선택해주세요.");
      return;
    }
    if (!groupInfo.trim()) {
      alert("모임 활동 내용을 입력해주세요.");
      return;
    }
    if (!uploadedFileName) {
      alert("모임 대표 이미지를 업로드해주세요.");
      return;
    }
  
    const groupData = {
      g_name: groupName,
      g_info: groupInfo,
      g_category: selectedCategory,
      g_location: selectedSubLocation,
      g_confirm: groupConfirm,
      g_max_number: groupMaxNumber,
      g_img_name: uploadedFileName,
      m_id: localStorage.getItem("m_id"),
    };
  
    console.log("Data being sent to Node.js:", groupData);
  
    fetch("http://localhost:5000/group/create_group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groupData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from Node.js:", data);
        alert("그룹 생성이 완료되었습니다.");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error occurred:", error.message);
        alert(`그룹 생성 실패: ${error.message}`);
      });
  };
  
  return (
    <article className="create_article">
      <div className="create_info_wrap">
        <div className="create_info">
          <h2>모임이란?</h2>
          <p>
            동네 멤버들과 운동, 취미, 스터디 등 목적이 있는 활동을 같이 할 수 있는
            모임입니다.<br />
            함께 할 최소 인원을 정하면 멤버 모집 후 모임이 개설 됩니다.
          </p>
          <img
            src={process.env.PUBLIC_URL + "/img/image.png"}
            alt="exam"
          />
        </div>
      </div>
      <div className="create_article_wrap">
        <div className="create_box">
        <input
            type="text"
            placeholder="제목"
            className="title"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div
            className="img_box"
            onClick={handleBoxClick}
          >
            {!imagePreview && (
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 5H17.83L15.42 2.58C15.15 2.3 14.77 2.12 14.35 2.04C14.26 2.01 14.16 2 14.06 2H9.94C9.84 2 9.74 2.01 9.65 2.04C9.23 2.12 8.85 2.3 8.58 2.58L6.17 5H3C1.9 5 1 5.9 1 7V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V7C23 5.9 22.1 5 21 5ZM12 17C10.34 17 9 15.66 9 14C9 12.34 10.34 11 12 11C13.66 11 15 12.34 15 14C15 15.66 13.66 17 12 17ZM5.5 7.5C6.33 7.5 7 6.83 7 6C7 5.17 6.33 4.5 5.5 4.5C4.67 4.5 4 5.17 4 6C4 6.83 4.67 7.5 5.5 7.5Z"
                  fill="currentColor"
                />
              </svg>
            )}
            {imagePreview && <img src={imagePreview} alt="preview" />}
          </div>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <input
            type="text"
            className="info"
            maxLength="50"
            placeholder="함께하고 싶은 모임활동을 소개해주세요(50자 이내)"
            value={groupInfo}
            onChange={(e) => setGroupInfo(e.target.value)}
          />
          <div className="group_category">
            <p>모임 주제</p>
            <button
              className={`category_select ${selectedCategory ? 'selected' : ''}`}
              onClick={toggleCategoryModal}
            >
              {selectedCategory || "주제 선택"}
            </button>
          </div>
          <div className="group_location">
            <p>모임 지역</p>
            <button
              className={`group_select ${selectedSubLocation ? 'selected' : ''}`}
              onClick={toggleLocationModal}
            >
              {selectedSubLocation || "지역 선택"}
            </button>
          </div>
          <div className="confirm">
            <p>가입 확인 여부</p>
            <select
              value={groupConfirm}
              onChange={(e) => setGroupConfirm(e.target.value)}
            >
              <option value="1">즉시 가입</option>
              <option value="2">승인 후 가입</option>
            </select>
          </div>
          <div className="max_number">
            <p>최대 인원 설정</p>
            <select
              value={groupMaxNumber}
              onChange={(e) => setGroupMaxNumber(e.target.value)}
            >
              {[...Array(21).keys()].map((i) => (
                <option key={i + 10} value={i + 10}>
                  {i + 10}명
                </option>
              ))}
            </select>
          </div>
        </div>        
        <p className="caution">모임 공개 여부 및 가입 가능여부는 개설 후, 리더가 변경할 수 있습니다.</p>
        <div className='button_group'>
            <a href="/"><button>취소</button></a>
            <button onClick={handleSubmit}>완료</button>
        </div>
      </div>


      {/* {모달창 내용} */}
      {isCategoryModalOpen && (
        <div className="modal">
          <div className="modal_content">
            <h3>주제 선택</h3>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  <button onClick={() => selectCategory(category)}>
                    {category}
                  </button>
                </li>
              ))}
            </ul>
            <button className="close" onClick={toggleCategoryModal}>닫기</button>
          </div>
        </div>
      )}

      {isLocationModalOpen && (
        <div className="modal">
          <div className="modal_content2">
            <h3>지역 선택</h3>
            {!selectedLocation ? (
              <div>
                <ul>
                  {Object.keys(locations).map((location) => (
                    <li
                      key={location}
                      onClick={() => selectLocation(location)}
                    >
                      {location}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <ul className="city">
                  {subLocations.map((subLocation) => (
                    <li
                      key={subLocation}
                      onClick={() => selectSubLocation(subLocation)}
                    >
                      {subLocation}
                    </li>
                  ))}
                </ul>
                <div className="back_to_city">
                  <button className="back" onClick={() => setSelectedLocation(null)}>
                    ← 시로 돌아가기
                  </button>
                </div>
              </div>
            )}
            <button className="close2" onClick={() => setIsLocationModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </article>
  );
};

export default GroupCreate;
