import React, { useState, useEffect } from "react";
import "../../css/group/group_event.css";

const GroupEvent = ({ g_no }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    e_title: "",
    e_text: "",
    e_max_num: 0,
    e_start_date: "",
    e_end_date: "",
    e_location: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleAddEvent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/group/${g_no}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert("일정이 등록되었습니다.");
        fetchEvents();
      } else {
        alert("일정 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="moim_board">
      <h2>정모 일정 관리</h2>

      <div className="schedule_list">
        {events.map((event) => (
          <div className="schedule_card" key={event.e_no}>
            <h3>{event.e_title}</h3>
            <p>날짜: {event.e_start_date}</p>
            <p>시간: {event.e_end_date}</p>
            <p>장소: {event.e_location}</p>
            <p>{event.e_text}</p>
          </div>
        ))}
      </div>

      <div className="schedule_form">
        <h3>새 일정 추가</h3>
        <input
          type="text"
          placeholder="제목"
          name="e_title"
          value={newEvent.e_title}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="e_start_date"
          value={newEvent.e_start_date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="e_end_date"
          value={newEvent.e_end_date}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="장소"
          name="e_location"
          value={newEvent.e_location}
          onChange={handleInputChange}
        />
        <textarea
          placeholder="추가 설명"
          name="e_text"
          value={newEvent.e_text}
          onChange={handleInputChange}
        ></textarea>
        <button onClick={handleAddEvent}>일정 추가</button>
      </div>
    </div>
  );
};

export default GroupEvent;
