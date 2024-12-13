import axios from "axios";
import {useEffect, useState} from "react";
import "../../css/customer/contact_us.css";
import {useNavigate} from "react-router-dom";
const ContactUs = () => {

    useEffect(() => {
        fetchFaqCategory();
    }, []);

    const [ faqCategory, setFaqCategory] = useState([]);
    const [ inquiries, setInquiries] = useState({
        csi_title: "",
        csi_category: "",
        csi_body: "",
    });
    const [files, setFiles] = useState({
        csi_attach_file1: null,
        csi_attach_file2: null,
        csi_attach_file3: null,
        csi_attach_file4: null,
    });
    const navigate = useNavigate();

    const fetchFaqCategory = () => {
        axios.get("http://localhost:5000/faq/fetchFaqCategory")
            .then(res => {
                setFaqCategory(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const contactUsFormChangeHandle = (e) => {
        const { name , value } = e.target;

        setInquiries(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const fileChangeHandle = (e) => {
        const { name, files: uploadedFiles } = e.target;
        setFiles(prev => ({
            ...prev,
            [name]: uploadedFiles[0],
        }));
    };

    const inquiriesSubmitHandle = () => {
        if (inquiries.csi_title === '') {
            alert('문의 제목을 입력해주세요.');


        } else if (inquiries.csi_category === '') {
            alert('문의 카테고리를 선택해주세요.');

        } else if (inquiries.csi_body === '') {
            alert('문의 내용을 입력해주세요.');

        } else {
            sendInquiries();
        }
    }

    const sendInquiries = () => {
        const formData = new FormData();

        formData.append("csi_title", inquiries.csi_title);
        formData.append("csi_category", inquiries.csi_category);
        formData.append("csi_body", inquiries.csi_body)
        if (localStorage.getItem("accessToken")) formData.append("accessToken", localStorage.getItem("accessToken"));
        if (files.csi_attach_file1) formData.append("csi_attach_file1", files.csi_attach_file1);
        if (files.csi_attach_file2) formData.append("csi_attach_file2", files.csi_attach_file2);
        if (files.csi_attach_file3) formData.append("csi_attach_file3", files.csi_attach_file3);
        if (files.csi_attach_file4) formData.append("csi_attach_file4", files.csi_attach_file4);

        axios.post("http://localhost:5000/faq/createInquiries", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(res =>{
                alert('문의 접수가 완료되었습니다.');

            })
            .catch(err => {
                alert('문의 접수중 오류가 발생했습니다.')
            
            });

    }


    return (
        <div className="contact-us-wrapper">
            <div className="contact-us-header">
                <div className="contact-us-title">
                    문의하기
                </div>
            </div>

            <div className="contact-us-content">
                <table className="contact-us-table">
                    <tbody>
                    <tr>
                        <td>
                            문의 제목
                        </td>
                        <td>
                            <input type="text"
                                   placeholder="문의 제목을 입력해주세요."
                                   name="csi_title"
                                   onChange={contactUsFormChangeHandle}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            문의 카테고리
                        </td>
                        <td>
                        <select name="csi_category" onChange={contactUsFormChangeHandle}>
                                <option value="">
                                    카테고리 선택
                                </option>
                                {faqCategory.map((item) => (
                                    <option key={item.faq_category_no} value={item.faq_category_no}>
                                        {item.faq_category}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            문의 내용
                        </td>
                        <td>
                            <textarea name="csi_body" placeholder="문의 내용을 입력해주세요."  onChange={contactUsFormChangeHandle}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            첨부파일
                        </td>
                        <td>
                            <input type="file" name="csi_attach_file1" onChange={fileChangeHandle} />
                            <input type="file" name="csi_attach_file2" onChange={fileChangeHandle} />
                            <input type="file" name="csi_attach_file3" onChange={fileChangeHandle} />
                            <input type="file" name="csi_attach_file4" onChange={fileChangeHandle} />
                        </td>
                    </tr>
                    <tr>
                        <td className="button-group" colSpan="2">
                            <button className="csi-submit-button" onClick={inquiriesSubmitHandle}>문의하기</button>
                            <button className="csi-reset-button" type="reset">초기화</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ContactUs;