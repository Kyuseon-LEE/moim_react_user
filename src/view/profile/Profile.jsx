import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../css/profile/profile.css';
import instance from '../../api/axios';

const Profile = () => {
    const [activeIndex, setActiveIndex] = useState(null); 
    const [memberInfo, setMemberInfo] = useState(null);  // 사용자 정보 상태
    const [nicknameEdit, setNicknameEdit] = useState(false);  // 닉네임 편집 모드 상태
    const [genderEdit, setGenderEdit] = useState(false);  // 성별 편집 모드 상태
    const [phoneEdit, setPhoneEdit] = useState(false);  // 휴대폰 번호 편집 모드 상태
    const [addressEdit, setAddressEdit] = useState(false);  // 주소 편집 모드 상태
    const [newNickname, setNewNickname] = useState("");  // 새로운 닉네임 값
    const [newGender, setNewGender] = useState(""); // 새로운 성별
    const [newPhone, setNewPhone] = useState(""); // 새로운 휴대폰 번호
    const [newAddress, setNewAddress] = useState(""); // 새로운 주소
    const [postcode, setPostcode] = useState(""); // 새로운 우편번호
    const [detailAddress, setDetailAddress] = useState(""); // 상세 주소


    // 사용자 정보를 가져오는 함수
    useEffect(() => {
        instance.post('/member/getMemberInfo')
            .then(response => {
                console.log("성공적으로 사용자의 정보를 가져왔습니다.");
                setMemberInfo(response.data.memberDtos);
                setNewNickname(response.data.memberDtos.m_nickname); 
                setNewGender(response.data.memberDtos.m_gender);
                setNewPhone(response.data.memberDtos.m_phone); 
                setNewAddress(response.data.memberDtos.m_address);
            })
            .catch(err => {
                console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
            });
    }, []);

    //입력 값 변경 핸들러
    const handleNicknameChange = (e) => {
        setNewNickname(e.target.value);
    };

    const handleGenderChange = (e) => {
        setNewGender(e.target.value);
    };
    const handlePhoneChange = (e) => {
        setNewPhone(e.target.value);
    }
    const handleAddressChange = (e) => {
        setDetailAddress(e.target.value);
    };
    

    // 수정 버튼 클릭 시 편집 모드 전환
    const handleEditClick = (field) => {
        if (field === 'nickname') {
            setNicknameEdit(true);  // 닉네임 편집 모드 활성화
        } else if (field === 'gender') {
            setGenderEdit(true);  // 성별 편집 모드 활성화
        } else if (field === 'phone') {
            setPhoneEdit(true);  // 휴대폰 편집 모드 활성화
        } else if (field === 'address') {
            setAddressEdit(true);  // 주소 편집 모드 활성화
        }
    };

    // 취소 버튼 클릭 시 값 원래대로 돌아가고 편집 모드 종료
    const handleCancelClick = (field) => {
        if (field === 'nickname') {
            setNicknameEdit(false);
            setNewNickname(memberInfo.m_nickname);  
        } else if (field === 'gender') {
            setGenderEdit(false);
            setNewGender(memberInfo.m_gender);
        } else if (field === 'phone') {
            setPhoneEdit(false);
            setNewPhone(memberInfo.m_phone);  
        } else if (field === 'address') {
            setAddressEdit(false);
            setNewAddress(memberInfo.m_address);
            setPostcode(""); // 우편번호 초기화
            setDetailAddress(""); // 상세 주소 초기화
        }
    };

    const formData = new FormData();
    formData.append("m_nickname", newNickname);
    formData.append("m_gender", newGender);
    formData.append("m_phone", newPhone);
    formData.append("m_address", `${postcode} ${newAddress} ${detailAddress}`);

    const handleSaveClick = () => {
        instance.post('/member/updateMemberInfo', formData)
            .then(response => {
                console.log("정보가 업데이트되었습니다.", response.data);
                setMemberInfo({
                    ...memberInfo,
                    m_nickname: newNickname,  // 변경된 닉네임 반영
                    m_gender: newGender,  // 변경된 성별 반영
                    m_phone: newPhone,    // 변경된 휴대폰 번호 반영
                    m_address: `${postcode} ${newAddress} ${detailAddress}`,  // 변경된 주소 반영
                });
                setNicknameEdit(false);  
                setGenderEdit(false);  
                setPhoneEdit(false); 
                setAddressEdit(false); 
            })
            .catch(err => {
                console.error("정보 업데이트에 실패했습니다.", err);
            });
    };

    //새로운 주소 Daum으로 받기
    
        //Daum address
        const openPostcodePopup = () => {
            new window.daum.Postcode({
                oncomplete: (data) => {
                const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
    
                let extraAddr = ''; // 참고 항목
                if (data.userSelectedType === 'R') {
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName);
                    }
                }
    
                setNewAddress(data.zonecode);
                setNewAddress(addr);
                },
            }).open();
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
                                        {nicknameEdit ? (
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
                                                    onClick={() => handleCancelClick('nickname')}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <span id="nickname">{memberInfo.m_nickname}</span>
                                                <input
                                                    type="button"
                                                    value="변경"
                                                    onClick={() => handleEditClick('nickname')}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className="gender">
                                        <span>성별</span>
                                        {genderEdit ? (
                                            <select
                                                value={newGender}
                                                onChange={handleGenderChange}
                                            >
                                                <option value="M">남자</option>
                                                <option value="W">여자</option>
                                            </select>
                                        ) : (
                                            <span id="gender">
                                                {memberInfo.m_gender === "M" ? "남자" : "여자"}
                                            </span>
                                        )}
                                        {genderEdit ? (
                                            <>
                                                <input
                                                    type="button"
                                                    value="확인"
                                                    name="confirm"
                                                    onClick={handleSaveClick}
                                                />
                                                <input
                                                    type="button"
                                                    value="취소"
                                                    onClick={() => handleCancelClick('gender')}
                                                />
                                            </>
                                        ) : (
                                            <input
                                                type="button"
                                                value="변경"
                                                onClick={() => handleEditClick('gender')}
                                            />
                                        )}
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
                                        {phoneEdit ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={newPhone}
                                                    onChange={handlePhoneChange}
                                                />
                                                <input
                                                    type="button"
                                                    value="확인"
                                                    onClick={handleSaveClick}
                                                />
                                                <input
                                                    type="button"
                                                    value="취소"
                                                    onClick={() => handleCancelClick('phone')}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <span id="phone">{memberInfo.m_phone}</span>
                                                <input
                                                    type="button"
                                                    value="변경"
                                                    onClick={() => handleEditClick('phone')}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className="address">
                                        <span>주소</span>
                                        {addressEdit ? (
                                            <div className="edit">
                                                <div>
                                                    <input
                                                        type="text"
                                                        id="postcode"
                                                        name="postcode"
                                                        value={postcode}
                                                        placeholder="우편번호"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={newAddress}
                                                        placeholder="주소"
                                                        readOnly
                                                    />
                                                </div>
                                                <button onClick={openPostcodePopup}>
                                                        우편번호 찾기
                                                </button>
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="addressDetail"
                                                        value={detailAddress}
                                                        onChange={handleAddressChange}
                                                        placeholder="상세 주소"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="button"
                                                        value="확인"
                                                        onClick={handleSaveClick}
                                                    />
                                                    <input
                                                        type="button"
                                                        value="취소"
                                                        onClick={() => handleCancelClick('address')}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="address1">{newAddress}</span>
                                                {/* <span className="address1">{detailAddress}</span> */}
                                                <input
                                                    type="button"
                                                    value="변경"
                                                    onClick={() => handleEditClick('address')}
                                                />
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                "로딩 중..."
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Profile;
