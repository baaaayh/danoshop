import React, { useEffect, useState } from "react";
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

    const getOrderHistory = async () => {
        const response = await axios.post(
            "http://localhost:4000/api/getOrderHistory",
            {
                userId: userInfo.userId,
                page: currentPage,
                itemsPerPage,
            }
        );
        setOrderObj(response.data.orderObj);
        setPagingButtons(response.data.pagingButtons);
    };

    useEffect(() => {
        getOrderHistory();
    }, [currentPage]);

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
