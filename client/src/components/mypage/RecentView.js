import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import MyPageBox from "./MyPageBox";
import styles from "./RecentView.module.scss";
import ItemDetail from "../layout/ItemDetail";
import axios from "axios";

function RecentView() {
    const [recentView, setRecentView] = useState([]);
    const [checkedOptions, setCheckedOptions] = useState({});

    const userInfo = useSelector((state) => state.user);

    const fetchWishList = async () => {
        try {
            if (userInfo.token) {
                const response = await axios.post(
                    "http://localhost:4000/api/getRecentView",
                    {
                        userId: userInfo.userId,
                    }
                );
                setRecentView(response.data.recentView);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchWishList();
    }, []);

    const handleCheckbox = useCallback((optionId, optionKey) => {
        setCheckedOptions((prev) => ({
            ...prev,
            [optionKey]: !prev[optionKey], // 상태 반전
        }));
    }, []);

    const removeItem = async (optionKey) => {
        try {
            if (window.confirm("해당 상품을 삭제하시겠습니까?")) {
                if (userInfo.token) {
                    const response = await axios.post(
                        "http://localhost:4000/api/removeRecentViewItem",
                        {
                            userId: userInfo.userId,
                            optionId: optionKey,
                        }
                    );
                    setRecentView(response.data.wishList);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MyPageBox title="최근 본 상품">
            <div className="recent-view">
                <ul>
                    {recentView
                        .slice()
                        .reverse()
                        .map((recentViewItem, index) => {
                            return (
                                <ItemDetail
                                    itemValue={recentViewItem}
                                    key={`${recentViewItem.id}-${index}`}
                                    handleCheckbox={handleCheckbox}
                                    setCheckedOptions={setCheckedOptions}
                                    checkedOptions={checkedOptions}
                                    removeItem={removeItem}
                                />
                            );
                        })}
                </ul>
            </div>
        </MyPageBox>
    );
}

export default RecentView;
