import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./BreadCrumb.module.scss";

function BreadCrumb({ title, path }) {
    const [menuList, setMenuList] = useState([]);
    const menuListData = useSelector((state) => state.menu.menuList);

    useEffect(() => {
        if (menuListData.length > 0) {
            setMenuList(menuListData[0].menu); // menuListData의 첫 번째 항목에서 menu 배열 설정
        }
    }, [menuListData]);

    return (
        <div className={styles.breadcrumb}>
            <nav>
                <ul>
                    <li>
                        <Link to="/">홈</Link>
                    </li>
                    {menuList.map((item, index) => {
                        if (path.category === item.category) {
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
                                    {path.type &&
                                    item.depth2 &&
                                    item.depth2.length > 0
                                        ? item.depth2.map(
                                              (depth2Item, depth2Index) => {
                                                  if (
                                                      depth2Item.type ===
                                                      path.type
                                                  ) {
                                                      return (
                                                          <li
                                                              key={`depth2-${index}-${depth2Index}`}
                                                          >
                                                              <Link
                                                                  to={`/${item.pageType}/${path.category}/${path.type}`}
                                                                  state={{
                                                                      title: [
                                                                          title[1],
                                                                      ],
                                                                  }}
                                                              >
                                                                  {
                                                                      depth2Item.name
                                                                  }
                                                              </Link>
                                                          </li>
                                                      );
                                                  }
                                                  return null;
                                              }
                                          )
                                        : null}
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
