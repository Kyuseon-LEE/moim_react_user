import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "../../css/customer/faq_detail.css";
import axios from "axios";

const FaqDetail = () => {

    const { faq_no } = useParams();
    const navigate = useNavigate();

    const [ faqDetail, setFaqDetail ] = useState({});
    const [ faqCategory, setFaqCategory] = useState([]);

    useEffect(() => {
        fetchFaqDetail();
        fetchFaqCategory();
    }, []);

    const fetchFaqDetail = () => {
        axios.post("http://3.34.115.75:5000/faq/fetchFaqDetail", {faq_no: faq_no})
            .then(res => setFaqDetail(res.data.data))
            .catch(err => console.log(err));
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

    return (
        <div className="faq-detail-wrapper">
            <div className="faq-title">
                [{faqCategory && faqCategory.find(category => category.faq_category_no === faqDetail.faq_category)?.faq_category || "카테고리 없음"}]
                {faqDetail.faq_title}
            </div>
            <div className="faq-date">
                등록일: {faqDetail.faq_reg_date}<br />
            </div>
            <div className="faq-body" dangerouslySetInnerHTML={{ __html: faqDetail.faq_body}} />

            <button className="faq-move-button" onClick={() => navigate('/faq')}>리스트로 이동</button>
        </div>
    );
}

export default FaqDetail;