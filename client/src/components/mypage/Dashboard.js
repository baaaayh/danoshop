import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import OrderHistoryList from "../layout/OrderHistoryList";
import Pagination from "../layout/Pagination";
import axios from "axios";

function Dashboard() {
    const location = useLocation();
    const userInfo = useSelector((state) => state.user);
    const [orderObj, setOrderObj] = useState();
    const title = location.state.title;
    const [pagingButtons, setPagingButtons] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const getOrderHistory = useCallback(async () => {
        const response = await axios.post(
            "http://baaaayh.sytes.net/api/getOrderHistory",
            {
                userId: userInfo.userId,
                page: currentPage,
                itemsPerPage,
            }
        );
        setOrderObj(response.data.orderObj);
        setPagingButtons(response.data.pagingButtons);
    }, [userInfo.userId, currentPage, itemsPerPage]);

    useEffect(() => {
        getOrderHistory();
    }, [getOrderHistory]);

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
                                <b>{orderObj && orderObj.length}</b>
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
            <div className="mypage-box pcv">
                <div className="mypage-box__head">
                    <h3>주문내역 조회</h3>
                </div>
                <div className="mypage-box__contents">
                    {orderObj && <OrderHistoryList orderObj={orderObj} />}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagingButtons={pagingButtons}
            />
        </div>
    );
}

export default Dashboard;
