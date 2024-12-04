import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../css/profile/profile.css';
// import  '../../css/profile/categorySelector.css';
import instance from '../../api/axios';
import Modal from "./Modal";
import Nav from './Nav';

const Profile = () => {
    const [activeIndex, setActiveIndex] = useState(null); 
    const [memberInfo, setMemberInfo] = useState(null);  // 사용자 정보 상태
    const [nicknameEdit, setNicknameEdit] = useState(false);  // 닉네임 편집 모드 상태
    const [genderEdit, setGenderEdit] = useState(false);  // 성별 편집 모드 상태
    const [phoneEdit, setPhoneEdit] = useState(false);  // 휴대폰 번호 편집 모드 상태
    const [addressEdit, setAddressEdit] = useState(false);  // 주소 편집 모드 상태
    const [profileImgEdit, setProfileImgEdit] = useState(false); //프로필 이미지 상태값
    const [categoriesEdit, setCategoriesEdit]   = useState(false)       
    const [newNickname, setNewNickname] = useState("");  // 새로운 닉네임 값
    const [newGender, setNewGender] = useState(""); // 새로운 성별
    const [newPhone, setNewPhone] = useState(""); // 새로운 휴대폰 번호
    const [newAddress, setNewAddress] = useState(""); // 새로운 주소
    const [newCategories, setNewCategories] = useState("");
    const [postcode, setPostcode] = useState(""); // 새로운 우편번호
    const [detailAddress, setDetailAddress] = useState(""); // 상세 주소
    const [newProfileImg, setNewProfileImg] = useState(null); //프로필 이미지
    const [profileImgFile, setProfileImgFile] = useState(null); // 새로운 이미지 파일 객체
    const [categories, setCategories] = useState("");
    const [memberId, setMemberId] = useState(""); //사용자 ID값
    const [mGrade, setMGrade] = useState('');

    const navigate = useNavigate();

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
                setProfileImgFile(response.data.memberDtos.m_profile_img);
                setMemberId(response.data.memberDtos.m_id || response.data.memberDtos.m_social_id);
                setCategories(response.data.memberDtos.m_category);
                setMGrade(response.data.memberDtos.m_grade);

            })
            .catch(err => {
                console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
            });
    }, []);

    useEffect(() => {

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
    const handleCategoryChange = useCallback((categories, callback) => {
        setNewCategories(categories); // 상태 업데이트
        if (callback) callback(); // 상태 변경 후 콜백 실행
    }, []);
    const handleProfileImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImgFile(file);
            setNewProfileImg(URL.createObjectURL(file));  
        }
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
        } else if (field === "category") {
            setCategoriesEdit(true)
            console.log("###")
        } else if (field === 'm_profile_img') {
            setProfileImgEdit(true)
            document.getElementById("profileImgInput").click();
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
        } else if(field === 'm_profile_img') {
            setProfileImgEdit(false);
            setProfileImgFile(memberInfo.m_profile_img)
        } 
    };

    const modalCancel = () => {
        setCategoriesEdit(false);  // 모달 닫기 상태
        setCategories(memberInfo.m_category);  // 초기값으로 되돌리기
    }
    const handleSaveClick = useCallback(() => {
        const formData = new FormData();
        formData.append("m_nickname", newNickname);
        formData.append("m_gender", newGender);
        formData.append("m_phone", newPhone);
        formData.append("m_address", `${postcode} ${newAddress} ${detailAddress}`);
        formData.append("m_id", memberId);
        if(newCategories==="") {
            formData.append("m_category", categories)
        } else {
            formData.append("m_category", newCategories);
        }
        if(profileImgFile) {
            formData.append("file", profileImgFile);
        }
        instance.post('/member/updateMemberInfo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            console.log("정보가 업데이트되었습니다.", response.data);
            setMemberInfo({
                ...memberInfo,
                m_nickname: newNickname,  // 변경된 닉네임 반영
                m_gender: newGender,  // 변경된 성별 반영
                m_phone: newPhone,    // 변경된 휴대폰 번호 반영
                m_address: `${postcode} ${newAddress} ${detailAddress}`,  // 변경된 주소 반영
                m_profile_img : newProfileImg || memberInfo.m_profile_img,  // 변경된 이미지 반영 (새 이미지가 없으면 기존 이미지 유지)
                m_category : newCategories
            });
            setNicknameEdit(false);  
            setGenderEdit(false);  
            setPhoneEdit(false); 
            setAddressEdit(false);
            setProfileImgEdit(false); 
            setCategoriesEdit(false);
        })
        .catch(err => {
            console.error("정보 업데이트에 실패했습니다.", err);
        });
    })

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
    
                setPostcode(data.zonecode);
                setNewAddress(addr);
                },
            }).open();
        };
    return (
        <article className="article4">
            <div className="profile_article_wrap">
                <Nav setActiveIndex={setActiveIndex}/>
                <div className="my_info">
                    <div className="info_title">내 정보</div>
                    <div className="use_profile">
                    <div className="text">사용 중인 프로필</div>
                    <div className="profile_img">
                            {/* 프로필 이미지가 있으면 새로운 이미지, 없으면 기존 이미지 */}
                            {newProfileImg ? (<img src={newProfileImg} alt="프로필 이미지" />) : memberInfo?.m_profile_img ? (<img src={memberInfo.m_profile_img} alt="프로필 이미지" />) : (<></>)}
                        </div>
                        {/* 프로필 이미지 파일 입력 */}
                        <input
                            type="file"
                            id="profileImgInput"
                            style={{ display: "none" }}
                            onChange={handleProfileImgChange}
                            accept="image/*"
                        />
                        {/* 편집 모드에서 확인/취소 버튼 */}
                        {profileImgEdit ? (
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
                                    onClick={() => handleCancelClick('m_profile_img')}
                                />
                            </>
                        ) : (
                            <input
                                type="button"
                                value="변경"
                                onClick={() => handleEditClick('m_profile_img')}
                            />
                        )}
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
                                        {categoriesEdit ? (
                                            <div>
                                                <Modal 
                                                    isOpen={categoriesEdit} 
                                                    onCategoryChange={handleCategoryChange} 
                                                    closeModal={modalCancel} 
                                                    handleSaveClick={handleSaveClick} 
                                                    initialCategories={categories}
                                                />
                                            {/* 다른 UI 요소들 */}
                                        </div>
                                        ) : (
                                            <>
                                            <span id="category">
                                                {categories !== null ? categories : "없음"}
                                            </span>
                                            <input type="button" value="변경" onClick={() => handleEditClick('category')}/>
                                            </>
                                        )}
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
                                    <div className="grade">
                                        <span>멤버쉽</span>
                                        <span id="grade">{memberInfo.m_grade === 0 ? "일반회원" : "프리미엄 회원"}</span>
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
