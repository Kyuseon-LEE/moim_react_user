import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import "../../css/announcement/announcement_detail.css"
const AnnouncementDetail = () => {
    const { an_no } = useParams();
    const [ announcementDetail, setAnnouncementDetail ] = useState(null);

    useEffect(() => {
        fetchAnnouncementDetail();
    }, []);

    const fetchAnnouncementDetail = () => {
        axios.post("http://3.34.115.75:5000/ac/fetchAnnouncementDetail", {an_no: an_no}   )
            .then(res => {
                setAnnouncementDetail(res.data.data)
            })
            .catch(err => {
                console.log(err);
                setAnnouncementDetail(null);
            });
    }
    if (!announcementDetail) {
        return <div className="loading">Loading...</div>;
    }

    return (
            <div className="announcement-wrapper">
                <div className="announcement-header">
                    <div>
                        <h2 className="announcement-h2">공지사항</h2>
                    </div>
                </div>
                <div className="announcement-content">
                    <div className="announcement_detail">
                        <div className="title_section">
                            <div className="title">
                                <span className="prefix">[{announcementDetail.an_type}]</span>{announcementDetail.an_title}
                            </div>
                            <div className="reg_date">
                                {announcementDetail.an_reg_date}
                            </div>
                        </div>
                        <div className="announcement-body" dangerouslySetInnerHTML={{ __html: announcementDetail.an_body }}>
                        </div>
                        <div className="announcement-button-group">
                            <button className="announcement-list-btn"><Link to="/announcement_list">목록</Link></button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AnnouncementDetail;