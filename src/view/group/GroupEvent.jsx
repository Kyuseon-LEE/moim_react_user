import React, { useState, useEffect } from "react";
import "../../css/group/group_event.css";

const GroupEvent = ({ 
  g_no,
  groupData,
  isMember,
  gMRole, }) => {
  const [events, setEvents] = useState([]); // 정모 일정 목록
  const [newEvent, setNewEvent] = useState({
    e_title: "",
    e_text: "",
    e_start_date: "",
    e_time: "",
    e_location: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [votes, setVotes] = useState({});
  const [userVote, setUserVote] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/events`);
      const data = await response.json();
      setEvents(data);

      // Fetch votes for events
      const votesResponse = await fetch(`http://localhost:5000/group/${g_no}/votes`);
      const votesData = await votesResponse.json();
      setVotes(votesData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleVote = async (e_no, voteStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/events/${e_no}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteStatus }),
      });

      if (response.ok) {
        alert("투표가 반영되었습니다.");
        fetchEvents(); // Refresh events and votes
      } else {
        alert("투표 반영에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const resetNewEvent = () => {
    setNewEvent({
      e_title: "",
      e_text: "",
      e_start_date: "",
      e_time: "",
      e_location: "",
    });
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // 오늘 날짜의 다음 날
    return tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0].slice(0, 5); // HH:mm 형식
  };

  const handleAddEvent = async () => {
    // 필수 입력값 검증
    if (
      !newEvent.e_title.trim() ||
      !newEvent.e_start_date.trim() ||
      !newEvent.e_time.trim() ||
      !newEvent.e_location.trim() ||
      !newEvent.e_text.trim()
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    const tomorrowDate = getTomorrowDate();
    const currentTime = getCurrentTime();

    // 오늘 날짜와 이전 날짜 등록 불가
    if (
      newEvent.e_start_date < tomorrowDate ||
      (newEvent.e_start_date === tomorrowDate && newEvent.e_time < currentTime)
    ) {
      alert("이전 날짜 및 당일 일정 등록은 불가합니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert("일정이 등록되었습니다.");
        setIsModalOpen(false); // 모달 닫기
        resetNewEvent(); // 입력 필드 초기화
        fetchEvents(); // 일정 목록 갱신
      } else {
        alert("일정 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("일정 등록 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
    }
  };

  if (groupData.g_public === 0 && (!isMember || gMRole === 0)) {
    return (
      <div className="home_board">
        <p className="no_member">비공개 그룹입니다. 멤버만 일정을 볼 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="moim_board">
      <h2>일정 관리</h2>

      <div className="schedule_list">
        {events.length === 0 ? (
          <p>일정이 없습니다.</p>
        ) : (
          events.map((event) => (
            <div className="schedule_card" key={event.e_no}>
              <h3>{event.e_title}</h3>
              <p>일시: {new Date(event.e_start_date).toISOString().split('T')[0]} 
                 &nbsp;{event.e_time.split(':').slice(0, 2).join(':')}</p>              
              <p>장소: {event.e_location}</p>
              <p>내용: {event.e_text}</p>
              <div className="vote_buttons">
                <button onClick={() => handleVote(event.e_no, 1)}>참석</button>
                <button onClick={() => handleVote(event.e_no, 0)}>불참</button>
              </div>

              {votes[event.e_no] && (
                <div className="vote_results">
                  <p>참석: {votes[event.e_no].yes || 0}</p>
                  <p>불참: {votes[event.e_no].no || 0}</p>
                </div>
              )}
            </div>
            
          ))
        )}
      </div>

      {gMRole >= 2 && (
        <button className="add_event_button" onClick={() => setIsModalOpen(true)}>
          새 일정 추가
        </button>
      )}

      {isModalOpen && (
        <div className="event_modal_overlay" onClick={() => {
          setIsModalOpen(false);
          resetNewEvent(); // 모달 닫힐 때 입력 초기화
        }}>
          <div className="event_modal_content" onClick={(e) => e.stopPropagation()}>
            <h3>새 일정 추가</h3>
            <input
              type="text"
              placeholder="제목 (필수)"
              name="e_title"
              value={newEvent.e_title}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="e_start_date"
              value={newEvent.e_start_date}
              onChange={handleInputChange}
              min={getTomorrowDate()} // 최소 날짜는 내일
            />
            <input
              type="time"
              name="e_time"
              value={newEvent.e_time}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="장소 (필수)"
              name="e_location"
              value={newEvent.e_location}
              onChange={handleInputChange}
            />
            <textarea
              placeholder="정모 내용 (필수)"
              name="e_text"
              value={newEvent.e_text}
              onChange={handleInputChange}
            ></textarea>
            <div className="modal_buttons">
              <button onClick={handleAddEvent}>등록</button>
              <button onClick={() => {
                setIsModalOpen(false);
                resetNewEvent(); // 입력 필드 초기화
              }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupEvent;
