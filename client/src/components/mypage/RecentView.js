import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import MyPageBox from "./MyPageBox";
import styles from "./RecentView.module.scss";
import ItemDetail from "../layout/ItemDetail";
import axios from "axios";
import Pagination from "../layout/Pagination";
import { sideOrderInfo } from "../../modules/sideOrder";

function RecentView({ setSideOrderItem }) {
    const [pagingButtons, setPagingButtons] = useState(0);
    const [recentView, setRecentView] = useState([]);
    const [checkedOptions, setCheckedOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const userInfo = useSelector((state) => state.user);

    const fetchRecentView = async () => {
        try {
            if (userInfo.token) {
                const response = await axios.post(
                    "http://localhost:4000/api/getRecentView",
                    {
                        userId: userInfo.userId,
                        page: currentPage,
                        itemsPerPage: itemsPerPage,
                    }
                );
                setPagingButtons(response.data.pagingButtons);
                setRecentView(response.data.recentView);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRecentView(currentPage);
    }, [currentPage]);

    const handleCheckbox = useCallback((optionId, uniqueId) => {
        setCheckedOptions((prev) => ({
            ...prev,
            [uniqueId]: !prev[uniqueId],
        }));
    }, []);

    const removeItem = async (uniqueId) => {
        try {
            if (window.confirm("해당 상품을 삭제하시겠습니까?")) {
                if (userInfo.token) {
                    const response = await axios.post(
                        "http://localhost:4000/api/removeRecentViewItem",
                        {
                            userId: userInfo.userId,
                            itemUniqueId: uniqueId,
                            page: currentPage,
                            itemsPerPage: itemsPerPage,
                        }
                    );
                    setPagingButtons(response.data.pagingButtons);
                    setRecentView(response.data.recentView);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <MyPageBox title="최근 본 상품">
                <div className="recent-view">
                    {recentView.length > 0 ? (
                        <ul>
                            {recentView &&
                                recentView.map((recentViewItem, index) => (
                                    <ItemDetail
                                        itemValue={recentViewItem}
                                        key={`${recentViewItem.id}-${index}`}
                                        handleCheckbox={handleCheckbox}
                                        setCheckedOptions={setCheckedOptions}
                                        checkedOptions={checkedOptions}
                                        removeItem={removeItem}
                                    />
                                ))}
                        </ul>
                    ) : (
                        <div className={"no-item"}>
                            <p>
                                <img
                                    src="../images/icons/icon_no_item.svg"
                                    alt=""
                                />
                                관심상품 내역이 없습니다.
                            </p>
                        </div>
                    )}
                </div>
            </MyPageBox>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagingButtons={pagingButtons}
            />
        </>
    );
}

export default RecentView;
