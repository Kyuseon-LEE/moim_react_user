import "../../css/customer/faq.css";
import {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {Link} from "react-router-dom";
const Faq = () => {

    const [ faqList, setFaqList ] = useState([]);
    const [ faqCategory, setFaqCategory] = useState([]);
    const [ faqSort, setFaqSort ] = useState(0);

    // 페이지네션을 위한 스테이트
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        setupData();

    }, [currentPage, faqSort]);

    const setupData = () => {
        fetchFaqList();
        fetchFaqCount();
        fetchFaqCategory();
    }

    const fetchFaqList = () => {
        axios.get(`http://localhost:5000/faq/fetchFaqList?page=${currentPage}&size=${itemsPerPage}&sort=${faqSort}`)
            .then(res => {
                setFaqList(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchFaqCount = () => {
        axios.get(`http://localhost:5000/faq/fetchFaqListCount?page=${currentPage}&size=${itemsPerPage}&sort=${faqSort}`)
            .then(res => {
                setTotalItems(res.data.data);

            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchFaqCategory = () => {
        axios.get("http://localhost:5000/faq/fetchFaqCategory")
            .then(res => {
                setFaqCategory(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // FAQ 정렬버튼 클릭 핸들
    const faqMenuBtnClickHandle = (category_no) => {
        setFaqSort(category_no);
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
                    자주 묻는 질문
                </div>
                <div className="faq-search">
                    <input type={"text"} placeholder={"검색어를 입력해주세요."} name={"faq"}/>
                </div>
            </div>

            <div className="faq-menu">
                <div className="faq-menu-item" onClick={() => faqMenuBtnClickHandle(0)}>
                    전체
                </div>
                {faqCategory && faqCategory.length > 0 ? (
                        faqCategory.map((item) => (
                            <div className="faq-menu-item" key={item.faq_category_no}
                                 onClick={() => faqMenuBtnClickHandle(item.faq_category_no)}>
                                {item.faq_category}
                            </div>
                        ))) : null
                }
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
                                <td className="faq-td">
                                    {faqCategory && faqCategory.find(category => category.faq_category_no === faq.faq_category)?.faq_category || "카테고리 없음"}
                                </td>
                                <td className="faq-td">
                                    <Link to={`/faq_detail/${faq.faq_no}`}>
                                        {faq.faq_title}
                                    </Link>
                                </td>
                                <td className="faq-td">{faq.faq_reg_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr className="faq-tr">
                            <td colSpan="4" style={{textAlign: "center"}}>
                                FAQ 목록이 존재하지 않습니다.
                            </td>
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
    )
}

export default Faq;