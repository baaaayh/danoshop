import React, { useState, useCallback, useEffect } from "react";
import styles from "./Pagination.module.scss";

function Pagination({ currentPage, setCurrentPage, pagingButtons }) {
    const [activePage, setActivePage] = useState(0);
    const [currentPageGroup, setCurrentPageGroup] = useState(0);
    const itemsPerPageGroup = 10;
    const totalGroups = Math.ceil(pagingButtons / itemsPerPageGroup);
    const startNumber = currentPageGroup * itemsPerPageGroup;
    const endNumber = Math.min(startNumber + itemsPerPageGroup, pagingButtons);

    const handlePageClick = useCallback(
        (index) => {
            setActivePage(index);
            setCurrentPage(index);

            if (index >= endNumber) {
                setCurrentPageGroup((prevGroup) => prevGroup + 1);
            } else if (index <= startNumber) {
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
                        onClick={() => {
                            setCurrentPage(0);
                            setCurrentPageGroup(0);
                        }}
                    >
                        FIRST
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={`${styles.pagination__button} ${styles.pagination__prev} ${styles.pagination__nav}`}
                        onClick={() => {
                            if (currentPageGroup > 0) {
                                setCurrentPageGroup(
                                    (prevGroup) => prevGroup - 1
                                );
                                setCurrentPage(
                                    currentPageGroup * itemsPerPageGroup - 1
                                );
                            }
                        }}
                    >
                        PREV
                    </button>
                </li>

                {renderButton()}

                <li>
                    <button
                        type="button"
                        className={`${styles.pagination__button} ${styles.pagination__next} ${styles.pagination__nav}`}
                        onClick={() => {
                            if (currentPageGroup < totalGroups - 1) {
                                setCurrentPageGroup(
                                    (prevGroup) => prevGroup + 1
                                );
                                setCurrentPage(
                                    (currentPageGroup + 1) * itemsPerPageGroup
                                );
                            }
                        }}
                    >
                        NEXT
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={`${styles.pagination__button} ${styles.pagination__last} ${styles.pagination__nav}`}
                        onClick={() => {
                            const lastPage = pagingButtons - 1;
                            setCurrentPage(lastPage);
                            setCurrentPageGroup(
                                Math.floor(lastPage / itemsPerPageGroup)
                            );
                        }}
                    >
                        LAST
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Pagination;
