import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import SubContents from "../../components/layout/SubContents";
import BreadCrumb from "../../components/layout/BreadCrumb";
import SubTitle from "../../components/layout/SubTitle";
import ProductList from "../../components/layout/ProductList";
import SearchInput from "../../components/layout/SearchInput";
import Pagination from "../../components/layout/Pagination";
import axios from "axios";

function SearchResult() {
    const params = useParams();
    const location = useLocation();
    const parameter = new URLSearchParams(location.search);
    const text = parameter.get("search");
    const title = location.state?.title || ["상품검색"];
    const [productList, setProductList] = useState([]);
    const [pagingButtons, setPagingButtons] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;

    const getSearchResults = useCallback(async () => {
        try {
            const response = await axios.post(
                "http://localhost:4000/api/searchItems",
                {
                    searchText: text,
                    page: currentPage,
                    itemsPerPage,
                }
            );
            setPagingButtons(response.data.pagingButtons);
            setProductList(response.data.searchResult);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    }, [text, currentPage, itemsPerPage]);

    useEffect(() => {
        getSearchResults();
    }, [getSearchResults]);

    return (
        <SubContents>
            <BreadCrumb title={title} path={params} />
            <SubTitle title={title} />
            <SearchInput />
            <ProductList
                title={title}
                path={params}
                productList={productList}
            />
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagingButtons={pagingButtons}
            />
        </SubContents>
    );
}

export default SearchResult;
