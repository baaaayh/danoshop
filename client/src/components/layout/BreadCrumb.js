import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styles from './BreadCrumb.module.scss';

function BreadCrumb({ title, path }) {
    const location = useLocation();
    const [menuList, setMenuList] = useState([]);
    const menuListData = useSelector((state) => state.menu.menuList);

    useEffect(() => {
        if (menuListData.length > 0) {
            setMenuList(menuListData[0].menu);
        }
    }, [menuListData]);

    const filteredMenuList = menuList.filter((item) => path.category === item.category);

    return (
        <div className={styles.breadcrumb}>
            <nav>
                <ul>
                    <li>
                        <Link to="/">홈</Link>
                    </li>
                    {filteredMenuList.map((item, index) => (
                        <React.Fragment key={`fragment-${index}`}>
                            <li key={`depth1-${index}`}>
                                <Link to={`/${item.pageType}/${item.category}`} state={{ title: [title[0]] }}>
                                    {item.depth1}
                                </Link>
                            </li>
                            {path.type &&
                                item.depth2 &&
                                item.depth2.length > 0 &&
                                item.depth2.map((depth2Item, depth2Index) => {
                                    if (depth2Item.type === path.type) {
                                        return (
                                            <li key={`depth2-${index}-${depth2Index}`}>
                                                <Link to={`/${item.pageType}/${path.category}/${path.type}`} state={{ title: [depth2Item.name] }}>
                                                    {depth2Item.name}
                                                </Link>
                                            </li>
                                        );
                                    }
                                })}
                        </React.Fragment>
                    ))}

                    {title.map((depth, index) => (
                        <li key={index}>
                            <Link to={location.pathname} state={{ title: [...title] }}>
                                {depth}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default BreadCrumb;
