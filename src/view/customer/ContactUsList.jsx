import ReactPaginate from "react-paginate";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import "../../css/customer/contact_us_list.css";
const ContactUsList = () => {

    const [ inquiries, setInquiries ] = useState([]);
    const [ faqCategory, setFaqCategory] = useState([]);
    const navigate = useNavigate();

    // 페이지네션을 위한 스테이트
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        fetchUserInquiries();
        fetchFaqCategory();
    }, []);

    const fetchUserInquiries = () => {
        const accessToken = localStorage.getItem("accessToken");

        axios.post(`http://3.34.115.75:5000/faq/fetchUserInquiriesList`, {
            accessToken: accessToken,
            page: currentPage,
            size: itemsPerPage,
        })
            .then(res => {
                setInquiries(res.data.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const fetchFaqCategory = () => {
        axios.get("http://3.34.115.75:5000/faq/fetchFaqCategory")
            .then(res => {
                setFaqCategory(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }


    // 페이지 버튼 클릭 핸들
    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };


    return (
        <div className="contact-us-list-wrapper">
            <div className="contact-us-list-header">
                <div className="contact-us-list-title">
                    내 문의 내역
                </div>
            </div>

            <div className="contact-us-list-content">
                <table className="contact-us-list-table">
                    <thead className="contact-us-list-table-header">
                    <tr className="contact-us-list-tr">
                        <th className="contact-us-list-th">문의 번호</th>
                        <th className="contact-us-list-th">카테고리</th>
                        <th className="contact-us-list-th">제목</th>
                        <th className="contact-us-list-th">상태</th>
                        <th className="contact-us-list-th">문의일</th>

                    </tr>
                    </thead>
                    <tbody>
                    {inquiries && inquiries.length > 0 ? (
                        inquiries.map((item) => (
                            <tr className="contact-us-list-tr" key={item.csi_no}>
                                <td className="contact-us-list-td">{item.csi_no}</td>
                                <td className="contact-us-list-td">
                                    {faqCategory && faqCategory.find(category => category.faq_category_no === item.csi_category)?.faq_category || "카테고리 없음"}
                                </td>
                                <td className="contact-us-list-td">
                                    <Link to={`/myInquiries/${item.csi_no}`}>
                                        {item.csi_title}
                                    </Link>
                                </td>
                                <td className="contact-us-list-td">
                                    {item.csi_status === 1
                                        ? '접수완료'
                                        : item.csi_status === 2
                                            ? '답변완료'
                                            : item.csi_status === 3
                                                ? '취소'
                                                : '알 수 없음'}
                                </td>
                                <td className="contact-us-list-td">{item.csi_request_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr className="contact-us-list-tr">
                            <td colSpan="5" className="contact-us-list-td">문의 내역이 존재하지 않습니다.</td>
                        </tr>
                    )}
                    <tr className="contact-us-list-tr">
                        <td className="contact-us-list-td last-td" colSpan="5">
                            <button className="inquiry-button" onClick={() => navigate("/inquiries")}>문의하기</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <ReactPaginate
                previousLabel={"이전"}
                nextLabel={"다음"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                previousClassName={"page-item"}
                nextClassName={"page-item"}
                breakClassName={"page-item"}
                pageClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                pageLinkClassName={"page-link"}
            />
        </div>
    );
}

export default ContactUsList;