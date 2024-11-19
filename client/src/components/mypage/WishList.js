import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import MyPageBox from "./MyPageBox";
import styles from "./WishList.module.scss";
import ItemDetail from "../layout/ItemDetail";
import axios from "axios";
import Pagination from "../layout/Pagination";

function WishList() {
    const [pagingButtons, setPagingButtons] = useState(0);
    const [wishList, setWishList] = useState([]);
    const [checkedOptions, setCheckedOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const userInfo = useSelector((state) => state.user);

    const fetchWishList = useCallback(
        async (page) => {
            try {
                if (userInfo.token) {
                    const response = await axios.post(
                        "http://localhost:4000/api/getWishList",
                        {
                            userId: userInfo.userId,
                            page: currentPage,
                            itemsPerPage: itemsPerPage,
                        }
                    );
                    setPagingButtons(response.data.pagingButtons);
                    setWishList(response.data.wishList);
                }
            } catch (error) {
                console.error(error);
            }
        },
        [userInfo.token, userInfo.userId, currentPage, itemsPerPage]
    );

    useEffect(() => {
        fetchWishList();
    }, [fetchWishList]);

    const handleCheckbox = useCallback((optionId, uniqueId) => {
        setCheckedOptions((prev) => ({
            ...prev,
            [uniqueId]: !prev[uniqueId], // 상태 반전
        }));
    }, []);

    const handleRemoveAll = async () => {
        try {
            if (window.confirm("관심상품을 비우시겠습니까?")) {
                if (userInfo.token) {
                    const response = await axios.post(
                        "http://localhost:4000/api/clearWishList",
                        {
                            userId: userInfo.userId,
                        }
                    );
                    setPagingButtons(response.data.pagingButtons);
                    setWishList(response.data.wishList);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const removeItem = async (uniqueId) => {
        try {
            if (window.confirm("해당 상품을 삭제하시겠습니까?")) {
                if (userInfo.token) {
                    const response = await axios.post(
                        "http://localhost:4000/api/removeWishListItem",
                        {
                            userId: userInfo.userId,
                            itemUniqueId: uniqueId,
                            page: currentPage,
                            itemsPerPage: itemsPerPage,
                        }
                    );
                    setPagingButtons(response.data.pagingButtons);
                    setWishList(response.data.wishList);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const removeSelectedItems = async () => {
        try {
            let checkedOptionsArray = [];
            for (const key in checkedOptions) {
                checkedOptionsArray.push(key);
            }

            if (checkedOptionsArray.length <= 0) {
                alert("제품을 선택해 주세요.");
                return;
            }

            if (window.confirm("해당 상품을 삭제하시겠습니까?")) {
                if (userInfo.token) {
                    const response = await axios.post(
                        "http://localhost:4000/api/removeWishListItem",
                        {
                            itemUniqueId: checkedOptionsArray,
                            userId: userInfo.userId,
                            page: currentPage,
                            itemsPerPage: itemsPerPage,
                        }
                    );
                    setPagingButtons(response.data.pagingButtons);
                    setWishList(response.data.wishList);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <MyPageBox title="나의 관심 상품">
                <div className={styles["wish-list"]}>
                    {wishList.length > 0 ? (
                        <ul>
                            {wishList.map((item, index) => {
                                const uniqueId = item.uniqueId;
                                return (
                                    <ItemDetail
                                        itemValue={item}
                                        key={
                                            uniqueId
                                                ? uniqueId
                                                : `${item.id}-${index}`
                                        }
                                        handleCheckbox={handleCheckbox}
                                        setCheckedOptions={setCheckedOptions}
                                        checkedOptions={checkedOptions}
                                        removeItem={removeItem}
                                    />
                                );
                            })}
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
            <div className="select-button tar">
                <ul>
                    <li>
                        <button
                            type="button"
                            className="btn btn-square btn-square--white"
                            onClick={handleRemoveAll}
                        >
                            <span className="btn-square__text">전체삭제</span>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="btn btn-square btn-square--white"
                            onClick={removeSelectedItems}
                        >
                            <span className="btn-square__text">선택삭제</span>
                        </button>
                    </li>
                </ul>
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagingButtons={pagingButtons}
            />
        </>
    );
}

export default WishList;
