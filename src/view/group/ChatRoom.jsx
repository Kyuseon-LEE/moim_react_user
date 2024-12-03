import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../../css/group/chat_room.css";

const ChatRoom = () => {
  const { g_no } = useParams(); // 그룹 ID
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [message, setMessage] = useState(""); // 입력 중인 메시지
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [socket, setSocket] = useState(null); // 소켓 객체
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기
  const [uploadedFileName, setUploadedFileName] = useState(""); // 업로드된 파일 경로
  const [isUploading, setIsUploading] = useState(false); // 업로드 진행 상태
  const m_no = parseInt(localStorage.getItem("m_no")); // 현재 사용자 ID
  const messagesEndRef = useRef(null); // 메시지 컨테이너의 끝을 참조
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스
  const chatImages = messages.filter((msg) => msg.c_img_url); // 이미지 목록 추출
  const navigate = useNavigate(); // 라우터 내비게이션
  const [isMember, setIsMember] = useState(false); // 그룹 멤버 여부

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const response = await fetch(`http://localhost:5000/group/${g_no}/is-member/${m_no}`);
        const data = await response.json();
        if (data.isMember) {
          setIsMember(true);
        } else {
          alert("이 그룹의 멤버가 아니므로 접근할 수 없습니다.");
        }
      } catch (error) {
        console.error("그룹 멤버 여부 확인 실패:", error.message);
        alert("오류가 발생했습니다. 메인 페이지로 이동합니다.");
        navigate("/");
      }
    };

    checkMembership();
  }, [g_no, m_no, navigate]);

  // 메시지 컨테이너 끝으로 스크롤
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }, 50);
    }
  };


  useEffect(() => {
    const fetchMessages = async () => {
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/group/${g_no}/messages?m_no=${m_no}`);
        const data = await response.json();

        if (data.success) {
            setMessages(data.data); // 메시지 설정
        }
    } catch (error) {
        console.error("Error fetching messages:", error.message);
    } finally {
        setLoading(false);
    }
};


    fetchMessages();

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    newSocket.emit("joinGroup", g_no);

    newSocket.on("receiveMessage", (newMessage) => {
      console.log("Received message:", newMessage); // 로그 출력
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [g_no, m_no]);

  useEffect(() => {
    scrollToBottom(); // 메시지 변경 시 스크롤 이동
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() && !uploadedFileName) {
      alert("메시지나 이미지를 입력하세요.");
      return;
    }
  
    const newMessage = {
      g_no,
      m_no,
      c_content: message, // 입력된 메시지
      c_img_url: uploadedFileName, // 업로드된 이미지 경로
      c_reg_date: new Date().toISOString(),
    };
  
    try {
      socket.emit("sendMessage", newMessage);
  
      const response = await fetch(`http://localhost:5000/group/${g_no}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
  
      if (response.ok) {
        setMessage(""); // 메시지 입력창 초기화
        setImagePreview(null); // 이미지 미리보기 초기화
        setUploadedFileName(""); // 업로드된 파일명 초기화
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };
  

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // 기존 미리보기 URL 해제
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true); // 업로드 시작

    try {
      const response = await fetch("http://localhost:5000/group/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.filePath) {
        console.log("SFTP 저장 경로:", data.filePath);
        setUploadedFileName(data.filePath); // 업로드 경로 저장
      } else {
        alert("이미지 업로드 실패: 서버 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error.message);
    } finally {
      setIsUploading(false); // 업로드 종료
    }
  };

  const shouldShowDate = (currentMessage, prevMessage) => {
    if (!prevMessage) return true; // 첫 번째 메시지라면 날짜 표시
    const currentDate = new Date(currentMessage.c_reg_date).toDateString();
    const prevDate = new Date(prevMessage.c_reg_date).toDateString();
    return currentDate !== prevDate; // 날짜가 다르면 표시
  };

  const shouldShowMNo = (currentMessage, prevMessage) => {
    if (!prevMessage) return true; // 첫 번째 메시지라면 표시
    return currentMessage.m_no !== prevMessage.m_no; // 다른 사용자라면 표시
  };

  const shouldShowTime = (currentMessage, nextMessage) => {
    if (!nextMessage) return true; // 마지막 메시지라면 표시
    const currentTime = new Date(currentMessage.c_reg_date).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const nextTime = new Date(nextMessage.c_reg_date).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return currentTime !== nextTime || currentMessage.m_no !== nextMessage.m_no; // 시간이 다르거나, 다른 사용자라면 표시
  };

  const shouldShowProfile = (currentMessage, prevMessage) => {
    if (!prevMessage) return true; // 첫 번째 메시지라면 항상 표시
    return currentMessage.m_no !== prevMessage.m_no; // 작성자가 다르면 표시
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };
  
  const closeImageModal = () => {
    setIsModalOpen(false);
  };
  
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? chatImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === chatImages.length - 1 ? 0 : prevIndex + 1
    );
  };

   if (!isMember) {
    return <p>접근 권한이 없습니다.</p>; // 멤버가 아니면 다른 내용을 렌더링
  }

  return (
    <div className="chat_room">
      {isUploading && ( // 로딩 모달
        <div className="loading-modal">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="chat_messages">
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          messages.map((msg, index) => {
            const prevMessage = messages[index - 1]; // 이전 메시지
            const nextMessage = messages[index + 1]; // 다음 메시지
            const showDate = shouldShowDate(msg, prevMessage); // 날짜 표시 여부
            const showMNo = shouldShowMNo(msg, prevMessage); // m_no 표시 여부
            const showTime = shouldShowTime(msg, nextMessage); // 시간 표시 여부
            const isMine = msg.m_no === m_no;

            return (
              <React.Fragment key={index}>
                {showDate && (
                  <div className="chat_date_separator">
                    <span>
                      {new Date(msg.c_reg_date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    </span>
                  </div>
                )}
                <div
                  className={`chat_message ${
                    isMine ? "chat_message--right" : "chat_message--left"
                  }`}
                >
                  {!isMine && shouldShowProfile(msg, prevMessage) && (
                    <div className="chat_profile">
                      <img
                        src={msg.m_profile_img || "/default-profile.png"}
                        alt="프로필이미지"
                      />
                    </div>
                  )}
                  <div
                    className="chat_content_wrapper"
                    style={{
                      marginLeft:
                        !isMine && !shouldShowProfile(msg, prevMessage) ? "50px" : "0",
                    }}
                  >
                    {!isMine && showMNo && (
                      <p className="chat_nickname">
                        <strong>{msg.m_nickname}</strong>
                      </p>
                    )}
                    <div className="c_content">
                      {/* 이미지 메시지 표시 */}
                      {msg.c_img_url && (
                        <img
                          src={msg.c_img_url}
                          alt="이미지 메시지"
                          className="chat_image"
                          onClick={() =>
                            openImageModal(chatImages.findIndex((image) => image.c_img_url === msg.c_img_url))
                          } // 이미지 클릭 핸들러
                        />
                      )}

                      {/* 메시지 내용 표시 */}
                      {msg.c_content && <p className="message_text">{msg.c_content}</p>}
                    </div>

                    {showTime && (
                      <small className="chat_time">
                        {new Date(msg.c_reg_date).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </small>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef}></div>
      </div>
      {imagePreview && (
        <div className="image_preview">
          <img src={imagePreview} alt="미리보기" />
          <div className="image_info">
            <span>해당 이미지를 전송합니다.</span>
          </div>
          <button onClick={() => setImagePreview(null)}>취소</button>
        </div>
      )}
      <div className="chat_input">      
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          width="25"
          height="25"
          onClick={() => document.getElementById("imageInput").click()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.435 11.364l-7.071 7.071a5.25 5.25 0 11-7.424-7.424l7.071-7.071a3.75 3.75 0 015.303 5.303l-7.071 7.071a2.25 2.25 0 11-3.182-3.182l6.364-6.364"
          />
        </svg>
        <input
          type="file"
          id="imageInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
      {isModalOpen && (
        <div className="image_modal">
          <div className="modal_overlay" onClick={closeImageModal}></div>
          <div className="chat_modal_content">
            <button className="modal_prev" onClick={goToPreviousImage}>
              &lt;
            </button>
            <img src={chatImages[currentImageIndex].c_img_url} alt="큰 이미지" />
            <button className="modal_next" onClick={goToNextImage}>
              &gt;
            </button>
            {/* 이미지 인덱스 표시 */}
            <div className="modal_index">
              {currentImageIndex + 1} / {chatImages.length}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ChatRoom;
