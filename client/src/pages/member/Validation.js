import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SubContentsXsmall from "../../components/layout/SubContentsXsmall";
import BreadCrumb from "../../components/layout/BreadCrumb";
import SubTitle from "../../components/layout/SubTitle";
import axios from "axios";

function Validation() {
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);
  const params = useParams();

  const validateUser = useCallback(async () => {
    const response = await axios.post(
      "http://localhost:4000/api/validateUser",
      {
        userId: userInfo.userId,
        password,
      },
    );

    if (userInfo.token && response.data.success) {
      navigate("/member/modify", {
        state: { title: ["회원 정보 수정"] },
      });
    } else {
      setPassword("");
      alert("비밀번호가 일치하지 않습니다. 다시 입력해 주세요.");
    }
  }, [password, userInfo.userId, userInfo.token, navigate]);

  const handleInput = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  return (
    <SubContentsXsmall>
      <BreadCrumb title={location.state.title} path={params} />
      <SubTitle title={location.state.title} />
      <div className="input-form">
        <ul>
          <li>
            <input
              type="password"
              value={password}
              placeholder="비밀번호 입력"
              onChange={handleInput}
            />
          </li>
        </ul>
        <div className="input-form__button">
          <button
            type="button"
            className="btn btn-square btn-square--black"
            onClick={validateUser}
          >
            <span className="btn btn-square__text">확인</span>
          </button>
        </div>
      </div>
    </SubContentsXsmall>
  );
}

export default Validation;
