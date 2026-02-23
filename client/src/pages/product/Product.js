import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import SubContents from "../../components/layout/SubContents";
import BreadCrumb from "../../components/layout/BreadCrumb";
import SubTitle from "../../components/layout/SubTitle";
import ProductList from "../../components/layout/ProductList";
import Pagination from "../../components/layout/Pagination";
import axios from "axios";

function Product() {
  const params = useParams();
  const location = useLocation();
  const title = location.state?.title || ["전상품"];
  const [productList, setProductList] = useState([]);
  const [pagingButtons, setPagingButtons] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  const getProductList = useCallback(async () => {
    try {
      const response = await axios.post("/api/product", {
        page: currentPage,
        itemsPerPage: itemsPerPage,
      });
      setPagingButtons(response.data.pagingButtons);
      setProductList(response.data.productView);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    getProductList();
  }, [getProductList]);

  return (
    <SubContents>
      <BreadCrumb title={title} path={params} />
      <SubTitle title={title} />
      <ProductList title={title} path={params} productList={productList} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagingButtons={pagingButtons}
      />
    </SubContents>
  );
}

export default Product;
