import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../../css/member/signup.css';

const SocialLogin = ({ userInfo }) => {
    const navigate = useNavigate();
    const [socialId, setSocialId] = useState(userInfo?.m_kakao_id || userInfo?.m_mail);
    const [socialType, setSocialType] = useState(userInfo?.m_kakao_id ? 'kakao' : 'google');
    const [m_name, setM_name] = useState(userInfo?.m_name || '');  // 기본 값은 userInfo에서 받아오도록 설정
    const [m_mail, setM_mail] = useState(userInfo?.m_mail || '');  // 이메일을 기본 값으로 설정
    const [m_phone, setM_phone] = useState('');
    const [m_nickname, setM_nickname] = useState('');
    const [m_gender, setM_gender] = useState('');
    const [m_age, setM_age] = useState('');
    const [nicknameStatus, setNicknameStatus] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [m_profile_img, setM_profile_img] = useState(userInfo?.m_profile_img || null);


    useEffect(() => {
        localStorage.setItem('m_mail', m_mail);
        localStorage.setItem('m_name', m_name);
        localStorage.setItem('m_profile_img', m_profile_img);

    }, []);

    // Daum 주소 찾기 팝업
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

    const handleInputData = (event) => {
        const { name, value } = event.target;
        if (name === 'm_mail') setM_mail(value);
        else if (name === 'm_phone') setM_phone(value);
        else if (name === 'm_nickname') setM_nickname(value);
        else if (name === 'm_gender') setM_gender(value);
        else if (name === 'm_age') setM_age(value);
        else if (name === 'postcode') setPostcode(value)
        else if (name === 'address') setAddress(value)
        else if (name === 'detailAddress') setDetailAddress(value)
    }

    const handleFileChange = (event) => {
        setM_profile_img(event.target.files[0]);
    }

    // Submit to Server
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // 주소 합쳐서 보내기
        const fullAddress = `${postcode} ${address} ${detailAddress}`;

        const formData = new FormData();
        formData.append("m_social_id", socialId);
        formData.append('m_social_type', socialType);
        formData.append('m_name', m_name);
        formData.append('m_mail', m_mail);
        formData.append('m_phone', m_phone);
        formData.append('m_nickname', m_nickname);
        formData.append('m_gender', m_gender);
        formData.append('m_age', m_age);
        formData.append('m_address', fullAddress);
        if (m_profile_img) {
            formData.append("file", m_profile_img);
        } 
        console.log("formData", socialId);
        console.log("formData", socialType);
        console.log("formData", m_name);
        console.log("formData", m_phone);
        console.log("formData", m_mail);
        console.log("formData", m_nickname);
        console.log("formData", m_age);
        console.log("formData", fullAddress);
        console.log("formData", m_profile_img);

        axios.post('http://localhost:5000/member/social_signup', formData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,  
        })
        .then(response => {
            console.log("[회원가입 성공]", response.data);
            navigate("/"); 
        })
        .catch(err => {
           console.log("회원가입 도중 문제가 발생했습니다.", err);
           alert("문제가 발생했습니다. 관리자에게 문의 하세요");
        });
    }

    return (
        <article className='signup_article'>
            <div className='article_wrap'>
                <div className='title'>
                    <h4>추가 정보</h4>
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
                                            src={m_profile_img ? m_profile_img : "/img/profile_default.png"}
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
                                            type="text"
                                            id="m_name"
                                            name="m_name"
                                            placeholder="이름을 입력하세요."
                                            value={m_name}
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
                                        <button type="button">중복확인</button>
                                        <p>{nicknameStatus}</p>
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
                            <button type="submit">확인</button>
                        </div>
                    </form>
                </div>
            </div>
        </article>
    );
}

export default SocialLogin;
