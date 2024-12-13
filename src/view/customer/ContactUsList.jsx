import ReactPaginate from "react-paginate";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

const ContactUsList = () => {

    const [ inquiries, setInquiries ] = useState([]);
    const navigate = useNavigate();

    // 페이지네션을 위한 스테이트
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        fetchUserInquiries();
    }, []);
    const fetchUserInquiries = () => {
        const accessToken = localStorage.getItem("accessToken");

        axios.post(`http://localhost:5000/faq/fetchUserInquiriesList`, {
            accessToken: accessToken,
            page: currentPage,
            size: itemsPerPage,
        })
            .then(res => {
                setInquiries(res.data.data);
            })
            .catch(err => {
                alert('오류가 발생했습니다.');
                navigate('/');
            });
    }


    // 페이지 버튼 클릭 핸들
    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };


    return (
        <div className="faq-wrapper">
            <div className="faq-header">
                <div className="faq-title">
                    내 문의 내역
                </div>
            </div>

            <div className="faq-content">
                <table className="faq-table">
                    <thead className="faq-table-header">
                    <tr className="faq-tr">
                        <th className="faq-th">문의 번호</th>
                        <th className="faq-th">카테고리</th>
                        <th className="faq-th">제목</th>
                        <th className="faq-th">상태</th>
                        <th className="faq-th">문의일</th>

                    </tr>
                    </thead>
                    <tbody>
                    {inquiries && inquiries.length > 0 ? (
                        inquiries.map((item) => (
                            <tr className="faq-tr" key={item.csi_no}>
                                <td className="faq-td">{item.csi_no}</td>
                                <td className="faq-td">{item.csi_category}</td>
                                <td className="faq-td">
                                <Link to="#none">
                                    {item.csi_title}
                                </Link>
                                </td>
                                <td className="faq-td">{item.csi_status}</td>
                                <td className="faq-td">{item.csi_request_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">문의 내역이 존재하지 않습니다.</td>
                        </tr>
                    )}
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