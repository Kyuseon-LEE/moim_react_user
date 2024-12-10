import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import locations from "../../util/locations"

const MainImg = () => {
    const [showLocationMenu, setShowLocationMenu] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("지역 선택");
    const [selectedCategory, setSelectedCategory] = useState("카테고리 선택");
    const [selectedSubLocation, setSelectedSubLocation] = useState("");
    const [subLocations, setSubLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가

    const navigate = useNavigate();  

  const toggleLocationMenu = () => {
    setShowLocationMenu(!showLocationMenu);
    setShowCategoryMenu(false);
  };

  const toggleCategoryMenu = () => {
    setShowCategoryMenu(!showCategoryMenu);
    setShowLocationMenu(false);
  };

  const closeMenus = () => {
    setShowLocationMenu(false);
    setShowCategoryMenu(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSubLocations(locations[location] || []);
    setSelectedSubLocation(""); 
  };

  const handleSubLocationSelect = (subLocation) => {
    if (subLocation === "전체") {
      setSelectedSubLocation("");
    } else {
      setSelectedSubLocation(subLocation);
    }
    setShowLocationMenu(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryMenu(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
  
    // 검색어, 지역, 카테고리 중 하나라도 입력되었는지 확인
    const isAnyFieldFilled =
      searchQuery.trim().length > 0 ||
      (selectedLocation !== "지역 선택" && selectedLocation) ||
      (selectedCategory !== "카테고리 선택" && selectedCategory);
  
    if (!isAnyFieldFilled) {
      alert("검색어, 지역, 카테고리 중 하나를 입력하거나 선택해주세요.");
      return;
    }
  
    // 검색어 추가 (입력된 경우에만)
    if (searchQuery.trim()) {
      params.append("query", searchQuery.trim());
    }
  
    // 지역 조건 추가 (선택된 경우에만)
    if (selectedSubLocation === "전체" || selectedSubLocation === "") {
      if (selectedLocation !== "지역 선택") {
        params.append("location", selectedLocation); // 메인 지역만 전달
      }
    } else if (selectedSubLocation) {
      params.append("location", selectedSubLocation); // 서브 지역 전달
    }
  
    // 카테고리 조건 추가 (선택된 경우에만)
    if (selectedCategory !== "카테고리 선택") {
      params.append("category", selectedCategory);
    }
  
    navigate(`/search?${params.toString()}`); // 검색 결과 페이지로 이동
  };
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".location") &&
        !event.target.closest(".category")
      ) {
        closeMenus();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section onClick={closeMenus}>
      <div className="section_wrap" onClick={(e) => e.stopPropagation()}>
        <p>
          모임을 위한 공간,
          <br />
          MOIM?
        </p>
        <div className="search_form">
          <p>모임 검색</p>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div
            className="location"
            onClick={(e) => {
              e.stopPropagation();
              toggleLocationMenu();
            }}
          >
            {selectedSubLocation || selectedLocation}
            {showLocationMenu && (
              <div className="dropdown_menu1">
                <ul className="main_location">
                  {Object.keys(locations)
                    .slice(0, 9)
                    .map((location) => (
                      <li
                        key={location}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocationSelect(location);
                        }}
                      >
                        {location}
                      </li>
                    ))}
                </ul>
                <ul className="main_location">
                  {Object.keys(locations)
                    .slice(10, 17)
                    .map((location) => (
                      <li
                        key={location}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocationSelect(location);
                        }}
                      >
                        {location}
                      </li>
                    ))}
                </ul>

                {subLocations.length > 0 && (
                  <ul className="sub_locations">
                    {subLocations.map((subLocation) => (
                      <li
                        key={subLocation}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubLocationSelect(subLocation);
                        }}
                      >
                        {subLocation}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div
            className="category"
            onClick={(e) => {
              e.stopPropagation();
              toggleCategoryMenu();
            }}
          >
            {selectedCategory}
            {showCategoryMenu && (
              <div className="dropdown_menu2">
                <ul>
                  {["여행", "운동", "문화/공연", "음악", "게임", "사진", "요리"].map(
                    (category) => (
                      <li
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
          <button className="searching" onClick={handleSearch}>
            검색
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainImg;