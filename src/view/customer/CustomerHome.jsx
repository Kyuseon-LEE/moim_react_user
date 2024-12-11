import "../../css/customer/customer_home.css";
import {Link} from "react-router-dom";
const CustomerHome = () => {
    return (
        <div className="customer-home-wrapper">
            <div className="customer-home-header">
                <h2>고객센터</h2>
            </div>

            <div className="customer-content">
                <ul className="customer-ul">
                    <Link to="/announcement_list">
                    <li className="customer-li">

                        <div className="customer-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24">
                                <path fill="#000"
                                      d="M18 11v2h4v-2zm-2 6.61c.96.71 2.21 1.65 3.2 2.39c.4-.53.8-1.07 1.2-1.6c-.99-.74-2.24-1.68-3.2-2.4c-.4.54-.8 1.08-1.2 1.61M20.4 5.6c-.4-.53-.8-1.07-1.2-1.6c-.99.74-2.24 1.68-3.2 2.4c.4.53.8 1.07 1.2 1.6c.96-.72 2.21-1.65 3.2-2.4M4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34"/>
                            </svg>
                        </div>
                        <h3 className="customer-h3">공지사항</h3>
                    </li>
                    </Link>
                    <Link to="/faq">
                    <li className="customer-li">
                        <div className="customer-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24">
                                <path fill="#000"
                                      d="M19 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4l3 3l3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-6 16h-2v-2h2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41c0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25"/>
                            </svg>
                        </div>
                        <h3 className="customer-h3">자주 묻는 질문</h3>

                    </li>
                    </Link>
                    <Link to="/contact_us">
                    <li className="customer-li">
                        <div className="customer-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24">
                                <path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="1.5"
                                      d="M22 7.283c0 2.642-2.239 4.784-5 4.784q-.488 0-.967-.09c-.23-.043-.345-.064-.425-.052s-.194.072-.42.193a3.25 3.25 0 0 1-2.113.329a2.65 2.65 0 0 0 .544-1.175c.05-.265-.074-.522-.26-.71A4.66 4.66 0 0 1 12 7.283C12 4.642 14.239 2.5 17 2.5s5 2.142 5 4.783m-6.508.217h.008m2.992 0h.008m-10.998 14H4.718c-.323 0-.648-.046-.945-.173c-.966-.415-1.457-.964-1.685-1.307a.54.54 0 0 1 .03-.631c1.12-1.488 3.72-2.386 5.389-2.386c1.668 0 4.264.898 5.384 2.386c.141.187.16.436.03.631c-.229.343-.72.892-1.686 1.307a2.4 2.4 0 0 1-.945.173zm2.784-9.711a2.776 2.776 0 0 1-2.78 2.772a2.776 2.776 0 0 1-2.778-2.772a2.776 2.776 0 0 1 2.779-2.773a2.776 2.776 0 0 1 2.779 2.773"
                                      color="#000"/>
                            </svg>
                            <h3 className="customer-h3">문의하기</h3>
                        </div>
                    </li>
                    </Link>
                </ul>
            </div>
        </div>
    )
}

export default CustomerHome;