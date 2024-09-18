import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import SubContents from "../../components/SubContents";
import BreadCrumb from "../../components/BreadCrumb";
import SubTitle from "../../components/SubTitle";
import ProductList from "../../components/ProductList";

function Product({ product, menu }) {
    const [productList, setProudctList] = useState(product);
    const params = useParams();
    const location = useLocation();
    const title = location.state?.title || ["전상품"];

    useEffect(() => {
        setProudctList(product);
    }, [product]);

    return (
        <SubContents>
            <BreadCrumb menu={menu} title={title} path={params} />
            <SubTitle title={title} />
            <ProductList productList={productList} />
        </SubContents>
    );
}

export default Product;
