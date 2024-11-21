import React, { useState } from 'react';
import instance from '../../api/axios';
import { useNavigate } from 'react-router-dom';

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
    }

    const handleFileChange = (event) => {
        setProfileImage(event.target.files[0]);
    }

    const handleNicknameCheck = async () => {
        try {
            const response = await instance.get(`/member/checkNickname?nickname=${m_nickname}`);
            if (response.data.isAvailable) {
                setNicknameStatus('사용 가능한 닉네임입니다.');
            } else {
                setNicknameStatus('이미 사용 중인 닉네임입니다.');
            }
        } catch (error) {
            console.error("닉네임 중복 확인 오류", error);
            setNicknameStatus('닉네임 중복 확인에 실패했습니다.');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 비밀번호 확인 체크
        if (m_pw !== m_pw_again) {
            setFormError('비밀번호가 일치하지 않습니다.');
            return;
        }

        const formData = new FormData();
        formData.append('m_id', m_id);
        formData.append('m_pw', m_pw);
        formData.append('m_mail', m_mail);
        formData.append('m_phone', m_phone);
        formData.append('m_name', m_name);
        formData.append('m_nickname', m_nickname);
        formData.append('m_gender', m_gender);
        formData.append('m_age', m_age);
        if (profileImage) {
            formData.append('upload', profileImage);
        }

        try {
            const response = await instance.post('/member/signupConfirm', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("회원가입 성공", response.data);
            navigate('/'); // 회원가입 후 이동할 페이지
        } catch (error) {
            console.error("회원가입 오류", error);
        }
    }

    return (
        <article className='signup_article'>
            <div className='article_wrap'>
                <div className='title'>
                    <h4>회원가입</h4>
                </div>
                <div className='content'>
                    <form onSubmit={handleSubmit} encType='multipart/form-data'>
                        <table>
                            <tbody>  {/* <tbody> 태그로 tr을 감쌈 */}
                                <tr>
                                    <td>프로필 사진</td>
                                    <td>
                                        <img className="profileImg" src={profileImage ? URL.createObjectURL(profileImage) : "/img/profile_default.png"} alt="Profile Preview" id="profilePreview" /><br />
                                        <input
                                            type="file"
                                            className="upload"
                                            name="upload"
                                            accept="image/*"
                                            id="fileInput"
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
                                        <p>※ 알파벳과 숫자, 특수문자를 포함해 8자 이상 적어주세요.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>비밀번호 확인</td>
                                    <td>
                                        <input
                                            type='password'
                                            id='m_pw_again'
                                            name='m_pw_again'
                                            placeholder='비밀번호가 일치하도록 입력하세요.'
                                            value={m_pw_again}
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
                                        <button type="button" onClick={handleNicknameCheck}>중복확인</button><br />
                                        <span id="nicknameStatus" style={{ color: nicknameStatus.includes('사용') ? 'green' : 'red' }}>{nicknameStatus}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>성별</td>
                                    <td>
                                        <label>남성 <input
                                            type="radio"
                                            name="m_gender"
                                            value="male"
                                            onChange={handleInputData}
                                        /></label>
                                        <label>여성 <input
                                            type="radio"
                                            name="m_gender"
                                            value="female"
                                            onChange={handleInputData}
                                        /></label>
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
                                            <option value="">-----------선택-----------</option>
                                            <option value="10">10대</option>
                                            <option value="20">20대</option>
                                            <option value="30">30대</option>
                                            <option value="40">40대</option>
                                            <option value="50">50대</option>
                                            <option value="60">60대</option>
                                            <option value="70">70대</option>
                                            <option value="80">80대</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>이메일</td>
                                    <td>
                                        <input
                                            type="text"
                                            id="m_mail"
                                            name="m_mail"
                                            placeholder="이메일을 입력하세요"
                                            value={m_mail}
                                            onChange={handleInputData}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>휴대전화</td>
                                    <td>
                                        <input
                                            type="text"
                                            id="m_phone"
                                            name="m_phone"
                                            placeholder="전화번호를 입력하세요"
                                            value={m_phone}
                                            onChange={handleInputData}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>주소</td>
                                    <td>
                                        <input type="text" id="sample6_postcode" placeholder="우편번호" /><br />
                                        <input type="button" onclick="sample6_execDaumPostcode()" value="우편번호 찾기" /><br></br>
                                        <input type="text" id="sample6_address" placeholder="주소" /><br />
                                        <input type="text" id="sample6_detailAddress" placeholder="상세주소" /><br />
                                        <button type="button">우편번호 찾기</button><br />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {formError && <p style={{ color: 'red' }}>{formError}</p>}

                        <button type="submit" className="btn_submit">가입하기</button>
                    </form>
                </div>
            </div>
        </article>
    );
}

export default SignUp;
