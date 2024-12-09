import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from '../../api/axios';
import '../../css/member/findId.css';

const FindPw = () => {
    const [activeTab, setActiveTab] = useState("findPw");
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [findId, setFindId] = useState(null);
    const [mRegDate, setMRegDate] = useState(null);
    const [id, setId] = useState(null);
    const [mail, setMail] = useState(null);
    const [notUser, setNotUser] = useState(false);
    const navigate = useNavigate(); // 페이지 이동용 훅

    const findIdcheck = () => {
        if (!name || !phone) {
            // 유효성 검사: 이름이나 전화번호가 비어 있으면 경고
            alert("이름과 전화번호를 모두 입력해주세요.");
            return;
        }

        let formData = new FormData();
        formData.append("m_name", name);
        formData.append("m_phone", phone);

        instance.post('/member/findId', formData)
            .then(response => {
                console.log("아이디 찾기 응답:", response.data);
                console.log("------>", response.data.m_id);
                if (response.data.m_id !== undefined) {
                    let MemberId = response.data.m_id;
                    let memberRegDate = response.data.m_reg_date;
                    setFindId(MemberId);
                    setNotUser(false); // 유저를 찾은 경우, 상태 초기화
                    setMRegDate(memberRegDate);
                    navigate("/find_id_confirm", { state: { findId: MemberId, mRegDate: memberRegDate } });
                } else {
                    // 유저 없음 상태 업데이트
                    setFindId(null);
                    setMRegDate(null);
                    setNotUser(true);
                    alert("사용자를 찾을 수 없습니다. 다시 확인해주세요.");
                }
            })
            .catch(err => {
                console.log("아이디 찾기 에러:", err);
                setNotUser(true); // 에러가 발생해도 유저 없음 상태로 설정
                navigate("/not_user_found", { state: { message: "서버에서 오류가 발생했습니다. 다시 시도해주세요." } });
            });
    };


    const findPwcheck = () => {
        if (!id || !name || !mail) {
            alert("빈칸을 반드시 채워주세요.");
            return;
        }
        let formData = new FormData();
        formData.append("m_id", id);
        formData.append("m_name", name);
        formData.append("m_mail", mail);

        instance.post('/member/findPw', formData)
            .then(response => {
                console.log("비밀번호 찾기 응답:", response.data);
                navigate("/pw_find_confirm");

            })
            .catch(err => {
                console.log("비밀번호 찾기 에러:", err);
                setNotUser(true);
                alert("사용자를 찾을 수 없습니다. 다시 확인해주세요.");;
            });
    };

    const goToPasswordFind = () => {
        setActiveTab("findPw");
    };

    return (
        <div className="find_user">
            <div className="findId_wrap">
                <div className="id_header_wrap">
                    <h3
                        className={activeTab === "findId" ? "active" : ""}
                        onClick={() => setActiveTab("findId")}
                    >
                        아이디 찾기
                    </h3>
                    <h3
                        className={activeTab === "findPw" ? "active" : ""}
                        onClick={goToPasswordFind}
                    >
                        비밀번호 찾기
                    </h3>
                </div>
                {activeTab === "findId" && (
                    <div className="content">
                        <div className="checkName">
                            <span>이름</span>
                            <input type="text" placeholder="이름을 입력하세요" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="checkPhone">
                            <span>전화번호</span>
                            <input type="text" placeholder="전화번호를 입력하세요" onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <input type="button" value="아이디 찾기" onClick={findIdcheck} />
                        {notUser && (
                            <div className="error-message" style={{ color: 'red', marginTop: '20px', fontsize: '14px' }}>
                                사용자를 찾을 수 없습니다. 이름과 전화번호를 다시 확인해주세요.
                            </div>
                        )}
                    </div>
                )}
                {activeTab === "findPw" && (
                    <div className="content">
                        <div className="checkId">
                            <span>아이디</span>
                            <input type="text" placeholder="아이디를 입력하세요" onChange={(e) => setId(e.target.value)} />
                        </div>
                        <div className="checkName">
                            <span>이름</span>
                            <input type="text" placeholder="이름을 입력하세요" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="checkMail">
                            <span>메일</span>
                            <input type="email" placeholder="메일을 입력하세요" onChange={(e) => setMail(e.target.value)} />
                        </div>
                        <input type="button" value="비밀번호 찾기" onClick={findPwcheck} />
                        {notUser && (
                            <div className="error-message" style={{ color: 'red', marginTop: '20px', fontsize: '14px' }}>
                                사용자를 찾을 수 없습니다. 사용자 정보를 다시 확인해주세요.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindPw;
