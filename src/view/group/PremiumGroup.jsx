import React, { useEffect, useState } from "react";
import instance from '../../api/axios';

const PremiumGroup = () => {
    const [groups, setGroups] = useState("");

    useEffect(() => {
        instance.get('/group/getPremiumGroup')
        .then(response => {
            console.log("정상적으로 프리미엄 그룹을 가지고 옴.", response.data);
            let group = response.data.premiumGroup;
            setGroups(group);
        })
        .catch(err =>console.log("프리미엄 그룹 가져오기 실패!"));
    }, []);

    return(
        <>
        <h2>프리미엄 모임</h2>
        <div className="premium_list">
            <ul>
                {groups.length > 0 ? (
                    groups.map((group, index) =>(
                        <a href={`/group/${group.g_no}`}>
                            <li>
                                <img
                                    src={group.g_img_name}
                                    alt="그룹 이미지"
                                    className="my_group_image"
                                />
                                <span>{group.g_name}</span><br />
                                <span>
                                    <strong>{group.memberCount}명</strong>이 함께하고 있어요.<br />          
                                </span>
                                <span className="group_tag">#{group.g_location} #{group.g_category}</span>
                            </li> 
                        </a>
                    ))
                ) 
                : 
                (
                    <>
                    </>
                )}
            </ul> 
        </div>
        </>
    );
}

export default PremiumGroup;