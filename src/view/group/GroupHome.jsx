import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/group/group_home.css";

const GroupHome = () => {
  const { g_no } = useParams();
  const [isMember, setIsMember] = useState(false);
  const [groupData, setGroupData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("게시글"); 
  const [error, setError] = useState(null); 
  const [isWritingPost, setIsWritingPost] = useState(false);
  const [postContent, setPostContent] = useState(""); // 게시글 내용
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기
  const [uploadedFileName, setUploadedFileName] = useState(""); // 업로드된 이미지 파일 이름
  const [posts, setPosts] = useState([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [gMRole, setGmRole] = useState(null); // g_m_role 상태
  const [members, setMembers] = useState([]); // 멤버 리스트 

  // 게시글 날짜 포맷
  function formatRelativeDate(dateString) {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffMilliseconds = now - postDate;
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffMinutes <= 0) {
      return "방금";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}분 전`; // 1분 ~ 59분 전
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`; // 1시간 ~ 23시간 전
    } else {
      // 날짜 포맷: YYYY.MM.DD
      const year = postDate.getFullYear();
      const month = String(postDate.getMonth() + 1).padStart(2, "0");
      const day = String(postDate.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  }
  // (tbl_group) 그룹 정보 가져오기
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

  // 그룹에 가입된 유저인지 확인하기
  useEffect(() => {
    const fetchMembershipStatus = async () => {
      try {
        const mNo = localStorage.getItem("m_no"); // 로컬스토리지에서 m_no 가져오기
        if (!mNo) {
          throw new Error("로그인이 필요합니다.");
        }

        // 멤버 여부 확인 API 호출
        const response = await fetch(`http://localhost:5000/group/${g_no}/is-member/${mNo}`);
        if (!response.ok) {
          throw new Error("멤버 여부 확인에 실패했습니다.");
        }

        const { isMember } = await response.json();
        setIsMember(isMember); // 멤버 여부 상태 업데이트
      } catch (error) {
        console.error("Error:", error.message);
        setError(error.message); // 에러 메시지 저장
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchMembershipStatus();
  }, [g_no]);

  // 그룹에 작성된 포스트 내용 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      
      try {
        const response = await fetch(`http://localhost:5000/group/${g_no}/posts`);
        if (!response.ok) {
          throw new Error("게시글 데이터를 가져오지 못했습니다.");
        }
        const data = await response.json();
        setPosts(data); // 정렬된 데이터 사용
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [g_no]);

   // 유저 권한(g_m_role) 값 가져오기
   useEffect(() => {
    const fetchGroupRole = async () => {
      const mNo = localStorage.getItem("m_no"); // 로컬스토리지에서 m_no 가져오기
      if (!mNo) {
        console.warn("로그인이 필요합니다.");
        setGmRole(null); // 로그인 정보가 없으면 기본값 설정
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/group/${g_no}/member/${mNo}/role`);
        if (!response.ok) {
          console.warn("Member role 정보를 가져오지 못했습니다.");
          setGmRole(null); // 실패 시 null로 설정
          return;
        }
  
        const data = await response.json();
        if (data.success) {
          setGmRole(data.g_m_role); // g_m_role 값 설정
        } else {
          console.warn(data.message);
          setGmRole(null); // 실패 시 null로 설정
        }
      } catch (error) {
        console.error("Error fetching member role:", error.message);
        setGmRole(null); // 오류 발생 시 null로 설정
      } finally {
        setLoading(false);
      }
    };
  
    fetchGroupRole();
  }, [g_no]);
  

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/group/${g_no}/members`);
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await response.json();
        setMembers(Array.isArray(data.members) ? data.members : []);
    // 멤버 데이터 상태 업데이트
      } catch (error) {
        console.error("Error fetching members:", error.message);
      }
    };

    fetchMembers();
  }, [g_no]);

  const handleWritePost = () => {
    setIsWritingPost(true); // 게시글 작성 창 열기
  };

  const closeWritePost = () => {
    setIsWritingPost(false); // 게시글 작성 창 닫기
    setImagePreview(null); // 이미지 미리보기 초기화
    setUploadedFileName(""); // 업로드된 파일 초기화
    setPostContent(""); // 게시글 내용 초기화
  };

  // 이미지 업로드
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

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
        if (data.success && data.fileName) {
          const imageUrl = `http://localhost:5000/uploads/${data.fileName}`;
          setUploadedFileName(data.fileName); // 파일 이름 저장
        } else {
          alert("이미지 업로드 실패: 서버 응답이 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("이미지 업로드 오류:", error.message);
        alert(`이미지 업로드 실패: ${error.message}`);
      });
  };

  // 게시글 작성
  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      alert("게시글 내용을 입력해주세요."); // 경고창
      return;
    }
    
    const mNo = localStorage.getItem("m_no");
    const postData = {
      g_no,
      m_no: mNo,
      p_text: postContent,
      p_img: uploadedFileName,
    };
  
    try {
      const response = await fetch("http://localhost:5000/group/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // JSON 형식으로 명시
        body: JSON.stringify(postData), // 데이터를 JSON 문자열로 변환
      });
  
      if (!response.ok) throw new Error("게시글 작성 실패");
      alert("게시글이 작성되었습니다.");
      window.location.reload();
    } catch (error) {
      alert(`게시글 작성 실패: ${error.message}`);
    }
  };

   // 모임 가입하기 버튼 클릭
   const handleJoinClick = () => {
    setIsJoinModalOpen(true);
  };

  // 모임 가입 신청 모달 닫기
  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
  };

  // 가입 신청 완료
  const handleJoinSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          m_no: localStorage.getItem("m_no"), // 사용자 번호
          message: "가입 신청 메시지", // 메시지
        }),
      });
  
      if (!response.ok) {
        throw new Error("가입 신청에 실패했습니다.");
      }
  
      alert("가입 신청이 완료되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("가입 신청 오류:", error.message);
      alert("가입 신청 중 오류가 발생했습니다.");
    }
  };

  const getMemberGrade = (role) => {
    switch (role) {
      case 1:
        return "일반 회원"; // g_m_role === 1
      case 2:
        return "간부 회원"; // g_m_role === 2
      case 3:
        return "모임장"; // g_m_role === 3
      default:
        return "알 수 없음"; // 기타 예외 상황
    }
  };

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
            {posts.map((post) => (
            <div key={post.p_no} className="post_item">
              <div className="author_info">
              <img
                src={post.m_profile_img || `${process.env.PUBLIC_URL}/img/profile_default.png`} 
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`;
                }}
              />
                <p className="author_nick">{post.m_nickname}</p>
                <p className="author_date">{formatRelativeDate(post.p_reg_date)}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"></circle>
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="12" cy="19" r="1.5"></circle>
                </svg>
              </div>
              <div className="author_board">
                <p>{post.p_text}</p>
                {post.p_img && (
                  <img
                    src={`http://localhost:5000/uploads/${post.p_img}`}
                    alt="Content"
                  />
                )}
                
              </div>
              <div className="comment_list">
                <h4>댓글 1</h4>
                <img src={process.env.PUBLIC_URL + '/img/profile_default.png'} alt="Logo" />                
                <p className="list_author">망망이</p>
                <p className="list_comment">멍멍멍멍멍멍멍멍이</p>
                <p className="list_date">2024년 11월 28일</p>
              </div>
              <div className="board_comment">
                <div className="comment_view">
                <img
                    src={`http://localhost:5000/uploads/${post.m_no}.png`}
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null; // 무한 루프 방지
                      e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`; // 기본 이미지 경로
                    }}
                  />
                  <input type="text" placeholder="댓글을 남겨주세요" />
                  <div className="comment_button">작성하기</div>
                </div>
              </div>  
            </div>
          ))}
              <div className="post_item">
                <div className="author_info">
                <img src={process.env.PUBLIC_URL + '/img/logo_mini.png'} alt="Logo" />
                  <p className="author_nick">moim?</p>
                  <p className="author_date">{formatRelativeDate(groupData.g_reg_date)}</p>
                </div>
                <div className="author_board">
                  <p>{groupData.g_name}이(가) 생성 되었습니다</p>
                
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div className="member_list_wrap">
                <div className="member_list">
                  <h4>멤버 목록</h4>
                  {loading ? (
                    <p>로딩 중...</p>
                  ) : members.length > 0 ? (
                    members
                      .filter((member) => member.g_m_role !== 0)
                      .map((member) => (
                        <div className="member_info" key={member.m_no || member.g_m_no}>
                          <img
                            src={member.m_profile_img || `${process.env.PUBLIC_URL}/img/profile_default.png`} 
                            alt="Profile"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`;
                            }}
                          />
                          <p className="member_nick">{member.m_nickname}
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
          <div>
          {isMember ? (
          gMRole === 0 ? (
            <div className="group_access">가입 대기중</div>
          ) : (
            <div>
              <div className="group_access" onClick={handleWritePost}>
                게시글 작성
              </div>

              {isWritingPost && (
                <div className="post_modal">
                  <div className="post_content">
                    <h2>게시글 작성</h2>
                    <input
                      type="text"
                      placeholder="게시글 내용을 입력하세요"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                    <input type="file" onChange={handleImageUpload} />
                    {imagePreview && <img src={imagePreview} alt="Preview" />}
                    <div className="post_buttons">
                      <button onClick={handlePostSubmit}>작성</button>
                      <button onClick={closeWritePost}>취소</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          // 회원이 아닌 경우
          <div className="group_access" onClick={handleJoinClick}>
            모임 가입하기
          </div>
        )}


      {/* 가입 신청 모달 */}
      {isJoinModalOpen && (
        <div className="modal">
          <div className="modal_contents">
            <h3>가입 신청</h3>
            <input type="text"
              placeholder="가입 신청 메시지를 입력하세요"
            />
            <div className="modal_buttons">
              <button onClick={handleJoinSubmit}>신청</button>
              <button onClick={closeJoinModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
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
