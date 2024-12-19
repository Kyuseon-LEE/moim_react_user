import React, { useState } from 'react';
import instance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import '../../css/member/signup.css';
import SignupSuccess from "./SignupSuccess";
import axios from "axios";

const SignUp = () => {
    const navigate = useNavigate();
    const [m_id, setM_id] = useState('');
    const [m_pw, setM_pw] = useState('');
    const [m_pw_again, setM_pw_again] = useState('');
    const [m_mail, setM_mail] = useState('');
    const [m_phone, setM_phone] = useState('');
    const [m_name, setM_name] = useState('');
    const [m_nickname, setM_nickname] = useState('');
    const [m_gender, setM_gender] = useState('');
    const [m_age, setM_age] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [nicknameStatus, setNicknameStatus] = useState('');
    const [formError, setFormError] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');

        //Daum address
        const openPostcodePopup = () => {
            new window.daum.Postcode({
                oncomplete: (data) => {
                const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
    
                let extraAddr = '';
                if (data.userSelectedType === 'R') {
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName);
                    }
                }
    
                setPostcode(data.zonecode);
                setAddress(addr);
                },
            }).open();
        };


    //데이터
    const handleInputData = (event) => {
        const { name, value } = event.target;
        if (name === 'm_id') setM_id(value);
        else if (name === 'm_pw') setM_pw(value);
        else if (name === 'm_pw_again') setM_pw_again(value);
        else if (name === 'm_mail') setM_mail(value);
        else if (name === 'm_phone') setM_phone(value);
        else if (name === 'm_name') setM_name(value);
        else if (name === 'm_nickname') setM_nickname(value);
        else if (name === 'm_gender') setM_gender(value);
        else if (name === 'm_age') setM_age(value);
        else if (name === 'postcode') setPostcode(value)
        else if (name === 'address') setAddress(value)
        else if (name === 'detailAddress') setDetailAddress(value)
    }
    //이미지 데이터
    const handleFileChange = (event) => {
        setProfileImage(event.target.files[0]);
    }

    //서버전송
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // 유효성 검사
        if (!m_name || !m_id || !m_pw || !m_mail || !m_phone || !m_nickname || !m_gender || !m_age || !postcode || !address || !detailAddress) {
            setFormError('모든 필드를 입력해주세요.');
            return;
        }
    
        if (m_id.length < 6) {
            setFormError('아이디는 최소 6자 이상이어야 합니다.');
            return;
        }
    
        if (m_pw.length < 8) {
            setFormError('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }
    
        if (m_pw !== m_pw_again) {
            setFormError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (nicknameStatus === "이미 존재하는 닉네임 입니다") {
            setFormError("닉네임이 이미 존재합니다. 다른 닉네임을 선택해주세요.");
            return;
        }
    
        // 주소 합쳐서 보내기
        const fullAddress = `${postcode} ${address} ${detailAddress}`;
    
        const formData = new FormData();
        formData.append('m_name', m_name);
        formData.append('m_id', m_id);
        formData.append('m_pw', m_pw);
        formData.append('m_mail', m_mail);
        formData.append('m_phone', m_phone);
        formData.append('m_nickname', m_nickname);
        formData.append('m_gender', m_gender);
        formData.append('m_age', m_age);
        formData.append('m_address', fullAddress);

        if (!profileImage) {
            const defaultImageResponse = await fetch("/img/profile_default.png");
            const defaultImageBlob = await defaultImageResponse.blob();
            formData.append("file", defaultImageBlob, "profile_default.png");
        } else {
            formData.append("file", profileImage);
        }
    
        axios.post('http://3.34.115.75:5000/member/signup_confirm', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,  
        })
        .then(response => {
            console.log("[회원가입 성공]", response.data);
            navigate("/login"); 
        })
        .catch(err => {
            if (err.response && err.response.data) {
                setFormError(err.response.data.message || "회원가입 중 오류가 발생했습니다.");
            } else {
                setFormError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
            }
        });
    };

    const checkId = () => {
        if (m_id === '') {
            return;  // 닉네임이 비어있는 경우 요청을 보내지 않음
        } else {
            instance.get(`/member/checkNickname`, {
                params: { m_id: m_id }
            })
            .then(response => {
                console.log("아이디 중복체크 응답", response.data);
                let nicknameStatus = response.data;
                if(nicknameStatus === 18) {
                    setNicknameStatus("사용 가능한 아이디 입니다.");
                } else {
                    setNicknameStatus("이미 존재하는 아이디 입니다");
                }
            })
            .catch(err => {
                console.log("닉네임 중복문제 ", err);
            });
        }
    }
    
    return (
        <article className='signup_article'>
            <div className='article_wrap'>
                <div className='title'>
                    <h4>회원가입</h4>
                </div>
                <div className='content'>
                    <form name="signup_form" onSubmit={handleSubmit} encType='multipart/form-data'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>프로필 사진</td>
                                    <td>
                                        <img
                                            className="profileImg"
                                            src={profileImage ? URL.createObjectURL(profileImage) : "/img/profile_default.png"}
                                            alt="Profile Preview"
                                            id="profilePreview"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => document.getElementById('fileInput').click()}
                                        />
                                        <input
                                            type="file"
                                            className="upload"
                                            name="m_profile_img"
                                            accept="image/*"
                                            id="fileInput"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>이름</td>
                                    <td>
                                        <input
                                            type='text'
                                            id='m_name'
                                            name='m_name'
                                            placeholder='이름을 입력하세요.'
                                            value={m_name}
                                            onChange={handleInputData}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>아이디</td>
                                    <td>
                                        <input
                                            type='text'
                                            id='m_id'
                                            name='m_id'
                                            placeholder='아이디를 입력하세요.'
                                            value={m_id}
                                            onChange={handleInputData}
                                        />
                                        {/* 아이디 중복확인입니다. 닉네임x*/}
                                        <button type="button" onClick={checkId}>중복확인</button>
                                        <p>{nicknameStatus}</p>
                                        <p>※ 아이디는 4자 이상 적어주세요.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>비밀번호</td>
                                    <td>
                                        <input
                                            type='password'
                                            id='m_pw'
                                            name='m_pw'
                                            placeholder='비밀번호를 입력하세요.'
                                            value={m_pw}
                                            onChange={handleInputData}
                                        />
                                         <p>※ 비밀번호는 8자 이상 적어주세요.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>비밀번호 확인</td>
                                    <td>
                                        <input
                                            type='password'
                                            id='m_pw_again'
                                            name='m_pw_again'
                                            placeholder='비밀번호를 확인 입력하세요.'
                                            value={m_pw_again}
                                            onChange={handleInputData}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>이메일</td>
                                    <td>
                                        <input
                                            type='email'
                                            id='m_mail'
                                            name='m_mail'
                                            placeholder='이메일을 입력하세요.'
                                            value={m_mail}
                                            onChange={handleInputData}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>전화번호</td>
                                    <td>
                                        <input
                                            type='text'
                                            id='m_phone'
                                            name='m_phone'
                                            placeholder='전화번호를 입력하세요.'
                                            value={m_phone}
                                            onChange={handleInputData}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>닉네임</td>
                                    <td>
                                        <input
                                            type='text'
                                            id='m_nickname'
                                            name='m_nickname'
                                            placeholder='닉네임을 입력하세요.'
                                            value={m_nickname}
                                            onChange={handleInputData}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>성별</td>
                                    <td>
                                        <input
                                            type="radio"
                                            name="m_gender"
                                            value="M"
                                            checked={m_gender === 'M'}
                                            onChange={handleInputData}
                                        /> 남성
                                        <input
                                            type="radio"
                                            name="m_gender"
                                            value="F"
                                            checked={m_gender === 'F'}
                                            onChange={handleInputData}
                                        /> 여성
                                    </td>
                                </tr>
                                <tr>
                                    <td>연령대</td>
                                    <td>
                                        <select
                                            name="m_age"
                                            value={m_age}
                                            onChange={handleInputData}
                                        >
                                            <option value="">연령대를 선택하세요</option>
                                            <option value="10대">10대</option>
                                            <option value="20대">20대</option>
                                            <option value="30대">30대</option>
                                            <option value="40대">40대</option>
                                            <option value="50대 이상">50대 이상</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>주소</td>
                                    <td>
                                        <div className='address_container'>
                                        <input
                                            type="text"
                                            name="postcode"
                                            value={postcode}
                                            readOnly
                                            placeholder="우편번호"
                                        />
                                        <input
                                            type="text"
                                            name="address"
                                            value={address}
                                            readOnly
                                            placeholder="주소"
                                        />
                                        <button type="button" onClick={openPostcodePopup}>주소 찾기</button>
                                        </div>
                                        <input
                                            type="text"
                                            name="detailAddress"
                                            value={detailAddress}
                                            onChange={handleInputData}
                                            placeholder="상세 주소"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            {formError && <p className="error-message">{formError}</p>}
                            <button type="submit" onClick={handleSubmit}>회원가입</button>
                        </div>
                    </form>
                </div>
            </div>
        </article>
    );
}

export default SignUp;
