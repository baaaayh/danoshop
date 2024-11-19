import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import TabMenu from "./TabMenu";
import ProudctListItem from "./ProductListItem";

function ProductList({ type, path, title, productList }) {
    const [params, setParams] = useState([]);
    const location = useLocation();
    const [menuList, setMenuList] = useState({ menu: [] });
    const menuListData = useSelector((state) => state.menu.menuList);
    const { category, type: paramType } = useParams();
    const { pathname } = useLocation();
    const [list, setList] = useState([]);

    useEffect(() => {
        setMenuList(menuListData[0]);
    }, [menuListData]);

    useEffect(() => {
        setParams(path);
    }, [path]);

    useEffect(() => {
        if (productList.length === 0) return;

        let filteredList = productList;

        if (pathname === "/") {
            filteredList = filteredList.filter(
                (item) => item.type === type && item.mainExpose === "true"
            );
        } else if (pathname === "/search/searchResult") {
            filteredList = productList;
        } else if (category !== "all") {
            if (paramType === undefined) {
                filteredList = filteredList.filter(
                    (item) => item.category === category
                );
            } else {
                filteredList = filteredList.filter(
                    (item) => item.type === paramType
                );
            }
        }

        setList(filteredList);
    }, [productList, type, paramType, pathname, category]);

    return (
        <>
            {menuList &&
                menuList.menu.map((item) => {
                    return params && params.category === item.category ? (
                        <TabMenu
                            pageType={item.pageType}
                            category={item.category}
                            depth1={item.depth1}
                            menu={item.depth2}
                            key={item.category}
                            productList={productList}
                        />
                    ) : null;
                })}

            <div className="product">
                {location.pathname === "/search/searchResult" ? (
                    <p>
                        상품 검색 결과 <strong>{list.length}</strong>
                    </p>
                ) : (
                    <p>
                        총<strong>{list.length}</strong> 개의 상품이 있습니다.
                    </p>
                )}

                {productList.length > 0 ? (
                    <ul>
                        <ProudctListItem
                            list={list}
                            type={type}
                            title={title}
                            prevPage={params}
                        />
                    </ul>
                ) : (
                    <div className="no-item">
                        <p>
                            <img
                                src="../images/icons/icon_no_item.svg"
                                alt="검색 결과가 없습니다."
                            />
                            검색 결과가 없습니다.
                        </p>
                        <span>
                            검색어/제외검색어의 입력이 정확한지 확인해 보세요.
                            <br />두 단어 이상의 검색어인 경우, 띄어쓰기를
                            확인해 보세요.
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProductList;
