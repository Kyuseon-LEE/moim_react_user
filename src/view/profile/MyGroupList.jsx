import React, { useEffect, useState } from "react";
import '../../css/profile/my_group_list.css';
import "../../css/profile/profile.css";
import Nav from './Nav';
import instance from '../../api/axios';

const MyGroupList = ({memberInfo, setMemberInfo}) => {
  const [groups, setGroups] = useState([]); // 그룹 데이터 상태
  const [error, setError] = useState(null);
  const [membershipState, setMembershipState] = useState(false);
  const [toggleState, setToggleState] = useState({});

  //그룹 정보 들고오기
  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken")
    instance.post('/group/getMyGroup', {accessToken: accessToken})
    .then(response => {
      console.log("나의 그룹 가져오기 성공---->", response.data.groupDtos);
      let group =response.data.groupDtos;
      setGroups(group)

      //토글 상태 설정
      const initialToggoleState = group.reduce((acc, curr) => {
        acc[curr.g_no] = curr.isPremium;
        return acc;
      },{});
      setToggleState(initialToggoleState);
    })
    .catch(err => {
      console.log("나의 그룹 가져오기 실패", err);
    });
  }, []);

  //멤버정보 들고오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
        try {
            const response = await instance.post('/member/getMemberInfo');
            setMemberInfo(response.data.memberDtos);
            let m_grade = response.data.memberDtos.m_grade;
            if(m_grade === 1) {
              setMembershipState(true)
            } else {
              setMembershipState(false)
            }
        } catch (err) {
            console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
        }
    };

    fetchMemberInfo();
}, []);


  //토글 스위칭
  const handleToggle = (g_no) => {
    if (!membershipState) {
      alert("프리미엄 멤버만 사용할 수 있습니다.");
      return;
    }

    const newState = !toggleState[g_no];

    setToggleState((prevStates) => ({
      ...prevStates,
      [g_no]: !prevStates[g_no] // 해당 그룹의 토글 상태만 반전
    }));


    const newStatus = newState ? 1 : 0;
    instance.post(`/group/updateGroupStatus`, {g_no, g_status: newStatus})
    .then(response => {
      console.log("그룹 상태 업데이트 성공", response.data);
    })
    .catch(err => {
      console.log("그룹 상태 업데이트 살패", err);
      setToggleState((prevStates) => ({
        ...prevStates,
        [g_no]: !newState,
      }));
    })
  };


  return (    
    <article className="my_group_article">
        <div className="my_group_article_wrap">
        <Nav />
            <div className="my_group_list">
            
            <h2>내가 관리하는 그룹</h2>
            <table className="group_table">
                <thead>
                    <tr>
                    <th>이미지</th>
                    <th>그룹 이름</th>
                    <th>위치</th>
                    <th>카테고리</th>
                    <th>멤버 수</th>
                    <th>프리미엄 여부</th>
                    </tr>
                </thead>
                <tbody>
              {groups.length > 0 ? (
                groups.map((group, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={group.g_img_name}
                        alt="그룹 이미지"
                        className="my_group_image"
                      />
                    </td>
                    <td>{group.g_name}</td>
                    <td>{group.g_location}</td>
                    <td>{group.g_category}</td>
                    <td>{group.memberCount}</td>
                    <td>
                      <div className="premium">
                      <div
                          className={`toggle-switch ${toggleState[group.g_no] ? "on" : "off"}`}
                          onClick={() => handleToggle(group.g_no)}
                        >
                          <div className="slider"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
                </table>
            </div>
        </div>
    </article>
  );
  
};

export default MyGroupList;
