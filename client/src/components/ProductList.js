import React from "react";
import ProudctListItem from "./ProductListItem";
import "./ProductList.scss";

function ProductList({ productList, type }) {
    return (
        <div className="product">
            <ul>
                <ProudctListItem productList={productList} type={type} />
            </ul>
        </div>
    );
}

export default ProductList;
