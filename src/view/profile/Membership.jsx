import React, { useState, useEffect } from "react";
import '../../css/profile/credit.css';
import instance from '../../api/axios';
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk"
import Paysuccess from './Paysuccess'; 
import { format } from 'date-fns';
import '../../css/profile/membership.css';
import Nav from './Nav';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Membership = () => {
    const [creditInfo, setCreditInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [memberInfo, setMemberInfo] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                const response = await instance.post('/credit/getpayment');
                setMemberInfo(response.data.creditDtos.memberDto);
                setCreditInfo(response.data.creditDtos);

            } catch (err) {
                console.error("모든정보를 가져오는데 실패했습니다.", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentInfo();
    }, []); 


    const cancelMembership = () => {
        const isConfirm = window.confirm("정말로 멤버쉽을 해지하시겠습니까?");
        if(isConfirm) {
            instance.post('/credit/cancelMembership')
            .then(response => {
                console.log("해지성공", response.data);
                alert("멤버쉽이 정상적으로 해지되었습니다.감사합니다.");
                navigate("/")
                
            })
            .catch(err => console.log('멤버쉽 해지 실패', err));   
        } else {
            console.log("해지취소");
        }

    }

    if (isLoading) {
        return <div>로딩 중...</div>;
      }

    return(
    <div className="article4">
        <div className="profile_article_wrap">
            <Nav />
            <div className="creditDataForm1">
                <h2>멤버쉽</h2>
                <div className="name">
                    <label>이름:</label>
                    <span>{memberInfo.m_name}</span>
                </div>
                <div className="mail">
                    <label>메일:</label>
                    <span>{memberInfo.m_mail}</span>
                </div>
                <div className="pay_method">
                    <label>결제수단:</label>
                    <span>{creditInfo.pay_method}</span>
                </div>
                <div className="pay_reg_date">
                    <label>결제등록일:</label>
                    <span>{format(new Date(creditInfo.pay_reg_date), 'yyyy-MM-dd')}</span>
                </div>
                <div className="pay_expired_date">
                    <label>결제만료일:</label>
                    <span>{format(new Date(creditInfo.pay_expired_date), 'yyyy-MM-dd')}일</span>
                </div>
                <div className="pay_period">
                    <label>결제기간:</label>
                    <span>{creditInfo.pay_period}일</span>
                </div>
                <div className="cancle_membership">
                    <input type="button" value="해지하기" onClick={cancelMembership}/>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Membership;