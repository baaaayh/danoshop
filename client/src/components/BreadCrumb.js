import { useState, useEffect } from "react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./BreadCrumb.module.scss";

function BreadCrumb({ menu, title, path }) {
    const params = useParams();
    const [menuList, setMenuList] = useState({ menu: [] });

    useEffect(() => {
        setMenuList(menu);
    }, [menu]);

    return (
        <div className={styles.breadcrumb}>
            <nav>
                <ul>
                    <li>
                        <Link to="/">홈</Link>
                    </li>
                    {menuList &&
                        menuList.menu.map((item, index) => {
                            if (params.category === item.category) {
                                return (
                                    <React.Fragment key={`fragment-${index}`}>
                                        <li key={`depth1-${index}`}>
                                            <Link
                                                to={`/${item.pageType}/${item.category}`}
                                                state={{
                                                    title: [title[0]],
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
                                                        title: [...title],
                                                    }}
                                                >
                                                    {title[1]}
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
