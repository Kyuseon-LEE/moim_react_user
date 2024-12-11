import {useEffect, useState} from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../../css/announcement/announcement_list.css";
import {Link} from "react-router-dom";
const AnnouncementList = () => {

    // 페이지네션을 위한 스테이트
    const [sort, setSort] = useState("전체");
    const [totalItems, setTotalItems] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        setupData();
    }, [currentPage, totalItems, sort]);


    const setupData = () => {
        fetchAnnouncementList();
        fetchAnnouncementCount();
    }
    const fetchAnnouncementList = () => {
        axios.get(`http://localhost:5000/ac/fetchAnnouncementList?page=${currentPage}&size=${itemsPerPage}&sort=${sort}`)
            .then(res => {
                setCurrentItems(res.data.data);
            })
            .catch(err => {
                console.log('오류 발생: ', err);
                setCurrentItems(null);
            });
    }
    const fetchAnnouncementCount = () => {
        axios.get(`http://localhost:5000/ac/fetchAnnouncementCount?sort=${sort}`)
            .then(res => {
                setTotalItems(res.data.data);
            })
            .catch(err => {
                console.log('오류 발생:', err);
                setTotalItems(0);
            });
    }
    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };

    const sortMenuChangeHandle = (e) => {
        setSort(e.target.value);
    }
    return (
        <div className="announcementlist-wrapper">
            <div className="announcement-list-title">
                공지사항
            </div>

            <div className="announcement-list-box">
                <div className="announcement-sort-menu">
                    <select className="announcement-sort-menu-select" value={sort} onChange={sortMenuChangeHandle} >
                        <option value="전체">전체</option>
                        <option value="공지">공지</option>
                        <option value="이벤트">이벤트</option>
                        <option value="뉴스">뉴스</option>
                    </select>
                </div>
                <table className="announcement-list-table">
                    <thead>
                    <tr className="announcement-list-tr">
                        <th className="announcement-list-th">번호</th>
                        <th className="announcement-list-th">타입</th>
                        <th className="announcement-list-th">제목</th>
                        <th className="announcement-list-th">작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems && currentItems.length > 0 ? (
                        currentItems.map((announce) => (
                            <tr className="announcement-list-tr" key={announce.an_no}>
                                <td className="announcement-list-td">{announce.an_no}</td>
                                <td className="announcement-list-td">{announce.an_type}</td>
                                <td className="announcement-list-td">
                                    <Link to={`/announcement_detail/${announce.an_no}`}>
                                        {announce.an_title}
                                    </Link>
                                </td>
                                <td className="announcement-list-td">{announce.an_reg_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr className="announcement-list-tr">
                            <td colSpan="4">
                                공지사항이 없습니다.
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
    );
}

export default AnnouncementList;