import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/group/group_home.css";
import ChatRoom from "./ChatRoom";

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
  const [commentTexts, setCommentTexts] = useState({}); // 게시글별 댓글 입력 상태
  const [commentsByPost, setCommentsByPost] = useState({});
  const [menuVisibility, setMenuVisibility] = useState({}); // 게시글별 메뉴 상태
  const [editingPostId, setEditingPostId] = useState(null);
  const [currentPostText, setCurrentPostText] = useState("");
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태
  const [currentPostImage, setCurrentPostImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

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
        if (!response.ok) throw new Error("게시글 데이터를 가져오지 못했습니다.");
        const data = await response.json();
        setPosts(data);

        // 게시글별 댓글 데이터 가져오기
        data.forEach((post) => fetchComments(post.p_no));
      } catch (error) {
        console.error("게시글 데이터 오류:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [g_no]);

  const fetchComments = async (p_no) => {
    try {
      const response = await fetch(`http://localhost:5000/group/${p_no}/comments`);
      if (!response.ok) throw new Error("댓글 데이터를 가져오지 못했습니다.");
      const data = await response.json();
      setCommentsByPost((prev) => ({ ...prev, [p_no]: data })); // 게시글별 댓글 업데이트
    } catch (error) {
      console.error(`댓글 데이터 오류 (p_no: ${p_no}):`, error.message);
    }
  };

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
  
  // 그룹 멤버 리스트
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".post_menu") && !event.target.closest("svg")) {
        // 메뉴나 SVG 외부 클릭 시 메뉴 닫기
        setMenuVisibility({});
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  
  
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
  
    setUploadedFileName(""); // 초기화
    setIsUploading(true); // 업로드 중 상태 설정
  
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
          setUploadedFileName(data.filePath); // 업로드된 이미지 경로 저장
          alert("이미지 업로드 성공");
        } else {
          alert("이미지 업로드 실패: 서버 응답이 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("이미지 업로드 오류:", error.message);
        alert(`이미지 업로드 실패: ${error.message}`);
      })
      .finally(() => {
        setIsUploading(false); // 업로드 완료 상태로 전환
      });
  };
  

  // 게시글 작성
  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
        alert("게시글 내용을 입력해주세요.");
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
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

  const handleCommentChange = (p_no, value) => {
    setCommentTexts((prev) => ({
      ...prev,
      [p_no]: value, // 특정 게시글의 댓글 입력 상태 업데이트
    }));
  };
  

  const handleCommentSubmit = async (p_no) => {
    const commentText = commentTexts[p_no] || ""; // 해당 게시글의 댓글 내용
  
    if (!commentText.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
  
    const commentData = {
      g_no, // 그룹 번호
      p_no, // 게시글 번호
      m_no: localStorage.getItem("m_no"), // 작성자 번호
      co_text: commentText, // 댓글 내용
    };
  
    try {
      const response = await fetch("http://localhost:5000/group/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
  
      if (!response.ok) throw new Error("댓글 작성 실패");
      alert("댓글이 작성되었습니다.");
      setCommentTexts((prev) => ({
        ...prev,
        [p_no]: "", // 댓글 작성 후 해당 게시글의 입력 상태 초기화
      }));
      fetchComments(p_no); // 댓글 목록 새로고침
    } catch (error) {
      console.error("댓글 작성 오류:", error.message);
    }
  };

  const toggleMenuVisibility = (p_no) => {
    setMenuVisibility((prev) => ({
      ...prev,
      [p_no]: !prev[p_no], // 현재 게시글의 메뉴 상태 토글
    }));
  };

  const handleEdit = (p_no, p_text) => {
    setEditingPostId(p_no); // 수정할 게시글 ID 설정
    setCurrentPostText(p_text); // 수정할 게시글 내용 설정
  };
  
  
  const handleDeletePost = async (p_no) => {
    const m_no = localStorage.getItem("m_no"); // 현재 로그인 사용자 ID

    try {
        const response = await fetch(`http://localhost:5000/group/${g_no}/posts/${p_no}/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ m_no }),
        });

        const result = await response.json();
        if (result.success) {
            alert("게시글이 삭제되었습니다.");
            setPosts((prevPosts) => prevPosts.filter((post) => post.p_no !== p_no)); // UI에서 삭제
        } else {
            alert(result.message || "게시글 삭제 실패");
        }
    } catch (error) {
        console.error("게시글 삭제 오류:", error.message);
        alert("게시글 삭제 중 오류가 발생했습니다.");
    }
};

const handleEditClose = () => {
  setEditingPostId(null); // 수정 상태 종료
  setCurrentPostText(""); // 내용 초기화
};

const handleSaveEdit = async () => {
  const m_no = localStorage.getItem("m_no");

  if (!currentPostText.trim()) {
    alert("내용을 입력해주세요.");
    return;
  }

  const p_img = uploadedFileName || null; // 업로드된 이미지 경로 또는 null
  const body = { m_no, p_text: currentPostText, p_img };

  console.log("수정 요청 데이터:", body); // 디버깅용 데이터 출력

  try {
    const response = await fetch(`http://localhost:5000/group/posts/${editingPostId}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("수정 실패");

    alert("수정이 완료되었습니다.");
    setEditingPostId(null);
    setCurrentPostText("");
    setUploadedFileName(""); // 수정 완료 후 초기화
    window.location.reload(); // 게시글 새로고침
  } catch (error) {
    console.error("수정 오류:", error.message);
    alert("수정 중 오류가 발생했습니다.");
  }
};


const handleEditImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert("파일을 선택해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  setUploadedFileName(""); // 초기화
  setIsUploading(true); // 업로드 중 상태 설정

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
        console.log("업로드된 이미지 경로:", data.filePath);
        setUploadedFileName(data.filePath); // 업로드된 이미지 경로 설정
        alert("이미지 업로드 성공");
      } else {
        alert("이미지 업로드 실패: 서버 응답이 올바르지 않습니다.");
      }
    })
    .catch((error) => {
      console.error("이미지 업로드 오류:", error.message);
      alert(`이미지 업로드 실패: ${error.message}`);
    })
    .finally(() => {
      setIsUploading(false); // 업로드 완료 상태로 전환
    });
  };

  const handleDeleteComment = async (co_no, p_no) => {
    const m_no = localStorage.getItem("m_no");
  
    try {
      const response = await fetch(`http://localhost:5000/group/comment/${co_no}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m_no }),
      });
  
      if (!response.ok) throw new Error("댓글 삭제 실패");
      alert("댓글이 삭제되었습니다.");
      fetchComments(p_no); // 댓글 삭제 후 댓글 목록 갱신
    } catch (error) {
      console.error("댓글 삭제 오류:", error.message);
      alert("댓글 삭제 중 오류가 발생했습니다.");
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
                <p className="author_nick">{post.m_nickname} 
                  <span className={`member_grade ${
                            post.g_m_role === 1
                              ? "role-normal"
                              : post.g_m_role === 2
                              ? "role-manager"
                              : post.g_m_role === 3
                              ? "role-leader"
                              : "role-unknown"
                          }`}>
                    {getMemberGrade(post.g_m_role)}
                  </span>
                </p>
                <p className="author_date">{formatRelativeDate(post.p_reg_date)}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  onClick={() => toggleMenuVisibility(post.p_no)} // 클릭 이벤트
                  style={{ cursor: "pointer" }}
                >
                  <circle cx="12" cy="5" r="1.5"></circle>
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="12" cy="19" r="1.5"></circle>
                </svg>
                {menuVisibility[post.p_no] && ( // 메뉴가 열려 있는 경우 표시
                <div className="post_menu">
                {post.m_no === parseInt(localStorage.getItem("m_no")) && (
                  <button onClick={() => handleEdit(post.p_no, post.p_text)}>수정</button>
                )}
                {(gMRole === 3 || post.m_no === parseInt(localStorage.getItem("m_no"))) && (
                  <button onClick={() => handleDeletePost(post.p_no)}>삭제</button>
                )}
                <button>신고하기</button>

            {editingPostId && (
              <div className="edit_modal">
                <div className="edit_content">
                  <h2>게시글 수정</h2>
                  <textarea
                    value={currentPostText}
                    onChange={(e) => setCurrentPostText(e.target.value)}
                  />
                  <div className="image_upload">
                    <input type="file" onChange={handleEditImageUpload} />
                  </div>
                  {isUploading && (
                    <div className="loading-bar">
                      <div className="loading-spinner"></div>
                      <p>이미지 업로드 중입니다...</p>
                    </div>
                  )}
                  <div className="edit_buttons">
                    <button onClick={handleSaveEdit} disabled={isUploading}>
                      저장
                    </button>
                    <button onClick={handleEditClose}>취소</button>
                  </div>
                </div>
              </div>
            )}
              </div>
              
                )}
              </div>
              <div className="author_board">
                <p>{post.p_text}</p>
                {post.p_img && (
                  <img
                    src={post.p_img}
                    alt="Content"
                  />
                )}
                
              </div>
              {commentsByPost[post.p_no] && commentsByPost[post.p_no].length > 0 && (
              <div className="comment_list">
                <h4>
                  댓글 {commentsByPost[post.p_no] && commentsByPost[post.p_no].length > 0
                    ? `${commentsByPost[post.p_no].length}개`
                    : ""}
                </h4>
                {commentsByPost[post.p_no].map((comment) => (
                  <div key={comment.co_no} className="comment_item">
                    <img
                      src={
                        comment.m_profile_img
                          ? `${comment.m_profile_img}` // 작성자 프로필 이미지
                          : `${process.env.PUBLIC_URL}/img/profile_default.png` // 기본 이미지
                      }
                      alt="Profile"
                      className="comment_profile"
                      onError={(e) => {
                        e.target.onerror = null; // 기본 이미지로 대체
                        e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`;
                      }}
                    />
                    <div className="comment_content">
                      <p className="list_author">{`${comment.m_nickname}`}
                        <span className={`member_grade ${
                            comment.g_m_role === 1
                              ? "role-normal"
                              : comment.g_m_role === 2
                              ? "role-manager"
                              : comment.g_m_role === 3
                              ? "role-leader"
                              : "role-unknown"
                          }`}
                        >
                          {getMemberGrade(comment.g_m_role)}

                        </span>
                        {comment.m_no === parseInt(localStorage.getItem("m_no")) && (
                        <span
                          className="comment_delete"
                          onClick={() => handleDeleteComment(comment.co_no, post.p_no)}
                        >
                          삭제
                        </span>
                      )}
                      </p>
                      <p className="list_comment">{comment.co_text}</p>
                      <p className="list_date">{new Date(comment.co_reg_date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

              <div className="board_comment">
                <div className="comment_view">
                <img
                  src={
                    localStorage.getItem("m_profile_img")
                      ? `${localStorage.getItem("m_profile_img")}` // 현재 로그인한 사용자 프로필 이미지
                      : `${process.env.PUBLIC_URL}/img/profile_default.png` // 기본 이미지
                  }
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null; // 무한 루프 방지
                    e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`; // 기본 이미지 경로
                  }}
                />
                  <input
                    type="text"
                    placeholder="댓글을 남겨주세요"
                    value={commentTexts[post.p_no] || ""} // 특정 게시글의 댓글 입력 상태
                    onChange={(e) => handleCommentChange(post.p_no, e.target.value)} // 상태 업데이트
                  />
                  <div className="comment_button" onClick={() => handleCommentSubmit(post.p_no)}>
                    작성하기
                  </div>
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
          
            <div className="schedule_list">
              <div className="schedule_card">
                <h3>정모 #1</h3>
                <p>날짜: 2024-12-01</p>
                <p>시간: 18:00</p>
                <p>장소: 서울역</p> 
                <p>첫 정모입니다!</p>
              </div>
            </div>

            <div className="schedule_form">
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
            <ChatRoom g_no={groupData.g_no} />
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
          <img src={groupData.g_img_name} alt="Group" />
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
                    {isUploading && (
                      <div className="loading-bar">
                        <div className="loading-spinner"></div>
                        <p>이미지 업로드 중입니다...</p>
                      </div>
                    )}
                    {imagePreview && <img src={imagePreview} alt="Preview" />}
                    <div className="post_buttons">
                      <button onClick={handlePostSubmit} >작성</button>
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
