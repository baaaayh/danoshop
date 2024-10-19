import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

function Dashboard() {
    const location = useLocation();
    const params = useParams();

    const title = location.state.title;

    return (
        <div>
            <h2>{title[0]}</h2>
            <div className="mypage-box">
                <div className="mypage-box__head">
                    <h3>
                        나의 주문처리 현황<span>(최근 3개월 기준)</span>
                    </h3>
                </div>
                <div className="mypage-box__contents">
                    <div className="order-box order-box--state">
                        <ul>
                            <li>
                                <b>0</b>
                                <span>입금전</span>
                            </li>
                            <li>
                                <b>0</b>
                                <span>배송준비중</span>
                            </li>
                            <li>
                                <b>0</b>
                                <span>배송중</span>
                            </li>
                            <li>
                                <b>0</b>
                                <span>배송완료</span>
                            </li>
                        </ul>
                    </div>
                    <div className="order-box order-box--cs">
                        <ul>
                            <li>
                                <span>취소 : </span>
                                <b>0</b>
                            </li>
                            <li>
                                <span>교환 : </span>
                                <b>0</b>
                            </li>
                            <li>
                                <span>반품 : </span>
                                <b>0</b>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mypage-box">
                <div className="mypage-box__head">
                    <h3>주문내역 조회</h3>
                </div>
                <div className="mypage-box__contents">
                    <p className="mypage-box__noitem">
                        <img src="../images/icons/icon_no_item.svg" alt="" />
                        주문 내역이 없습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
