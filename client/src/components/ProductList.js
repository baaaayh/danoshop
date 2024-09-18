import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TabMenu from "./TabMenu";
import ProudctListItem from "./ProductListItem";

function ProductList({ productList, type }) {
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
        <>
            {menuList.menu.map((item) => {
                return params.category === item.category ? (
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
                    <ProudctListItem productList={productList} type={type} />
                </ul>
            </div>
        </>
    );
}

export default ProductList;
