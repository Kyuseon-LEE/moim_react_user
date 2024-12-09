import React from "react";
import '../../css/include.css';

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer_wrap">
          <div className="inner_t">
            <div className="info_left">
              <div className="bt_info">
              <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
                <div className="bt_title">사이트 기본정보</div>
                <div className="bt_info_list" data-ez-role="list">
                  <div>
                    <strong>상호명</strong> <span>모임?&nbsp;&nbsp;</span>
                    <strong>대표자명</strong> <span>OOO</span>
                  </div>
                  <div>
                    <strong>사업장 주소</strong>{" "}
                    <span>
                      경기 의정부시 시민로 80 센트럴타워 6층, 7층 그린컴퓨터아카데미&nbsp;&nbsp;
                    </span>
                    <strong>대표 전화</strong> <span>010-0000-0000</span>
                  </div>
                  <div>
                    <strong>사업자 등록번호</strong> <span>000-00-00000</span>
                  </div>
                  <div>
                    <strong>통신판매업 신고번호</strong> <span></span>
                  </div>
                  <div>
                    <strong>개인정보보호책임자</strong> <span>OOO</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="info_right">
              <div className="bt_info2">
                <div className="bt_title">고객센터 정보</div>
                <div className="bt_info_list" data-ez-role="list">
                  <div>
                    <strong>상담전화</strong> <span>000-000-0000&nbsp;&nbsp;</span>
                    <strong>대표자명</strong> <span>OOO</span>
                  </div>
                  <div>
                    <strong>상담/주문 이메일</strong>
                    <br />
                    <span>OOO@naver.com</span>
                  </div>
                  <div>
                    <strong>CS 운영 시간</strong>
                    <br />
                    <span>Open. AM 09:00 - PM 18:00</span>
                    <br />
                    <span>Lunch. PM 12:30 - PM 13:30</span>
                    <br />
                    <span>Sat, Sun, Holiday Off</span>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
