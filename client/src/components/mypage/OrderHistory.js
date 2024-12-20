import React, { useEffect, useState, useCallback } from "react";
import MyPageBox from "./MyPageBox";
import axios from "axios";
import { useSelector } from "react-redux";
import OrderHistoryList from "../layout/OrderHistoryList";
import Pagination from "../layout/Pagination";

function OrderHistory() {
    const userInfo = useSelector((state) => state.user);
    const [orderObj, setOrderObj] = useState();
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
        <>
            <MyPageBox title="주문조회">
                <OrderHistoryList orderObj={orderObj} />
            </MyPageBox>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagingButtons={pagingButtons}
            />
        </>
    );
}

export default OrderHistory;
