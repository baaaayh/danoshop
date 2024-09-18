import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import styles from "./BreadCrumb.module.scss";

function BreadCrumb({ title, path }) {
    const params = useParams();
    const [menuList, setMenuList] = useState({ menu: [] });

    const getMenuList = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/menu");
            setMenuList(response.data);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };

    useEffect(() => {
        getMenuList();
    }, []);

    return (
        <div className={styles.breadcrumb}>
            <nav>
                <ul>
                    <li>
                        <Link to="/">홈</Link>
                    </li>
                    {menuList.menu.map((item, index) => {
                        // 1뎁스 카테고리 매칭 확인
                        if (params.category === item.category) {
                            return (
                                <React.Fragment key={`fragment-${index}`}>
                                    <li key={`depth1-${index}`}>
                                        <Link
                                            to={`/${item.pageType}/${item.category}`}
                                            state={{
                                                title: title,
                                            }}
                                        >
                                            {item.depth1}
                                        </Link>
                                    </li>
                                    {path.type ? (
                                        <li
                                            key={`depth2-${index}-${path.type}`}
                                        >
                                            <Link
                                                to={`/${item.pageType}/${path.category}/${path.type}`}
                                                state={{
                                                    title: title,
                                                }}
                                            >
                                                {title[title.length - 1]}
                                            </Link>
                                        </li>
                                    ) : null}
                                </React.Fragment>
                            );
                        }
                        return null;
                    })}
                </ul>
            </nav>
        </div>
    );
}

export default BreadCrumb;
