import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Button = styled.button`
  width: 300px;
  height: 60px;
  background-color: #dda0dd;
  font-weight: 550;
  font-size: 21px;
  color: #fff;
  border: 1px solid #dda0dd;
  border-radius: 7px;
  margin-buttom: 100px;
`;

const MobileWrap = styled.div`
  display: flex;
  justify-content:center;
  align-items: center;
  height: 80vh;
  background-color: #ddd;
`;

const MobileLoginConfirm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get("accessToken");
  const navigate = useNavigate();

  const loginMobile = () => {
    localStorage.setItem("accessToken", accessToken);
    navigate("/");
  };

  return (
    <MobileWrap>
      <Button onClick={loginMobile}>로그인 하기</Button>
    </MobileWrap>
  );
};

export default MobileLoginConfirm;
