import "../../css/customer/faq.css";
import {useEffect, useState} from "react";
const Faq = () => {

    const [ faqList, setFaqList ] = useState(null);

    useEffect(() => {

    }, [])
    return (
        <div className="faq-wrapper">
            <div className="faq-header">
                <div className="faq-title">
                    자주 묻는 질문
                </div>
                <div className="faq-search">
                   <input type={"text"} placeholder={"검색어를 입력해주세요."} name={"faq"}/>
                </div>
            </div>

            <div className="faq-menu">
                <div className="faq-menu-item">
                    회원
                </div>
                <div className="faq-menu-item">
                    결제
                </div>
                <div className="faq-menu-item">
                    채팅
                </div>
            </div>

            <div className="faq-content">
                <table className="faq-table">
                    <thead className="faq-table-header">
                        <tr className="faq-tr">
                            <th className="faq-th">No</th>
                            <th className="faq-th">카테고리</th>
                            <th className="faq-th">제목</th>
                            <th className="faq-th">작성시간</th>
                        </tr>
                    </thead>
                    <tbody>
                    {faqList && faqList.length > 0 ? (
                        faqList.map((faq) => (
                            <tr className="faq-tr" key={faq.faq_no}>
                                <td className="faq-td">{faq.faq_no}</td>
                                <td className="faq-td">{faq.faq_category}</td>
                                <td className="faq-td">{faq.faq_title}</td>
                                <td className="faq-td">{faq.faq_reg_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr className="faq-tr">
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                FAQ 목록이 존재하지 않습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Faq;