import {useNavigate, useParams} from "react-router-dom";
import { useEffect, useState} from "react";
import axios from "axios";
import "../../css/customer/my_inquiries.css";
const MyInquiries = () => {

    const { csi_no } = useParams();
    const [ myInquiries, setMyInquiries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyInquiries();
    }, [])

    const fetchMyInquiries = () => {
        axios.post("http://localhost:5000/faq/fetchUserInquiriesDetail", {csi_no})
            .then(res => {setMyInquiries(res.data.data)})
            .catch(err => console.log(err));
    }

    const cancelInquiries = () => {
        axios.post("http://localhost:5000/faq/cancelUserInquiries", {csi_no})
            .then(res => {
                alert('문의가 정상적으로 취소 되었습니다.');
                navigate("/contact_us");
            })
            .catch(err => {
                console.log(err);
                alert('오류로 인해 문의가 취소되지않았습니다.');
                navigate("/contact_us");
            });
    }

    const inquiriesCancelButtonClickHandle = () => {
        if (window.confirm("정말 해당 문의를 취소 하시겠습니까?")) {
            cancelInquiries();
        }
    }

    return (
        <div className="inquiry-detail">
            <div className="inquiry-detail-header">문의 상세내역</div>

            {/* 상단 정보 섹션 */}
            <div className="inquiry-summary">
                <div className="inquiry-summary-item">
                    <span className="inquiry-label">문의 번호: </span>
                    <span className="inquiry-value">{myInquiries.csi_no}</span>
                </div>
                <div className="inquiry-summary-item">
                    <span className="inquiry-label">접수일: </span>
                    <span className="inquiry-value">{myInquiries.csi_request_date}</span>
                </div>
                <div className="inquiry-summary-item">
                    <span className="inquiry-label">상태: </span>
                    <span className="inquiry-value">
        {myInquiries.csi_status === 1
            ? '접수완료'
            : myInquiries.csi_status === 2
                ? '답변완료'
                : myInquiries.csi_status === 3
                    ? '취소'
                    : '알 수 없음'}
      </span>
                </div>
            </div>

            {/* 하단 상세 내용 섹션 */}
            <div className="inquiry-content">
                <div className="inquiry-content-item">
                    <div className="inquiry-content-label">문의 내용</div>
                    <div className="inquiry-content-value">{myInquiries.csi_body}</div>
                </div>
                <div className="inquiry-content-item">
                    <div className="inquiry-content-label">문의 답변</div>
                    <div className="inquiry-content-value">
                        {myInquiries.csi_response_body
                            ? myInquiries.csi_response_body
                            : '답변 대기중인 문의입니다.'}
                    </div>
                </div>
            </div>
            <div className="inquiry-button-group">
                <button className="inquiry-cancel-button" onClick={inquiriesCancelButtonClickHandle}>
                    문의 취소
                </button>
            </div>
        </div>

    );
}

export default MyInquiries;
