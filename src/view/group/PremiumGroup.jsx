import React, { useEffect, useState } from "react";
import instance from '../../api/axios';
import { useNavigate } from "react-router-dom";

const PremiumGroup = () => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        instance.get('/group/getPremiumGroup')
        .then(response => {
            console.log("정상적으로 프리미엄 그룹을 가지고 옴.", response.data);
            let group = response.data.premiumGroup;

            // 그룹 데이터를 랜덤으로 섞고 최대 5개만 선택
            const shuffledGroups = group.sort(() => 0.5 - Math.random()).slice(0, 5);
            setGroups(shuffledGroups);
        })
        .catch(err => console.log("프리미엄 그룹 가져오기 실패!"));
    }, []);    

    return(
        <>
        <div className="header_container">
            <h2 className="premium_moim"><img src="/img/leader.png" alt="all" />프리미엄 모임</h2>
            <a href="/group/premium"><p className="view_all">전체보기 &gt;</p></a>
        </div>
        <div className="premium_list">
            <ul>
                {groups.length > 0 ? (
                    groups.map((group, index) => (
                        <li key={index} onClick={() => navigate(`/group/${group.g_no}`)}>
                            <img
                                src={group.g_img_name}
                                alt="그룹 이미지"
                                className="my_group_image"
                            />
                            <span>{group.g_name}</span><br />
                            <span>
                                <strong>{group.memberCount}명</strong>이 함께하고 있어요.<br />          
                            </span>
                            <span className="group_tag">#{group.g_location} #{group.g_category} 
                                {group.g_status === 1 ? (
                                    <>
                                        &nbsp;#프리미엄 
                                    </>
                                ) : null}
                            </span>
                        </li> 
                    ))
                ) : (
                    <p>프리미엄 그룹이 없습니다.</p>
                )}
            </ul> 
        </div>
        </>
    );
}

export default PremiumGroup;
