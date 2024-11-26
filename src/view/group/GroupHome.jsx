import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/group/group_home.css";

const GroupHome = () => {
  const { g_no } = useParams(); // URL에서 g_no 가져오기
  const [groupData, setGroupData] = useState(null); // 모임 데이터를 상태로 관리
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("게시글"); // 기본 탭은 '게시글'
  const [error, setError] = useState(null); // 오류 상태

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  }

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/group/${g_no}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json(); // JSON 데이터 파싱
        setGroupData(data); // 상태에 데이터 저장
        setLoading(false); // 로딩 완료
      } catch (error) {
        console.error("Error fetching group data:", error.message);
        setError("그룹 데이터를 가져오는 중 오류가 발생했습니다.");
        setLoading(false); // 로딩 완료
      }
    };

    fetchGroupData();
  }, [g_no]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!groupData) {
    return <p>그룹 정보를 찾을 수 없습니다.</p>;
  }

  // 각 탭에 따라 표시할 내용을 정의
  const renderContent = () => {
    switch (activeTab) {
      case "게시글":
        return (
          <div className="home_board">
            <div className="home_search">
              <input type="text" placeholder='글 내용을 입력하세요'/>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
            <div className="board_list">
              <div className="author_info">
                <img src={process.env.PUBLIC_URL + "/img/exam.png"} alt="Profile" />
                <p className="author_nick">강아지</p>
                <p className="author_date">2024년 11월 26일 오전 11:26</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"></circle>
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="12" cy="19" r="1.5"></circle>
                </svg>
              </div>
              <div className="author_board">
                <p>강아지냐옹</p>
                <img src={process.env.PUBLIC_URL + "/img/exam.png"} alt="Content" />
              </div>
              <div className="board_comment">
                <div className="comment_view">
                  <img src={process.env.PUBLIC_URL + "/img/exam.png"} alt="User" />
                  <input type="text" placeholder="댓글을 남겨주세요" />
                  <div className="comment_button">작성하기</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "일정":
        return (
          <div className="moim_board">
            <h2>정모 일정 관리</h2>

            <div class="schedule_list">
              <div class="schedule_card">
                <h3>정모 #1</h3>
                <p>날짜: 2024-12-01</p>
                <p>시간: 18:00</p>
                <p>장소: 서울역</p> 
                <p>첫 정모입니다!</p>
              </div>
            </div>

            <div class="schedule_form">
              <h3>새 일정 추가</h3>
              <input type="text" placeholder="제목" />
              <input type="date" />
              <input type="time" />
              <input type="text" placeholder="장소" />
              <textarea placeholder="추가 설명"></textarea>
              <button>일정 추가</button>
            </div>
          </div>
        );
      case "채팅방":
        return (
          <div className="home_board">
            <p>채팅방 내용이 여기에 표시됩니다.</p>
          </div>
        );
      case "멤버":
        return (
          <div className="member_board">            
            <div className="member_search">
            <h3>멤버 {groupData.memberCount}</h3>
              <input type="text" placeholder="멤버검색" />
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <div className="member_list_wrap">
              <div className="member_list">
                <h4>멤버</h4>
                <div className="member_info">
                  <img src={process.env.PUBLIC_URL + "/img/exam.png"} alt="Profile" />
                  <p className="member_nick">강아지 <span>리더</span></p>
                </div>
                <div className="member_info">
                  <img src={process.env.PUBLIC_URL + "/img/exam.png"} alt="Profile" />
                  <p className="member_nick">강아지 <span>간부</span></p>
                </div>
                
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <article className="home_article">
      <div className="home_nav">
        <ul>
          {["게시글", "일정", "채팅방", "멤버"].map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>
      <div className="home_wrap">
        <div className="home_info">
          <img src={`http://localhost:5000/uploads/${groupData.g_img_name}`} alt="Group" />
          <h2>{groupData.g_name}</h2>
          <p className="info_member">멤버 {groupData.memberCount}</p>
          <p className="info_member">리더 {groupData.g_master_nickname}</p>
          <p className="info_intro">개설일 {formatDate(groupData.g_reg_date)}</p>
          <p className="info_intro">{groupData.g_info}</p>
          {/* <div className="group_access">모임 가입하기</div> */}
          <div className="group_access">게시글 작성</div>
          <p className="info_right">
            {groupData.g_public === 1
              ? "모임이 공개 상태입니다. 누구나 모임을 검색하고 소개를 볼 수 있습니다."
              : "모임이 비공개 상태입니다. 멤버만 게시글과 소개를 볼 수 있습니다."}
          </p>
        </div>

        {renderContent()}
      </div>
    </article>
  );
};

export default GroupHome;
