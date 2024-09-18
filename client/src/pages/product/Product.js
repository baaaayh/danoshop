import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import SubContents from "../../components/SubContents";
import BreadCrumb from "../../components/BreadCrumb";
import SubTitle from "../../components/SubTitle";
import ProductList from "../../components/ProductList";

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
    }, []); // productType이 변경될 때마다 호출

    return (
        <SubContents>
            <BreadCrumb title={title} path={params} />
            <SubTitle title={title} />
            <ProductList productList={productList} />
        </SubContents>
    );
}

export default Product;
