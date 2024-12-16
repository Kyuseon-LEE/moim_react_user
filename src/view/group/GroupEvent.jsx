import React, { useState, useEffect } from "react";
import "../../css/group/group_event.css";

const GroupEvent = ({ 
  g_no,
  groupData,
  isMember,
  gMRole,
  memberInfo, }) => {
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
  const [userVote, setUserVote] = useState({}); // 사용자별 투표 상태

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/events`);
      const data = await response.json();
      setEvents(data);

      const votesData = {};
      const userVotes = {};
      for (const event of data) {
        const votesResponse = await fetch(`http://localhost:5000/group/${event.e_no}/votes`);
        const voteResult = await votesResponse.json();

        // 투표 결과 가공
        const groupedVotes = voteResult.reduce(
          (acc, vote) => {
            if (vote && vote.vote_status === 1) {
              acc.yes += 1; // 참석
            } else if (vote && vote.vote_status === 0) {
              acc.no += 1; // 불참
            }
            return acc;
          },
        );

        votesData[event.e_no] = groupedVotes;

        // 사용자 투표 상태 확인
        const userVote = voteResult.find(vote => vote && vote.m_no === memberInfo.m_no);
        if (userVote) {
          userVotes[event.e_no] = userVote.vote_status; // 1(참석) 또는 0(불참)
        }
      }

      setVotes(votesData);
      setUserVote(userVotes); // 사용자 투표 상태 업데이트
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleVote = async (e_no, voteStatus) => {
    const userEventVote = userVote[e_no]; // 현재 사용자의 투표 상태 확인
  
    if (userEventVote === voteStatus) {
      // 동일한 상태를 다시 선택한 경우 -> 삭제 요청
      try {
        const response = await fetch(`http://localhost:5000/group/events/${e_no}/vote`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ m_no: memberInfo.m_no }),
        });
  
        if (response.ok) {
          alert("투표가 삭제되었습니다.");
          fetchEvents(); // 상태 갱신
        } else {
          const errorData = await response.json();
          console.error("Server Error:", errorData.message);
          alert("투표 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting vote:", error);
        alert("오류가 발생했습니다.");
      }
    } else {
      // 반대 상태를 선택한 경우 -> 업데이트 요청
      const payload = {
        m_no: memberInfo.m_no,
        vote_status: voteStatus,
      };
  
      try {
        const response = await fetch(`http://localhost:5000/group/events/${e_no}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          alert("투표가 반영되었습니다.");
          fetchEvents(); // 상태 갱신
        } else {
          const errorData = await response.json();
          console.error("Server Error:", errorData.message);
          alert("이미 투표를 진행하셨습니다.");
        }
      } catch (error) {
        console.error("Error submitting vote:", error);
        alert("오류가 발생했습니다.");
      }
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

    if (
      newEvent.e_start_date < tomorrowDate ||
      (newEvent.e_start_date === tomorrowDate && newEvent.e_time <= currentTime)
    ) {
      alert("당일 일정 및 24시간 이내에 시작되는 일정은 등록이 불가합니다.");
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
        setIsModalOpen(false);
        resetNewEvent();
        fetchEvents();
      } else {
        alert("일정 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("일정 등록 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const renderVoteButtons = (e_no) => {
    const userEventVote = userVote[e_no];
    
    // 투표하지 않은 경우 버튼 표시
    return (
      <>
        {(!isMember || gMRole === 0) ? (
          <p></p>
        ) : (
          <div className="vote_buttons">
            <button onClick={() => handleVote(e_no, 1)}>참석</button>
            <button onClick={() => handleVote(e_no, 0)}>불참</button>
          </div>
        )}
      </>
    );    
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
              <p>
                일시: {new Date(event.e_start_date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).replace(/\./g, '.').trim()} 
                &nbsp;{event.e_time.split(':').slice(0, 2).join(':')}
              </p>             
              <p>장소: {event.e_location}</p>
              <p>내용: {event.e_text}</p>

              {renderVoteButtons(event.e_no)}

              {votes[event.e_no] && (
                <div className="vote_results">
                  <p>참석: {votes[event.e_no].yes}</p>
                  <p>불참: {votes[event.e_no].no}</p>
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
          resetNewEvent();
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
              min={getTomorrowDate()}
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
                resetNewEvent();
              }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupEvent;
