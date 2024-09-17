import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SubContents from "../../components/SubContents";
import BreadCrumb from "../../components/BreadCrumb";
import SubTitle from "../../components/SubTitle";
import ProductList from "../../components/ProductList";

function Product() {
    const location = useLocation();
    const productType = location.state.productType;
    const [productList, setProudctList] = useState([]);

    const getProductList = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/product"
            );
            setProudctList(response.data);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };

    useEffect(() => {
        getProductList();
    }, []);

    return (
        <SubContents>
            <BreadCrumb title={"전상품"} type={productType} />
            <SubTitle title={"전상품"} />
            <ProductList productList={productList} type={productType} />
        </SubContents>
    );
}

export default Product;
