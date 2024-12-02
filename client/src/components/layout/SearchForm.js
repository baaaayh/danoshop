import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showDim, hiddenDim } from "../../modules/dimToggle";

function SearchForm({ closeSearchFunc, headerState }) {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchForm = useRef();

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(hiddenDim());
        closeSearchFunc();
        navigate(
            `/search/searchResult?search=${encodeURIComponent(searchText)}`
        );
        setSearchText("");
    };

    const handleChange = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div
            className={
                headerState ? "search-form search-form--active" : "search-form"
            }
            ref={searchForm}
        >
            <div className="search-form__inner">
                <h2>SEARCH</h2>
                <div className="search-form__box">
                    <div className="search-form__input">
                        <input
                            type="text"
                            placeholder="검색어를 입력해 주세요."
                            value={searchText}
                            onChange={handleChange}
                        />
                        <button
                            type="submit"
                            className="btn btn-search"
                            onClick={onSubmit}
                        >
                            검색
                        </button>
                    </div>
                    <button
                        type="button"
                        className="btn btn-close"
                        onClick={closeSearchFunc}
                    >
                        <span>닫기</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchForm;
