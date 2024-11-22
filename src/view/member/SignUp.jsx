import React, { useState } from 'react';
import instance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import '../../css/member/signup.css';

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

    const signupForm = () => {
        let form = document.signup_form;
        const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,}$/; // 알파벳과 숫자가 포함된 6자 이상의 아이디
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

        if (form.m_id.value === '') {
            alert('아이디를 입력하세요');
            form.m_id.focus();

        } else if (!idRegex.test(form.m_id.value)) {
            alert('아이디는 6자 이상이어야 하며, 알파벳과 숫자가 모두 포함되어야 합니다');
            form.m_id.focus();

        } else if (form.m_pw.value === '') {
            alert('비밀번호를 입력하세요');
            form.m_pw.focus();

        } else if (!passwordRegex.test(form.m_pw.value)) {
            alert('비밀번호는 8자 이상이어야 하며, 알파벳, 숫자, 특수문자가 모두 포함되어야 합니다.');
            form.m_pw.focus();

        } else if (form.m_pw_again.value === '' ) {
            alert('비밀번호를 한번 더 입력해주세요');
            form.m_pw_again.focus();

        } else if (form.m_pw_again.value !== form.m_pw.value ) {
            alert('비밀번호가 일치하지 않습니다 다시 확인해주세요');
            form.m_pw_again.focus();

        } else if (form.m_nickname.value === '') {
            alert('닉네임을 입력하세요');
            form.m_nickname.focus();

        } else if (form.m_nickname.value.length > 10) {
            alert('닉네임은 10글자 이하로 입력해주세요');
            form.m_nickname.focus();

        } else if (!form.m_gender.value) {
            alert('성별을 선택해주세요');
            return false;

        } else if (form.m_age.value === '') {
            alert('연령대를 선택해주세요');
            form.m_age.focus();
            return false;

        } else if (form.m_mail.value === '') {
            alert('이메일을 입력하세요');
            form.m_mail.focus();

        }  else if (form.m_phone.value === '') {
            alert('전화번호를 입력하세요');
            form.m_phone.focus();

        } else if (nicknameStatus === '이미 사용 중인 닉네임입니다.') {
            alert('닉네임 중복확인을 진행해주세요');
        } else {
            form.submit();
        }
    }

    // Save to state
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

    const handleFileChange = (event) => {
        setProfileImage(event.target.files[0]);
    }

    //Check what already nickname
    // const handleNicknameCheck = async () => {
    //     try {
    //         const response = await instance.get(`/member/checkNickname?nickname=${m_nickname}`);
    //         if (response.data.isAvailable) {
    //             setNicknameStatus('사용 가능한 닉네임입니다.');
    //         } else {
    //             setNicknameStatus('이미 사용 중인 닉네임입니다.');
    //         }
    //     } catch (error) {
    //         console.error("닉네임 중복 확인 오류", error);
    //         setNicknameStatus('닉네임 중복 확인에 실패했습니다.');
    //     }
    // }

    //Submit to Server
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 비밀번호 확인 체크
        if (m_pw !== m_pw_again) {
            setFormError('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        //주소 합쳐서 보내기
        const fullAddress = `${postcode} ${address} ${detailAddress}`;

        if (profileImage) {
            formData.append('m_profile_img', profileImage);
        }
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

        instance.post('/member/signup_confirm', formData)
        .then(response => {
            console.log("[회원가입 성공]", response.data);
        })
        .catch(err => {
            console.log("[회원가입 문제발생]", err);
        });
    }

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
            setAddress(addr);
            },
        }).open();
    };


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
                                            name="upload"
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
                                        <p>※ 알파벳과 숫자를 포함해 6자 이상 적어주세요.</p>
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
                                         <p>※ 알파벳과 숫자를 포함해 8자 이상 적어주세요.</p>
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
                            <button type="submit" onClick={signupForm}>회원가입</button>
                        </div>
                    </form>
                </div>
            </div>
        </article>
    );
}

export default SignUp;
