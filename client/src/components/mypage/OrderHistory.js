import React, { useEffect, useState } from "react";
import MyPageBox from "./MyPageBox";
import axios from "axios";
import { useSelector } from "react-redux";

function OrderHistory() {
    const userInfo = useSelector((state) => state.user);

    useEffect(() => {
        if (userInfo.token) {
            const response = axios.post(
                "http://localhost:4000/api/getOrderHistory",
                {
                    userId: userInfo.userId,
                }
            );
        }
    }, []);

    return (
        <MyPageBox title="주문조회">
            <div className="order-history">order-history</div>
        </MyPageBox>
    );
}

export default OrderHistory;
