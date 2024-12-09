import React, { useState, useEffect } from "react";
import '../../css/profile/credit.css';
import instance from '../../api/axios';
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk"

const Credit = ({setMemberInfo}) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [mNo, setMNo] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState('');
    const [prodName, setProdName] = useState('');
    const [amount, setAmount] = useState(7900); // 기본 결제 금액 (월 결제 금액)
    const [paymentMethod, setPaymentMethod] = useState("card"); // 결제 방법 (카드 / 계좌이체)

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const response = await instance.post('/member/getMemberInfo');
                setMemberInfo(response.data.memberDtos);
                setName(response.data.memberDtos.m_name);
                setPhone(response.data.memberDtos.m_phone);
                setMail(response.data.memberDtos.m_mail);
                setMNo(response.data.memberDtos.m_no);
            } catch (err) {
                console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
            }
        };

        fetchMemberInfo();
    }, []); // 처음 한번만 실행
    
    // 결제 옵션 선택에 따른 금액 변경
    const handleActiveClick = (index) => {
        setActiveIndex(index);
        if (index === 0) {
            setAmount(7900); // 월 결제 금액
            setProdName("월 결제");
        } else if (index === 1) {
            setAmount(80000); // 년 결제 금액
            setProdName("년 결제");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ prodName, mNo, name, phone, mail, amount, paymentMethod });
        const formData = new FormData();
        formData.append("prodName", prodName);
        formData.append("m_no", mNo);
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("mail", mail);
        formData.append("amount", amount);
        formData.append("paymentMethod", paymentMethod);
        
        instance.post('/credit/toss-pay', formData)
            .then(response => {
                window.location.href = response.data.paymentUrl;
            })
            .catch(err => {
                console.log("axios TossApi connection failed!");
            });
    }


    return (
        <>
        <div id="section5_wrap">
            <div className="period">
                <div className={`month ${activeIndex === 0 ? 'active' : ''}`} onClick={() => handleActiveClick(0)}>
                    <div className="month-header">
                        <h3>구독하고 다양한 켄텐츠를 즐겨보세요</h3>
                        <div>
                            <span>1.모임에 인원수를 30명에서 50명으로 늘일수 있어요!</span><br />
                            <span>2.귀여운 이모티콘을 사용하실 수 있어요!</span><br />
                            <span>3.핫한모임에 상단으로 올릴수 있어요!</span><br />
                        </div>
                    </div>
                    <div className="month-content">
                        월 결제금액 : 7,900원
                    </div>
                </div>
                <div className={`year ${activeIndex === 1 ? 'active' : ''}`} onClick={() => handleActiveClick(1)}>
                    <div className="year-header">
                        <h3>구독하고 다양한 켄텐츠를 즐겨보세요</h3>
                        <div>
                            <span>1.모임에 인원수를 30명에서 50명으로 늘일수 있어요!</span><br />
                            <span>2.귀여운 이모티콘을 사용하실 수 있어요!</span><br />
                            <span>3.핫한모임에 상단으로 올릴수 있어요!</span><br />
                        </div>
                    </div>
                    <div className="year-content">
                        년 결제금액 : 80,000원
                    </div>
                </div>
            </div>
            <div className="creditDataForm">
                <h2>결제하기</h2>
                <div>
                    <label htmlFor="name">이름:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력하세요"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone">전화번호:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="전화번호를 입력하세요"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="mail">이메일:</label>
                    <input
                        type="email"
                        id="mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount">결제 금액:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="결제 금액"
                        required
                        readOnly
                    />
                </div>
                <div>
                    <label htmlFor="paymentMethod">결제 방법:</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="card">카드</option>
                        <option value="bank">계좌이체</option>
                    </select>
                </div>
                <div>
                    <input type="submit" value="결제하기" onClick={handleSubmit} />
                </div>
            </div>
        </div>
        </>
    );
};

export default Credit;
