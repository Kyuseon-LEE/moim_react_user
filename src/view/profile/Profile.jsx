import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../css/profile/profile.css';
import instance from '../../api/axios';

const Profile = () => {
    const [activeIndex, setActiveIndex] = useState(null); 
    const [memberInfo, setMemberInfo] = useState(null);  // 사용자 정보 상태
    const [isEdit, setIsEdit] = useState(false);   // 편집 모드 상태
    const [newNickname, setNewNickname] = useState("");  // 새로운 닉네임 값

    // 사용자 정보를 가져오는 함수
    useEffect(() => {
        instance.post('/member/getMemberInfo')
            .then(response => {
                console.log("성공적으로 사용자의 정보를 가져왔습니다.");
                setMemberInfo(response.data.memberDtos); // 사용자 정보를 상태에 저장
                setNewNickname(response.data.memberDtos.m_nickname);  // 초기 닉네임 값 설정
            })
            .catch(err => {
                console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
            });
    }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때 한 번 실행

    // 닉네임 입력 값 변경 핸들러
    const handleNicknameChange = (e) => {
        setNewNickname(e.target.value);
    };

    // 수정 버튼 클릭 시 편집 모드 전환
    const handleEditClick = () => {
        setIsEdit(true);  // 편집 모드 활성화
    };

    // 취소 버튼 클릭 시 닉네임 원래대로 돌아가고 편집 모드 종료
    const handleCancelClick = () => {
        setIsEdit(false);  // 편집 모드 종료
        setNewNickname(memberInfo.m_nickname);  // 닉네임을 원래 값으로 되돌리기
    };

    const handleSaveClick = () => {
        // 새로운 닉네임 서버에 저장하는 API 호출
        instance.post('/member/updateNickname', { newNickname })
            .then(response => {
                console.log("닉네임이 업데이트되었습니다.", response.data);
                setMemberInfo({
                    ...memberInfo,
                    m_nickname: newNickname,  // 변경된 닉네임 반영
                });
                setIsEdit(false);  
            })
            .catch(err => {
                console.error("닉네임 업데이트에 실패했습니다.", err);
            });
    };

    return (
        <article className="article4">
            <div className="profile_article_wrap">
                <div className="side_bar">
                    <ul>
                        {['내 정보', '###', '###', '###'].map((text, index) => (
                            <li
                                key={index}
                                className={activeIndex === index ? "active" : ""}
                                onClick={() => setActiveIndex(index)}
                            >
                                <div><Link to={index === 0 ? "/profile" : "#none"}>{text}</Link></div>
                                <img src="/img/arrow-left.png" alt="arrow-left" />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="my_info">
                    <div className="info_title">내 정보</div>
                    <div className="use_profile">
                        <div className="text">사용 중인 프로필</div>
                        <div className="profile_img">
                            {memberInfo?.m_profile_img ? (
                                <img src={memberInfo.m_profile_img} alt="프로필 이미지" />
                            ) : (
                                "이미지없음"
                            )}
                        </div>
                    </div>
                    <div className="private_info">
                        <div className="text">개인정보</div>
                        <div>
                            {memberInfo ? (
                                <>
                                    <div className="nickname">
                                        <span>닉네임</span>
                                        {isEdit ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="new_nickname"
                                                    value={newNickname}
                                                    onChange={handleNicknameChange}
                                                />
                                                <input
                                                    type="button"
                                                    value="확인"
                                                    name="confirm"
                                                    onClick={handleSaveClick}
                                                />
                                                <input
                                                    type="button"
                                                    value="취소"
                                                    onClick={handleCancelClick}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <span id="nickname">{memberInfo.m_nickname}</span>
                                                <input
                                                    type="button"
                                                    value="변경"
                                                    onClick={handleEditClick}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className="gender">
                                        <span>성별</span>
                                        <span id="gender">
                                            {memberInfo.m_gender === "M" ? "남자" : memberInfo.m_gender === "W" ? "여자" : "기타"}
                                        </span>
                                        <input type="button" value="변경" />
                                    </div>
                                    <div className="category_info">
                                        <span>카테고리</span>
                                        <span id="category">
                                            {memberInfo.m_category === null ? "없음" : "있음"}
                                        </span>
                                        <input type="button" value="변경" />
                                    </div>
                                </>
                            ) : (
                                <div>로딩 중...</div>
                            )}
                        </div>
                    </div>
                    <div className="login_account">
                        <div className="text">로그인계정</div>
                        <div className="content">
                            {memberInfo ? (
                                <>
                                    <div className="id">
                                        <span>아이디</span>
                                        <span id="id">{memberInfo.m_id}</span>
                                    </div>
                                    <div className="phone">
                                        <span>휴대폰 번호</span>
                                        <span id="phone">{memberInfo.m_phone}</span>
                                        <input type="button" value="변경" />
                                    </div>
                                    <div className="address">
                                        <span>주소지</span>
                                        <span id="address">{memberInfo.m_address}</span>
                                        <input type="button" value="변경" />
                                    </div>
                                    <div className="status">
                                        <span>멤버쉽</span>
                                        <span id="status">{memberInfo.m_status === 1 ? "일반회원" : "프리미엄 회원"}</span>
                                        <input type="button" value="구매" />
                                    </div>
                                </>
                            ) : (
                                <div>로딩 중...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Profile;
