import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SubContents from "../../components/layout/SubContents";
import BreadCrumb from "../../components/layout/BreadCrumb";
import SubTitle from "../../components/layout/SubTitle";
import ProductList from "../../components/layout/ProductList";
import axios from "axios";

function Product() {
    const params = useParams();
    const location = useLocation();
    const title = location.state?.title || ["전상품"];
    const [productList, setProductList] = useState([]);

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

    return (
        <SubContents>
            <BreadCrumb title={title} path={params} />
            <SubTitle title={title} />
            <ProductList
                title={title}
                path={params}
                productList={productList}
            />
        </SubContents>
    );
}

export default Product;
