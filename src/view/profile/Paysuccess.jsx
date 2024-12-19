import '../../css/profile/paysuccess.css';
import { useState, useEffect } from "react";
import instance from '../../api/axios';
import axios from 'axios';

const Paysuccess = () => {
    const [paymentData, setPaymentData] = useState(null);

    // 데이터 가져오기
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('orderId');

        axios.get(`http://3.34.115.75:5000/credit/getPaymentData?orderId=${orderId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log("response.data------>", response.data);
            setPaymentData(response.data);
        })
        .catch(err => console.log('err', err));
    }, []); // 초기 실행 시만 실행

    // 데이터 처리 및 서버 전송
    useEffect(() => {
        if (paymentData) { // paymentData가 null이 아닐 때만 실행
            let updatedPaymentData = { ...paymentData }; // 기존 데이터 복사

            if (paymentData.amount === "7900") {
                updatedPaymentData.pay_period = 30;
            } else {
                updatedPaymentData.pay_period = 365;
            }

            instance.post('/credit/insertToPayment', updatedPaymentData)
                .then(response => {
                    console.log("응답완료", response.data);
                })
                .catch(err => {
                    console.log("응답실패", err);
                });
        }
    }, [paymentData]); // paymentData가 변경될 때 실행

    return (
        <article>
            <div id="article_success_wrap">
                <h2>정상적으로 결제되었습니다.</h2>
                <div className="contents">
                    {paymentData ? (
                        <table>
                            <tr>
                                <td>상품명:</td>
                                <td>{paymentData.prodName}</td>
                            </tr>
                            <tr>
                                <td>결제금액:</td>
                                <td>{paymentData.amount}</td>
                            </tr>
                            <tr>
                                <td>고객님 명:</td>
                                <td>{paymentData.name}</td>
                            </tr>
                            <tr>
                                <td>메일</td>
                                <td>{paymentData.mail}</td>
                            </tr>
                            <tr>
                                <td>결제방법</td>
                                <td>{paymentData.paymentMethod}</td>
                            </tr>
                        </table>
                    ) : (
                        <p>결제 데이터를 불러오는 중입니다...</p>
                    )}
                    <span>다양한 혜택을 누려보세요.</span>
                    <a href="/">홈으로</a>
                </div>
            </div>
        </article>
    );
}

export default Paysuccess;
