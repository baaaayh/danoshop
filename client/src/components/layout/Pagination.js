import React, { useState, useCallback, useEffect } from "react";
import styles from "./Pagination.module.scss";

function Pagination({ currentPage, setCurrentPage, pagingButtons }) {
    const [activePage, setActivePage] = useState(0);
    const [currentPageGroup, setCurrentPageGroup] = useState(0);

    const itemsPerPageGroup = 10;
    const startNumber = currentPageGroup * itemsPerPageGroup;
    const endNumber = Math.min(startNumber + itemsPerPageGroup, pagingButtons);

    const handlePageClick = useCallback(
        (index) => {
            setActivePage(index);
            setCurrentPage(index);

            // 페이지 번호가 현재 그룹 범위를 벗어날 경우 그룹을 이동
            if (index >= endNumber) {
                setCurrentPageGroup((prevGroup) => prevGroup + 1);
            } else if (index < startNumber) {
                setCurrentPageGroup((prevGroup) => Math.max(prevGroup - 1, 0));
            }
        },
        [endNumber, startNumber, setCurrentPage]
    );

    const renderButton = () => {
        let buttonArray = [];
        for (let i = startNumber; i < endNumber; i++) {
            buttonArray.push(
                <li key={`pagination-button-${i}`}>
                    <button
                        type="button"
                        value={i}
                        className={`${styles.pagination__button} ${
                            activePage === i
                                ? styles["pagination__button--active"]
                                : ""
                        }`}
                        onClick={() => handlePageClick(i)}
                    >
                        {i + 1}
                    </button>
                </li>
            );
        }
        return buttonArray;
    };

    useEffect(() => {
        setActivePage(currentPage);
    }, [currentPage]);

    return (
        <div className={`pagination ${styles.pagination}`}>
            <ul>
                <li>
                    <button
                        type="button"
                        className={`${styles.pagination__button} ${styles.pagination__first} ${styles.pagination__nav}`}
                        onClick={() => handlePageClick(0)}
                    >
                        FIRST
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={`${styles.pagination__button} ${styles.pagination__prev} ${styles.pagination__nav}`}
                        onClick={() =>
                            handlePageClick(Math.max(activePage - 1, 0))
                        }
                    >
                        PREV
                    </button>
                </li>

                {renderButton()}

                <li>
                    <button
                        type="button"
                        className={`${styles.pagination__button} ${styles.pagination__next} ${styles.pagination__nav}`}
                        onClick={() =>
                            handlePageClick(
                                Math.min(activePage + 1, pagingButtons - 1)
                            )
                        }
                    >
                        NEXT
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={`${styles.pagination__button} ${styles.pagination__last} ${styles.pagination__nav}`}
                        onClick={() => handlePageClick(pagingButtons - 1)}
                    >
                        LAST
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Pagination;
