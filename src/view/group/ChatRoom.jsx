import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../../css/group/chat_room.css";

const ChatRoom = () => {
  const { g_no } = useParams(); // 그룹 ID
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [message, setMessage] = useState(""); // 입력 중인 메시지
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [socket, setSocket] = useState(null); // 소켓 객체
  const m_no = parseInt(localStorage.getItem("m_no")); // 현재 사용자 ID
  const messagesEndRef = useRef(null); // 메시지 컨테이너의 끝을 참조

  // 메시지 컨테이너 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/group/${g_no}/messages`);
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

  // 메시지 전송
  const sendMessage = async () => {
    if (!message.trim()) return alert("메시지를 입력하세요.");

    const newMessage = {
      g_no,
      m_no,
      c_content: message,
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
        setMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }

    setMessage("");
  };

  // m_no 및 시간 표시 여부 확인
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

  return (
    <div className="chat_room">
      <div className="chat_messages">
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          messages.map((msg, index) => {
            const prevMessage = messages[index - 1]; // 이전 메시지
            const nextMessage = messages[index + 1]; // 다음 메시지
            const showMNo = shouldShowMNo(msg, prevMessage); // m_no 표시 여부
            const showTime = shouldShowTime(msg, nextMessage); // 시간 표시 여부

            return (
              <div
                key={index}
                className={`chat_message ${
                  msg.m_no === m_no ? "chat_message--right" : "chat_message--left"
                }`}
              >
                {/* 사용자 ID는 같은 사용자라도 첫 메시지에만 표시 */}
                {showMNo && msg.m_no !== m_no && (
                  <p>
                    <strong>{msg.m_nickname}</strong>
                  </p>
                )}
                {/* 메시지 내용 */}
                <div className="c_content">{msg.c_content}</div><br />
                {/* 시간은 같은 시간대일 경우 마지막 메시지에만 표시 */}
                {showTime && (
                  <small>
                    {new Date(msg.c_reg_date).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </small>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat_input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;
