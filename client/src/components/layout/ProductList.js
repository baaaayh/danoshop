import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TabMenu from "./TabMenu";
import ProudctListItem from "./ProductListItem";

function ProductList({ type, path, title }) {
    const [params, setParams] = useState([]);
    const [menuList, setMenuList] = useState({ menu: [] });
    const [productList, setProductList] = useState([]);
    const menuListData = useSelector((state) => state.menu.menuList);

    const getProductList = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/product"
            );
            setProductList(response.data);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };

    useEffect(() => {
        getProductList();
    }, []);

    useEffect(() => {
        setMenuList(menuListData[0]);
    }, [menuListData]);

    useEffect(() => {
        setParams(path);
    }, [path]);

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
                <ul>
                    <ProudctListItem
                        productList={productList}
                        type={type}
                        title={title}
                        prevPage={params}
                    />
                </ul>
            </div>
        </>
    );
}

export default ProductList;
